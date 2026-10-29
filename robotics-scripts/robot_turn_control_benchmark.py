"""Robot Turn-Control Benchmark. Compare repeated turns from Experiment 2 CSV.
Expected columns: trial,gyro_angle_deg,encoder_angle_deg; target defaults to -90 degrees.
"""
import csv, tkinter as tk
from tkinter import ttk,filedialog,messagebox
DEMO=[{'trial':i,'gyro_angle_deg':g,'encoder_angle_deg':e} for i,(g,e) in enumerate([(-89,-117),(-91,-120),(-90,-116),(-92,-123),(-89,-119)],1)]
TARGET=-90.0
class App:
 def __init__(self,r):
  self.r=r;r.title('Robot Turn-Control Benchmark');r.geometry('820x560');top=ttk.Frame(r,padding=12);top.pack(fill='x');ttk.Label(top,text='Robot Turn-Control Benchmark',font=('Segoe UI',17,'bold')).pack(side='left');ttk.Button(top,text='Load Experiment 2 CSV',command=self.load).pack(side='right');ttk.Button(top,text='Demo data',command=lambda:self.show(DEMO)).pack(side='right',padx=6)
  self.summary=ttk.Label(r,padding=10);self.summary.pack(fill='x');self.canvas=tk.Canvas(r,bg='white',height=300);self.canvas.pack(fill='both',expand=True,padx=12,pady=8);self.table=ttk.Treeview(r,columns=('trial','gyro','error','encoder','difference'),show='headings',height=6)
  for c,t,w in [('trial','Trial',70),('gyro','Gyro angle (°)',130),('error','Target error (°)',140),('encoder','Encoder angle (°)',150),('difference','Encoder − gyro (°)',160)]:self.table.heading(c,text=t);self.table.column(c,width=w,anchor='center')
  self.table.pack(fill='x',padx=12,pady=10);self.show(DEMO)
 def load(self):
  p=filedialog.askopenfilename(filetypes=[('CSV','*.csv')])
  if not p:return
  try:
   with open(p,newline='') as f:rows=list(csv.DictReader(f))
   self.show([{'trial':int(float(x.get('trial',i+1))),'gyro_angle_deg':float(x['gyro_angle_deg']),'encoder_angle_deg':float(x['encoder_angle_deg'])} for i,x in enumerate(rows)])
  except Exception as e:messagebox.showerror('CSV error',str(e))
 def show(self,rows):
  self.rows=[]
  for r in rows:self.rows.append((r['trial'],r['gyro_angle_deg'],r['gyro_angle_deg']-TARGET,r['encoder_angle_deg'],r['encoder_angle_deg']-r['gyro_angle_deg']))
  for i in self.table.get_children():self.table.delete(i)
  for row in self.rows:self.table.insert('','end',values=(row[0],*(f'{x:.2f}' for x in row[1:])))
  avg=sum(abs(x[2]) for x in self.rows)/max(1,len(self.rows));spread=max(x[1] for x in self.rows)-min(x[1] for x in self.rows) if self.rows else 0;self.summary.config(text=f'Mean absolute gyro target error: {avg:.2f}°    |    Gyro-angle spread: {spread:.2f}°    |    Target: {TARGET:.0f}°    |    Demo values are simulated.')
  self.draw()
 def draw(self):
  c=self.canvas;c.delete('all');w=max(c.winfo_width(),400);h=max(c.winfo_height(),200);m=45;vals=[x[1] for x in self.rows]+[TARGET];lo=min(vals)-8;hi=max(vals)+8;scale=(h-2*m)/(hi-lo);c.create_text(12,10,anchor='nw',text='Gyroscope final angle per trial (target shown dashed)');yt=h-m-(TARGET-lo)*scale;c.create_line(m,yt,w-m,yt,fill='#e38b36',width=2,dash=(5,3))
  step=(w-2*m)/max(1,len(self.rows))
  for i,row in enumerate(self.rows):
   x=m+(i+.5)*step;y=h-m-(row[1]-lo)*scale;c.create_oval(x-6,y-6,x+6,y+6,fill='#1677c8',outline='');c.create_text(x,h-m+15,text=str(row[0]))
if __name__=='__main__':
 root=tk.Tk();App(root);root.mainloop()
