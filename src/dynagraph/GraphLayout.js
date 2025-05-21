import {v2d} from "./Geograph.js"

export class ForceLayout{
  constructor(graph){
    this.graph = graph;
    
    this.k1 = 1;
    this.k2 = 5;
    this.k3 = 0.1;

    this.l1 = 10;
    this.l2 = 70;

    this.frequency = 30;
    this.time_interval = 1000/this.frequency;
    this.super_alpha = 0.05*this.time_interval;
    this.alpha = 0.005*this.time_interval;
    this.iteration_count = Math.floor(this.super_alpha/this.alpha+0.5)

    this.normalize_arg();
  }
  normalize_arg(){
    let tot = this.k1+this.k2+this.k3;
    this.k1 /= tot;
    this.k2 /= tot;
    this.k3 /= tot;
  }
  iterate(){
    const eps = 0.1; //used to avoid dividing zero
    let center = {x:this.graph.config.width/2, y:this.graph.config.height/2};
    let nmp = {}
    for(let [name,node] of Object.entries(this.graph.node_map))
      nmp[name] = {o:{x:node.x, y:node.y}, x:0, y:0};
    for(let iter = 0; iter < this.iteration_count; ++iter){
      for(let u of Object.keys(nmp)) nmp[u].x = 0, nmp[u].y = 0;
      let vec_centroid = {x:0, y:0}, node_count = 0;
      for(let u of Object.keys(nmp)){
        node_count += 1;
        v2d.oadd(vec_centroid, nmp[u].o)
        for(let v of Object.keys(nmp)){
          if (u === v || u > v) continue;
          // console.log(u, v, nmp[u], nmp[v]);
          let ename = u+' '+v;
          let 
            vec_r = v2d.sub(nmp[u].o, nmp[v].o),
            len_r = Math.max(v2d.len(vec_r), eps),
            k;
          if (this.graph.edge_map[ename]){
            k = this.k1*(1.0-this.l1/len_r);
            v2d.oadd(nmp[u], vec_r, -k, 0);
            v2d.oadd(nmp[v], vec_r, k, 0);
          }

          if (len_r > this.l2) k = 0.0;
          else k = this.k2*(1.0-this.l2/len_r);
          v2d.oadd(nmp[u], vec_r, -k, 0);
          v2d.oadd(nmp[v], vec_r, k, 0);
        }
      }

      // v2d.omul(vec_centroid, 1/node_count);
      // v2d.osub(vec_centroid, center);
      // for(let u of Object.keys(nmp)){
      //   v2d.oadd(nmp[u], vec_centroid, -this.k3/node_count, 0);
      // }

      for(let u of Object.keys(nmp)){
        v2d.oadd(nmp[u], v2d.sub(nmp[u].o, center), -this.k3);
      }

      for(let u of Object.keys(nmp)){
        let node = this.graph.node_map[u];
        // console.log(`${nmp[u].x} ${nmp[u].y}`)
        //被选中的节点不移动
        if (node === this.graph.mouse_interaction.node) continue;
        v2d.oadd(nmp[u].o, nmp[u], this.alpha, 0);

        this.graph.keep_in_boundary(nmp[u].o);
      }
    }
    for(let u of Object.keys(nmp)){
        let node = this.graph.node_map[u];
        // console.log(`${nmp[u].x} ${nmp[u].y}`)
        //被选中的节点不移动
        if (node === this.graph.mouse_interaction.node) continue;
        node.x = nmp[u].o.x; node.y = nmp[u].o.y;
      }
  }
  start_animation(){
    let _this = this;
    this.timer = setInterval(
      ()=>{_this.iterate();},
      this.time_interval
    );
  }
  stop_animation(){
    clearInterval(this.timer);
  }
}