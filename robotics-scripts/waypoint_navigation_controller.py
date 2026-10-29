"""Waypoint Navigation Controller.
Default is SAFE SIMULATION MODE. On a Raspberry Pi, pass --hardware only after checking pins.
Commands: drive 50, turn -90, square 100, status, quit. Distances in cm; turns in degrees.
"""
import argparse, math, time, csv
from pathlib import Path
LOG=Path('waypoint_navigation_log.csv')
class Robot:
 def __init__(self,hardware=False):
  self.hardware=hardware;self.x=0.;self.y=0.;self.heading=0.;self.log=[];self.hw=None
  if hardware:
   from gpiozero import Motor
   self.left=Motor(forward=17,backward=27,enable=12);self.right=Motor(forward=22,backward=23,enable=13);self.hw=True
 def stop(self):
  if self.hardware:self.left.stop();self.right.stop()
 def drive(self,cm):
  start=(self.x,self.y);rad=math.radians(self.heading);self.x+=cm*math.cos(rad);self.y+=cm*math.sin(rad)
  if self.hardware:
   # Open-loop placeholder: do not use as calibrated navigation without encoder feedback.
   speed=0.3*(1 if cm>=0 else -1);self.left.forward(speed) if cm>=0 else self.left.backward(abs(speed));self.right.forward(speed) if cm>=0 else self.right.backward(abs(speed));time.sleep(abs(cm)/12);self.stop()
  self.record('drive',cm);print(f'Drove {cm:g} cm (estimated position {self.x:.1f}, {self.y:.1f} cm)')
 def turn(self,degrees):
  self.heading+=degrees
  if self.hardware:
   sign=1 if degrees>0 else -1;self.left.forward(0.3*sign) if sign>0 else self.left.backward(0.3);self.right.backward(0.3) if sign>0 else self.right.forward(0.3);time.sleep(abs(degrees)/90*0.8);self.stop()
  self.record('turn',degrees);print(f'Turned {degrees:g}°; estimated heading {self.heading:.1f}°')
 def record(self,cmd,value):self.log.append({'command':cmd,'value':value,'x_cm':self.x,'y_cm':self.y,'heading_deg':self.heading,'mode':'hardware' if self.hardware else 'simulation'})
 def square(self,side):
  for _ in range(4):self.drive(side);self.turn(-90)
 def save(self):
  if self.log:
   with LOG.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=self.log[0].keys());w.writeheader();w.writerows(self.log)
   print(f'Log saved to {LOG.resolve()}')
def main():
 p=argparse.ArgumentParser();p.add_argument('--hardware',action='store_true',help='Enable Raspberry Pi GPIO motors; verify wiring first');a=p.parse_args();r=Robot(a.hardware)
 print('Waypoint Navigation Controller —', 'HARDWARE MODE' if a.hardware else 'SIMULATION MODE (safe default)');print('Commands: drive <cm>, turn <degrees>, square <side_cm>, status, quit')
 try:
  while True:
   try:parts=input('robot> ').strip().lower().split()
   except EOFError:break
   if not parts:continue
   if parts[0] in ('quit','exit'):break
   try:
    if parts[0]=='drive' and len(parts)==2:r.drive(float(parts[1]))
    elif parts[0]=='turn' and len(parts)==2:r.turn(float(parts[1]))
    elif parts[0]=='square' and len(parts)==2:r.square(float(parts[1]))
    elif parts[0]=='status':print(f'x={r.x:.1f} cm y={r.y:.1f} cm heading={r.heading:.1f}°')
    else:print('Unknown command. Try: drive 50 | turn -90 | square 100 | status | quit')
   except ValueError:print('Enter a numeric distance/angle.')
 finally:r.stop();r.save()
if __name__=='__main__':main()
