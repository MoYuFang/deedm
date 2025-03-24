import { computed, ref, reactive} from 'vue';
export class V2d{
    static add(u,v,k=1,b=0){return{x:u.x+k*v.x+b,y:u.y+k*v.y+b};}
    static sub(u,v){return{x:u.x-v.x,y:u.y-v.y};}
    static mul(u,d){return{x:u.x*d,y:u.y*d};}
    static div(u,d){return{x:u.x/d,y:u.y/d};}
    static dot(u,v){return u.x*v.x+u.y*v.y;}
    static crs(u,v){return u.x*v.y-u.y*v.x;}
    static len(u){return Math.sqrt(u.x*u.x+u.y*u.y);}
    static nrm(u){let l=V2d.len(u);return{x:u.x/l,y:u.y/l};}
    static oclr(u){u.x=0;u.y=0;}
    static oadd(u,v,k=1,b=0){u.x+=k*v.x+b;u.y+=k*v.y+b;}
    static osub(u,v){u.x-=v.x;u.y-=v.y;}
    static omul(u,d){u.x*=d;u.y*=d;}
    static odiv(u,d){u.x/=d;u.y/=d;}
    static onrm(u){let l=V2d.len(u);u.x /= l; u.y /= l;}
}

export class Graph {
    constructor(svg_width, svg_height) {
        this.svg_width = svg_width;
        this.svg_height = svg_height;

        this.vertex_map = reactive({});
        this.vertex_status = {};
        this.vertex_radius = ref(17);
        this.vertex_padding = 10;

        this.away_r = 105
        this.away_v = 16000
        this.away_a = 800

        this.is_cent = true;
        this.cent_v1 = 400;
        this.cent_v2 = 400;

        this.is_animating = false;
        this.last_timestamp = -1;

        this.edge_map = reactive({});
        this.edge_ideal_len = this.away_r*1.1;
        this.edge_v = 8000;
        this.edge_a = 400;

        this.init_mouse_interaction();
        this.init_fresh();
    }
    add_vertex(name) {
        if (!name || this.vertex_map[name]) return false;
        this.vertex_map[name] = reactive({
            name: name,
            is_selected: false,
            pos: {
                x: Math.random() * this.svg_width, y: Math.random() * this.svg_height,
            },
        })
        this.vertex_status[name] = {
            item: this.vertex_map[name],
            dpos: { x: 0, y: 0 },
            upos: { x: 0, y: 0 }
        }
        let v = this.vertex_map[name].pos;

        return true;
    }
    del_vertex(name) {
        delete this.vertex_map[name];
        delete this.vertex_status[name];
    }
    start_cent(){
        this.is_cent = true;
    }
    stop_cent(){
        this.is_cent = false;
    }
    add_edge(name1, name2, label=''){
        if (name1 == name2) return false;
        if (name1 > name2) [name1,name2]=[name2,name1];
        let ename = name1+' '+name2;
        if (this.edge_map[ename]){
            this.edge_map[ename].label = label;
            return false;
        }
        let item1 = this.vertex_map[name1], item2 = this.vertex_map[name2];
        if (!(item1 || item2)) return false;
        this.edge_map[ename]={
            item1:item1,
            item2:item2,
            middle_pos:{
                x:computed(()=>(item1.pos.x+item2.pos.x)/2),
                y:computed(()=>(item1.pos.y+item2.pos.y)/2)
            },
            label:String(label)
        }
        return true;
    }
    del_edge(name1, name2){
        if (name1 == name2) return false;
        if (name1 > name2) [name1,name2]=[name2,name1];
        let ename = name1+' '+name2;
        delete this.edge_map[ename];
    }
    start_animation(){
        this.is_animating = true;
        this.last_timestamp = -1;
        let g = this, check_bound = function(pos){
            let f=(o,b)=>Math.max(g.vertex_radius.value+g.vertex_padding,Math.min(o, b-g.vertex_radius.value-g.vertex_padding));
            pos.x = f(pos.x, g.svg_width); pos.y = f(pos.y,g.svg_height);
        };
        (function update_frame (timestamp) {
            if (!g.is_animating) return;
            if (g.last_timestamp>0){
                let dt = (timestamp-g.last_timestamp)/1000;
                let count = 0;
                let ccpos = {x:0.0, y:0.0};
                for (let u of Object.values(g.vertex_status)){
                    V2d.oclr(u.dpos)
                    let cpos = V2d.sub(
                        {x:u.item.pos.x,y:u.item.pos.y},
                        {x:0,y:0},
                    );
                    V2d.oadd(ccpos, cpos);
                    count += 1;

                    for (let v of Object.values(g.vertex_status)){
                        if (u === v) continue;
                        let wpos = V2d.sub(u.item.pos, v.item.pos),
                            l = V2d.len(wpos);
                        
                        if (l >= g.away_r) continue;
                        let vel = Math.min(g.away_v*(g.away_r-l)/g.away_a, g.away_v);
                        V2d.oadd(u.dpos, wpos, vel/l);
                    }
                }

                for (let e of Object.values(g.edge_map)){
                    let u = e.item1, v = e.item2,
                        wpos = V2d.sub(u.pos,v.pos),
                        l = V2d.len(wpos),
                        us = g.vertex_status[u.name], vs = g.vertex_status[v.name],
                        vel = g.edge_v/g.edge_a*(l-g.edge_ideal_len);
                    vel = Math.max(-g.edge_v,Math.min(g.edge_v, vel));
                    
                    V2d.oadd(us.dpos, wpos, -vel/l)
                    
                }

                V2d.omul(ccpos, 1/count);
                for (let u of Object.values(g.vertex_status)){
                    if (u.item.is_selected) continue
                    V2d.oadd(u.item.pos, u.upos, dt);
                    check_bound(u.item.pos);
                    V2d.omul(u.upos, 0.9)

                    if (g.is_cent){
                        let upos = {x:u.item.pos.x,y:u.item.pos.y},
                            cupos = V2d.sub(ccpos, upos), cul = V2d.len(cupos);
                        if (cul > 1){
                            V2d.oadd(u.dpos, cupos, g.cent_v2/cul);
                        }
                    }

                    V2d.oadd(u.dpos, V2d.sub({x:g.svg_width/2,y:g.svg_height/2},ccpos),
                        g.cent_v1*dt);
                    V2d.oadd(u.upos, u.dpos, dt);
                }
            }
            g.last_timestamp = timestamp;
            requestAnimationFrame(update_frame);
        })();
    }
    stop_animation(){
        this.is_animating = false;
    }
    init_mouse_interaction(){
        let g = this, gml;
        this.mouse_interaction = {
            current_shift_x:0,
            current_shift_y:0,
            current_pos:undefined,
            current_item:undefined,
            on_mouse_down:function(e, item) {
                gml.current_shift_x = e.clientX;
                gml.current_shift_y = e.clientY;
                window.addEventListener('mouseup', gml.on_mouse_up);
                window.addEventListener('mousemove', gml.on_mouse_move);
                gml.current_item = item;
                gml.current_pos = item.pos;
                gml.current_item.is_selected = true;
                g.stop_cent()
            },
            on_mouse_move:function(e) {
                if (gml.current_pos) {
                    gml.current_pos.x += e.clientX - gml.current_shift_x;
                    gml.current_pos.y += e.clientY - gml.current_shift_y;
                }
                gml.current_shift_x = e.clientX;
                gml.current_shift_y = e.clientY;

            },
            on_mouse_up:function() {
                gml.current_pos = undefined;
                window.removeEventListener('mousemove', gml.on_mouse_move);
                window.removeEventListener('mouseup', gml.on_mouse_up);
                gml.current_item.is_selected = false;
                graph.start_cent()
            }
        }
        gml = g.mouse_interaction;
    }
    init_fresh(e){
        let g = this, timer = null;
        this.fresh = {
            handle:function(str){
                let vmp = {}, emp = {};
                for (let line of str.split('\n')){
                    let items = line.split(/[\s]+/)
                    if (items[0]) vmp[items[0]] = items[0];
                    if (items[1]){
                        vmp[items[1]] = items[1];
                        if (items[0] > items[1]) [items[0],items[1]] = [items[1],items[0]];
                        if (!items[2]) items[2] = '';
                        let ename = items[0]+' '+items[1];
                        // console.log("ename:"+ename);
                        emp[ename] = String(items[2]);
                    }
                }
                for(let k of Object.keys(g.vertex_map))
                    if (!(k in vmp)) g.del_vertex(k);
                for(let k of Object.keys(g.edge_map))
                    if (!(k in emp)){
                        k = k.split(' ');
                        console.log(k);
                        g.del_edge(k[0], k[1]);
                    }
                for(let k of Object.keys(vmp)){
                    g.add_vertex(k);
                }
                for(let [k,v] of Object.entries(emp)){
                    k = k.split(' ');
                    g.add_edge(k[0], k[1], v)
                }
            },
            on_input:function(e){
                if (timer) clearTimeout(timer);
                timer = setTimeout(()=>{
                    timer=null;
                    g.fresh.handle(e.target.value);
                },1000);
            }
        };
    }
}