"""Skid-Steer Slip Analyzer. Load Experiment 2 CSV or use clearly marked demo trials."""
import csv, tkinter as tk
from tkinter import ttk, filedialog, messagebox
DEMO=[{'trial':i,'gyro_angle_deg':-90+(i%3-1)*1.2,'encoder_angle_deg':-118+(i%2)*3,'used_track_width_cm':14.0} for i in range(1,6)]
class App:
 def __init__(self,r):
  self.r=r;r.title('Skid-Steer Slip Analyzer');r.geometry('850x570');self.rows=[]
  bar=ttk.Frame(r,padding=12);bar.pack(fill='x');ttk.Label(bar,text='Skid-Steer Slip Analyzer',font=('Segoe UI',17,'bold')).pack(side='left');ttk.Button(bar,text='Load Experiment 2 CSV',command=self.load).pack(side='right');ttk.Button(bar,text='Demo trials',command=lambda:self.show(DEMO)).pack(side='right',padx=5)
  self.summary=ttk.Label(r,padding=10);self.summary.pack(fill='x');self.canvas=tk.Canvas(r,bg='white',height=300);self.canvas.pack(fill='both',expand=True,padx=12,pady=6);self.table=ttk.Treeview(r,columns=('trial','gyro','enc','ratio','width'),show='headings',height=6)
  for col,title,width in [('trial','Trial',70),('gyro','Gyro angle (°)',130),('enc','Encoder angle (°)',150),('ratio','Encoder / gyro',140),('width','Effective width (cm)',170)]:self.table.heading(col,text=title);self.table.column(col,width=width,anchor='center')
  self.table.pack(fill='x',padx=12,pady=10);self.show(DEMO)
 def load(self):
  p=filedialog.askopenfilename(filetypes=[('CSV','*.csv')])
  if not p:return
  try:
   with open(p,newline='') as f: data=list(csv.DictReader(f))
   self.show([{'trial':int(float(x.get('trial',i+1))),'gyro_angle_deg':float(x['gyro_angle_deg']),'encoder_angle_deg':float(x['encoder_angle_deg']),'used_track_width_cm':float(x.get('used_track_width_cm',14))} for i,x in enumerate(data)])
  except Exception as e:messagebox.showerror('CSV error',str(e))
 def show(self,rows):
  self.rows=[]
  for r in rows:
   g=r['gyro_angle_deg'];e=r['encoder_angle_deg'];ratio=e/g if abs(g)>1e-6 else 0; width=r['used_track_width_cm']*ratio
   self.rows.append((r['trial'],g,e,ratio,width))
  for i in self.table.get_children():self.table.delete(i)
  for n,g,e,ra,b in self.rows:self.table.insert('','end',values=(n,f'{g:.2f}',f'{e:.2f}',f'{ra:.3f}',f'{b:.2f}'))
  valid=[x[4] for x in self.rows if x[4]>0];avg=sum(valid)/len(valid) if valid else 0;self.summary.config(text=f'Mean effective track width: {avg:.2f} cm    |    Estimated encoder over-rotation: {abs(sum(x[3] for x in self.rows)/max(1,len(self.rows))):.2f}×    |    Demo values are simulated.')
  self.draw()
 def draw(self):
  c=self.canvas;c.delete('all');w=max(c.winfo_width(),400);h=max(c.winfo_height(),200);m=45;barw=min(55,(w-2*m)/max(1,len(self.rows)*2));maxv=max([abs(x[1]) for x in self.rows]+[abs(x[2]) for x in self.rows]+[1])*1.2;scale=(h-2*m)/maxv
  c.create_text(12,10,anchor='nw',text='Gyroscope vs encoder angle (degrees)');c.create_line(m,h-m,w-m,h-m,fill='#9aa6b2')
  for i,(n,g,e,_,__) in enumerate(self.rows):
   x=m+i*2*barw+10
   for j,(v,col) in enumerate(((g,'#1684c7'),(e,'#e38b36'))):
    yy=h-m-abs(v)*scale;c.create_rectangle(x+j*barw,yy,x+(j+1)*barw-3,h-m,fill=col,outline='');c.create_text(x+j*barw+barw/2,h-m+13,text=str(n),font=('Segoe UI',8))
  c.create_text(w-155,12,anchor='nw',text='Blue: gyro  Orange: encoder')
if __name__=='__main__':
 root=tk.Tk();App(root);root.mainloop()
