export class Animator{
  constructor(graph){
    for(let [key,value] of Object.entries({
      graph:graph,
      time_intervel:500, //500ms
    }))this[key]=value;
    this.init_event_list();
    this.nmp = {};
    this.fresh();
  }
  fresh(){
    delete this.nmp;
    this.nmp = {};
    for(let node of Object.values(this.graph.node_map)) this.nmp[node.name] = {
      o:node,
      to_list:[],
    }
    for(let edge of Object.values(this.graph.edge_map)){
      this.nmp[edge.u.name].to_list.push({
        o:edge,
        to:edge.v.name,
        direction:0,
      })
      this.nmp[edge.v.name].to_list.push({
        o:edge,
        to:edge.u.name,
        direction:1,
      })
    }
  }
  add_update_event(item, new_style, attribute='style_class'){
    let e={
      run:function(){
        item[attribute]=new_style;
        e.next_function();
      },
      next_function:function(){}
    };
    this.event_list[this.event_list.length-1].next_function = e.run;
    this.event_list.push(e);
  }
  add_sleep_event(time_intervel){
    let e={
      run:()=>setTimeout(e.next_function,time_intervel),
      next_function:function(){}
    }
    this.event_list[this.event_list.length-1].next_function = e.run;
    this.event_list.push(e);
  }
  init(){
    for(let node of Object.values(this.graph.node_map)) node.style_class = "init_style";
    for(let edge of Object.values(this.graph.edge_map)) edge.style_class = "init_style";
    this.init_event_list();
  }
  init_event_list(){
    if (this.event_list) delete this.event_list;
    let e = {
      run:function(){e.next_function();},
      next_function:function(){}
    };
    this.event_list = [e];
  }
}

export class DfsAnimator extends Animator{
  constructor(graph){
    super(graph);
    for(let [key,value] of Object.entries({
      
    }))this[key]=value;
  }
  init(){
    super.init();
    for(let edge of Object.values(this.graph.edge_map))
      edge.positive_arrow = false, edge.negative_arrow = false;
  }
  play(start_node_name=null){
    this.fresh();
    this.init();
    this.add_sleep_event(1000);
    if (!this.nmp[start_node_name])
      start_node_name = Object.keys(this.nmp)[0];
    let ani = this;
    let vis = {}, visited_edge = {};
    let dfs = function(un, dep=0){
      vis[un] = true;
      let ni = ani.nmp[un];
      ani.add_update_event(ni.o, "current_style");
      ani.add_sleep_event(ani.time_intervel);
      for(let ei of ni.to_list){
        if (!vis[ei.to]){
          let arrow = ei.direction ? 'negative_arrow' : 'positive_arrow';
          visited_edge[ei.o.name] = 2;
          ani.add_update_event(ni.o, "link_style");
          ani.add_update_event(ei.o, "link_style");
          ani.add_update_event(ei.o, true, arrow)
          dfs(ei.to, dep+1);
          ani.add_update_event(ei.o, "visited_style");
          ani.add_update_event(ni.o, "current_style");
          ani.add_sleep_event(ani.time_intervel/2);
        }
      }
      ani.add_update_event(ni.o, "visited_style");
    }
    dfs(start_node_name);
    ani.add_sleep_event(2000);
    for(let [ename,edge] of Object.entries(this.graph.edge_map))
      if (!visited_edge[ename]){
        this.add_update_event(edge, "hide_style");
      }
      else{
        // this.add_update_event(edge, false, "positive_arrow");
        // this.add_update_event(edge, false, "negative_arrow");
      }
      this.add_sleep_event(this.time_intervel);
    this.event_list[0].run();
  }
}

export class BfsAnimator extends Animator{
  constructor(graph){
    super(graph);
    for(let [key,value] of Object.entries({
      
    }))this[key]=value;
  }
  init(){
    super.init();
    for(let edge of Object.values(this.graph.edge_map))
      edge.positive_arrow = false, edge.negative_arrow = false;
  }
  play(start_node_name=null){
    this.fresh();
    this.init();
    this.add_sleep_event(1000);
    if (!this.nmp[start_node_name])
      start_node_name = Object.keys(this.nmp)[0];
    let ani = this;
    let ni, vis = {}, visited_edge = {};
    let bfs = function(un){
      let fro = 0, que = [];
      que.push([un, null]); vis[un] = true;
      while(fro < que.length){
        un = que[fro][0];
        ni = ani.nmp[un];
        if (que[fro][1]) ani.add_update_event(que[fro][1], "visited_style");
        ++fro;
        ani.add_update_event(ni.o, "current_style");
        ani.add_sleep_event(ani.time_intervel);
        for(let ei of ni.to_list){
          if (!vis[ei.to]){
            let arrow = ei.direction ? 'negative_arrow' : 'positive_arrow';
            visited_edge[ei.o.name] = 2;
            ani.add_update_event(ei.o, "link_style");
            ani.add_update_event(ei.o, true, arrow)
            ani.add_update_event(ani.nmp[ei.to].o, "link_style");
            ani.add_sleep_event(ani.time_intervel);
            if (!vis[ei.to]) que.push([ei.to, ei.o]), vis[ei.to] = true;
          }
        }
        ani.add_update_event(ni.o, "visited_style");
      }
    }
    bfs(start_node_name);
    ani.add_sleep_event(2000);
    for(let [ename,edge] of Object.entries(this.graph.edge_map))
      if (!visited_edge[ename]){
        this.add_update_event(edge, "hide_style");
      }
      else{
        // this.add_update_event(edge, false, "positive_arrow");
        // this.add_update_event(edge, false, "negative_arrow");
      }
      this.add_sleep_event(this.time_intervel);
    this.event_list[0].run();
  }
}