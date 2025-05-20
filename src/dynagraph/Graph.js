import { reactive, shallowReactive } from "vue";

export class Node {
  constructor(x, y, name='') {
    for (let [key, value] of Object.entries({
      x: x, y: y,
      name:name,
      style_class:"init_style",
    })) this[key] = value;
  }
}

export class Edge {
  constructor(u, v, name='', label='') {
    for (let [key, value] of Object.entries({
      u: u, v: v,
      name: name,
      positive_arrow: false,
      negative_arrow: false,
      style_class:"init_style",
    })) this[key] = value;
  }
}

export class Graph {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.node_map = shallowReactive({});
    this.edge_map = shallowReactive({});

    this.adj_table = {};

    this.init_fresh();
    this.init_mouse_interaction();
  }
  //如果点已存在则失败
  add_node(name, pos = null) {
    if (!name || this.node_map[name]) return false;
    if (!pos) pos = [Math.random() * this.width, Math.random() * this.height];
    this.node_map[name] = reactive(new Node(pos[0], pos[1], name));
    
    //样例元素
    //this.adj_table[name][adj_node_name] = {o:Edge, to:string, direction:number}
    this.adj_table[name] = {};
    return true;
  }
  del_node(name) {
    let tmp = [];
    for(let x of Object.values(this.adj_table[name])) tmp.push(x.o.name);
    console.log(tmp);
    for(let ename of tmp) this.del_edge(ename);
    delete this.node_map[name];
    delete this.adj_table[name];
  }
  //两种添加方式 add_edge('1', '2') 与 add_edge('1 2', null)
  //如果有点不存在则失败
  add_edge(name1, name2=null, label = '') {
    let ename;
    if (!name2) ename = name1, [name1, name2] = name1.split(' ');
    else {
      if (name1 > name2) [name1, name2] = [name2, name1];
      ename = name1 + ' ' + name2;
    }
    if (name1 == name2) return false;
    if (this.edge_map[ename]) {
      this.edge_map[ename].label = label;
      return false;
    }
    let u = this.node_map[name1], v = this.node_map[name2];
    if (!u || !v) {
      console.assert(u && v, `It failed to add edge ${ename} because not all the nodes exist.`)
      return false;
    }
    this.edge_map[ename] = reactive(new Edge(u, v, ename, label));
    this.adj_table[name1][name2] = {
      o:this.edge_map[ename],
      to:name2,
      direction:0
    }
    this.adj_table[name2][name1] = {
      o:this.edge_map[ename],
      to:name1,
      direction:1
    }
    return true;
  }
  del_edge(name1, name2=null) {
    let ename;
    if (!name2) ename = name1, [name1, name2] = name1.split(' ');
    else {
      if (name1 > name2) [name1, name2] = [name2, name1];
      ename = name1 + ' ' + name2;
    }
    if (!this.edge_map[ename]) return false;
    delete this.edge_map[ename];
    delete this.adj_table[name1][name2];
    delete this.adj_table[name2][name1];
    return true;
  }
  keep_in_boundary(node){
    if (node.x < 0) node.x = 0;
    if (node.x > this.width) node.x = this.width;
    if (node.y < 0) node.y = 0;
    if (node.y > this.height) node.y = this.height;
  }
  init_fresh(e) {
    let g = this, timer = null;
    this.fresh = {
      handle: function (str) {
        let vmp = {}, emp = {};
        for (let line of str.split('\n')) {
          let items = line.split(/[\s]+/)
          if (items[0]) vmp[items[0]] = items[0];
          if (items[1]) {
            vmp[items[1]] = items[1];
            if (items[0] > items[1]) [items[0], items[1]] = [items[1], items[0]];
            if (!items[2]) items[2] = '';
            let ename = items[0] + ' ' + items[1];
            emp[ename] = String(items[2]);
          }
        }
        for (let k of Object.keys(g.edge_map)) if (!(k in emp)) g.del_edge(k);
        for (let k of Object.keys(g.node_map)) if (!(k in vmp)) g.del_node(k);
        for (let k of Object.keys(vmp)) g.add_node(k);
        for (let [k, v] of Object.entries(emp)) g.add_edge(k, null, v)
      },
      on_input: function (e) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          g.fresh.handle(e.target.value);
        }, 1000);
      }
    };
  }
  init_mouse_interaction() {
    let gmi;
    this.mouse_interaction = {
      dx: 0,
      dy: 0,
      node: null,
      on_mouse_down: function (e, node) {
        gmi.dx = e.clientX;
        gmi.dy = e.clientY;
        window.addEventListener('mouseup', gmi.on_mouse_up);
        window.addEventListener('mousemove', gmi.on_mouse_move);
        gmi.node = node;
      },
      on_mouse_move: function (e) {
        if (gmi.node) {
          gmi.node.x += e.clientX - gmi.dx;
          gmi.node.y += e.clientY - gmi.dy;
        }
        gmi.dx = e.clientX;
        gmi.dy = e.clientY;
      },
      on_mouse_up: function () {
        window.removeEventListener('mousemove', gmi.on_mouse_move);
        window.removeEventListener('mouseup', gmi.on_mouse_up);
        gmi.node = null;
      }
    }
    gmi = this.mouse_interaction;
  }
}