"""Dead Reckoning Visualizer — standard-library Tkinter app.
Load an Experiment 4 CSV with columns: side,distance_cm,gyro_heading_deg,encoder_heading_deg,x_cm,y_cm.
If x/y are absent, positions are reconstructed from distance and gyro heading.
"""
import csv, math, tkinter as tk
from tkinter import filedialog, messagebox, ttk

DEMO = [
    {'side':1,'distance_cm':100,'gyro_heading_deg':0,'encoder_heading_deg':0,'x_cm':100,'y_cm':0},
    {'side':2,'distance_cm':98,'gyro_heading_deg':-90,'encoder_heading_deg':-96,'x_cm':101,'y_cm':-98},
    {'side':3,'distance_cm':101,'gyro_heading_deg':-180,'encoder_heading_deg':-185,'x_cm':0,'y_cm':-100},
    {'side':4,'distance_cm':99,'gyro_heading_deg':-270,'encoder_heading_deg':-278,'x_cm':-2,'y_cm':0},
]
class App:
 def __init__(self, root):
  self.root=root; root.title('Dead Reckoning Visualizer'); root.geometry('900x650'); self.rows=DEMO[:]
  top=ttk.Frame(root,padding=10); top.pack(fill='x'); ttk.Label(top,text='Dead Reckoning Visualizer',font=('Segoe UI',17,'bold')).pack(side='left'); ttk.Button(top,text='Load Experiment 4 CSV',command=self.load).pack(side='right'); ttk.Button(top,text='Use demo data',command=lambda:self.setrows(DEMO[:])).pack(side='right',padx=6)
  self.info=ttk.Label(root,padding=8); self.info.pack(fill='x'); self.canvas=tk.Canvas(root,bg='#fbfcfe',height=470,highlightthickness=1,highlightbackground='#d5dce5'); self.canvas.pack(fill='both',expand=True,padx=10,pady=5); self.table=ttk.Treeview(root,columns=('side','distance','heading','x','y'),show='headings',height=5)
  for c,t,w in [('side','Side',70),('distance','Distance (cm)',140),('heading','Gyro heading (deg)',180),('x','X (cm)',120),('y','Y (cm)',120)]: self.table.heading(c,text=t); self.table.column(c,width=w,anchor='center')
  self.table.pack(fill='x',padx=10,pady=(0,10)); self.setrows(self.rows); self.canvas.bind('<Configure>',lambda e:self.draw())
 def load(self):
  path=filedialog.askopenfilename(filetypes=[('CSV files','*.csv'),('All files','*.*')])
  if not path:return
  try:
   with open(path,newline='') as f: rows=list(csv.DictReader(f))
   if not rows: raise ValueError('CSV is empty')
   parsed=[]; x=y=0
   for i,r in enumerate(rows):
    d=float(r.get('distance_cm',r.get('distance',0))); h=float(r.get('gyro_heading_deg',r.get('gyro',0)))
    if r.get('x_cm') not in (None,'') and r.get('y_cm') not in (None,''): x,y=float(r['x_cm']),float(r['y_cm'])
    else: x+=d*math.cos(math.radians(h)); y+=d*math.sin(math.radians(h))
    parsed.append({'side':int(float(r.get('side',i+1))),'distance_cm':d,'gyro_heading_deg':h,'encoder_heading_deg':float(r.get('encoder_heading_deg',0) or 0),'x_cm':x,'y_cm':y})
   self.setrows(parsed)
  except Exception as e: messagebox.showerror('Could not load CSV',str(e))
 def setrows(self,rows):
  self.rows=rows
  for i in self.table.get_children(): self.table.delete(i)
  for r in rows:self.table.insert('', 'end',values=(r['side'],f"{r['distance_cm']:.1f}",f"{r['gyro_heading_deg']:.1f}",f"{r['x_cm']:.1f}",f"{r['y_cm']:.1f}"))
  end=rows[-1]; err=math.hypot(end['x_cm'],end['y_cm']); self.info.config(text=f"Estimated endpoint: ({end['x_cm']:.1f}, {end['y_cm']:.1f}) cm    |    Distance from start: {err:.1f} cm    |    Demo data is illustrative until you load your own CSV."); self.draw()
 def draw(self):
  c=self.canvas; c.delete('all'); w=max(c.winfo_width(),400); h=max(c.winfo_height(),300); margin=45
  coords=[(0,0)]+[(r['x_cm'],r['y_cm']) for r in self.rows]; lim=max([abs(v) for p in coords for v in p]+[100])*1.2; scale=min((w-2*margin)/(2*lim),(h-2*margin)/(2*lim)); ox=w/2; oy=h/2
  def xy(p):return ox+p[0]*scale,oy-p[1]*scale
  for k in range(-int(lim//50),int(lim//50)+1):
   x=ox+k*50*scale; y=oy-k*50*scale;c.create_line(x,margin,x,h-margin,fill='#e9edf3');c.create_line(margin,y,w-margin,y,fill='#e9edf3')
  ideal=[(0,0),(100,0),(100,-100),(0,-100),(0,0)]; pts=[xy(p) for p in ideal]; c.create_line(*[v for p in pts for v in p],fill='#9aa6b2',width=2,dash=(5,4))
  pts=[xy(p) for p in coords]; c.create_line(*[v for p in pts for v in p],fill='#1677c8',width=3)
  for i,(x,y) in enumerate(pts): c.create_oval(x-4,y-4,x+4,y+4,fill='#1677c8',outline=''); c.create_text(x+8,y-10,text='Start' if i==0 else str(i),anchor='w',fill='#233044')
  c.create_text(12,12,anchor='nw',text='Blue: estimated path    Dashed grey: ideal 1 m square',fill='#233044')
if __name__=='__main__':
 root=tk.Tk(); App(root); root.mainloop()
