"""Differential-Drive Digital Twin — interactive, illustrative kinematic simulation.
Uses only Python standard library + Tkinter. Parameters are model assumptions, not robot measurements.
"""
import tkinter as tk, math, random
from tkinter import ttk
class App:
 def __init__(self,r):
  self.r=r;r.title('Differential-Drive Digital Twin');r.geometry('900x650');self.path=[];self.running=False
  panel=ttk.Frame(r,padding=10);panel.pack(fill='x');ttk.Label(panel,text='Differential-Drive Digital Twin',font=('Segoe UI',17,'bold')).grid(row=0,column=0,columnspan=4,sticky='w',pady=(0,8))
  self.vars={}
  specs=[('Wheel base (cm)',14,5,30),('Speed (cm/s)',20,5,50),('Gyro bias (deg/s)',0.4,-2,2),('Slip factor',1.3,1,2.5),('Distance scale error (%)',0,-10,10)]
  for i,(label,val,lo,hi) in enumerate(specs):
   ttk.Label(panel,text=label).grid(row=i+1,column=0,sticky='w');v=tk.DoubleVar(value=val);self.vars[label]=v;ttk.Scale(panel,from_=lo,to=hi,variable=v,orient='horizontal',length=220).grid(row=i+1,column=1,padx=8,sticky='w');ttk.Label(panel,textvariable=v,width=7).grid(row=i+1,column=2,sticky='w')
  ttk.Button(panel,text='Simulate 1 m square',command=self.simulate).grid(row=1,column=3,padx=15);ttk.Button(panel,text='Reset',command=self.reset).grid(row=2,column=3,padx=15)
  self.status=ttk.Label(r,padding=8);self.status.pack(fill='x');self.canvas=tk.Canvas(r,bg='#fbfcfe',highlightthickness=1,highlightbackground='#d5dce5');self.canvas.pack(fill='both',expand=True,padx=10,pady=8);self.reset()
 def reset(self):self.path=[(0,0)];self.status.config(text='Adjust parameters, then simulate. This is a simplified kinematic model.');self.draw()
 def simulate(self):
  wheelbase=max(1,self.vars['Wheel base (cm)'].get());speed=self.vars['Speed (cm/s)'].get();bias=self.vars['Gyro bias (deg/s)'].get();slip=self.vars['Slip factor'].get();scale=1+self.vars['Distance scale error (%)'].get()/100
  x=y=theta=0.;path=[(x,y)];steps=100;dt=1/20;dist=100*scale
  for side in range(4):
   count=max(1,int(dist/(speed*dt)))
   for _ in range(count):
    ds=dist/count;theta_rad=math.radians(theta);x+=ds*math.cos(theta_rad);y+=ds*math.sin(theta_rad);path.append((x,y))
   # Nominal right turn; slip factor makes encoder-based turning differ from physical heading.
   physical_turn=-90.;encoder_turn=physical_turn*slip;theta+=physical_turn+bias*(abs(physical_turn)/max(1,speed*2))
   path.append((x,y))
  self.path=path;err=math.hypot(x,y);self.status.config(text=f'Estimated endpoint: ({x:.1f}, {y:.1f}) cm | Distance from start: {err:.1f} cm | Model parameters: wheelbase {wheelbase:.1f} cm, speed {speed:.1f} cm/s, slip {slip:.2f}×. Illustrative simulation only.');self.draw()
 def draw(self):
  c=self.canvas;c.delete('all');w=max(c.winfo_width(),400);h=max(c.winfo_height(),250);m=45;coords=self.path or [(0,0)];lim=max([abs(v) for p in coords for v in p]+[100])*1.2;sc=min((w-2*m)/(2*lim),(h-2*m)/(2*lim));ox=w/2;oy=h/2
  def xy(p):return ox+p[0]*sc,oy-p[1]*sc
  ideal=[(0,0),(100,0),(100,-100),(0,-100),(0,0)];pts=[xy(p) for p in ideal];c.create_line(*[z for p in pts for z in p],fill='#9aa6b2',width=2,dash=(5,4));pts=[xy(p) for p in coords];
  if len(pts)>1:c.create_line(*[z for p in pts for z in p],fill='#1677c8',width=2)
  c.create_text(12,12,anchor='nw',text='Blue: simulated trajectory    Dashed grey: ideal square',fill='#233044')
if __name__=='__main__':
 root=tk.Tk();App(root);root.mainloop()
