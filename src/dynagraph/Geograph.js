export class v2d{
  static add(u,v,k=1,b=0){return{x:u.x+k*v.x+b,y:u.y+k*v.y+b};}
  static sub(u,v){return{x:u.x-v.x,y:u.y-v.y};}
  static mul(u,d){return{x:u.x*d,y:u.y*d};}
  static div(u,d){return{x:u.x/d,y:u.y/d};}
  static dot(u,v){return u.x*v.x+u.y*v.y;}
  static crs(u,v){return u.x*v.y-u.y*v.x;}
  static square(u){return u.x*u.x+u.y*u.y;}
  static len(u){return Math.sqrt(u.x*u.x+u.y*u.y);}
  static nrm(u){let l=v2d.len(u);return{x:u.x/l,y:u.y/l};}
  static rot(u){return {x:-u.y, y:u.x};}
  static oclr(u){u.x=0;u.y=0;}
  static oadd(u,v,k=1,b=0){u.x+=k*v.x+b;u.y+=k*v.y+b;}
  static osub(u,v){u.x-=v.x;u.y-=v.y;}
  static omul(u,d){u.x*=d;u.y*=d;}
  static odiv(u,d){u.x/=d;u.y/=d;}
  static onrm(u){let l=v2d.len(u);u.x /= l; u.y /= l;}
  static orot(u){[u.x,u.y]=[-u.y,u.x];}
}