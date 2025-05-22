import { reactive, shallowReactive } from "vue";
import { GraphConfigure } from './GraphConfigure.js'

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
    this.config = shallowReactive(new GraphConfigure(width, height));

    this.node_map = shallowReactive({});
    this.edge_map = shallowReactive({});

    this.adj_table = {};

    this.init_sync();
    this.init_mouse_interaction();

    shallowReactive(this);
  }
  add_node(name, pos = undefined) {
    if (!name || this.node_map[name]) return false;
    if (!pos) pos = [Math.random() * this.config.width, Math.random() * this.config.height];
    this.node_map[name] = shallowReactive(new Node(pos[0], pos[1], name));
    this.adj_table[name] = {};
    return true;
  }
  //删除节点时首先会删除与它相连的所有边
  del_node(name) {
    let tmp = [];
    for(let x of Object.values(this.adj_table[name])) tmp.push(x.o.name);
    for(let ename of tmp) this.del_edge(ename);
    delete this.node_map[name];
    delete this.adj_table[name];
  }
  //两种添加方式 add_edge('1', '2') 与 add_edge('1 2', undefined)
  //如果有点不存在则失败
  add_edge(name1, name2=undefined, label = '') {
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
    this.edge_map[ename] = shallowReactive(new Edge(u, v, ename, label));
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
  del_edge(name1, name2=undefined) {
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
  arrow(ename, pos, neg=false){
    if(!this.edge_map[ename]) return false;
    this.edge_map[ename].positive_arrow = Boolean(pos);
    this.edge_map[ename].negative_arrow = Boolean(neg);
    return true;
  }
  keep_in_boundary(node){
    let bias = this.config.node_radius+5
    if (node.x < bias) node.x = bias;
    if (node.x > this.config.width-bias) node.x = this.config.width-bias;
    if (node.y < bias) node.y = bias;
    if (node.y > this.config.height-bias) node.y = this.config.height-bias;
  }
  str_to_graph(str){
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
    for (let k of Object.keys(this.edge_map)) if (!(k in emp)) this.del_edge(k);
    for (let k of Object.keys(this.node_map)) if (!(k in vmp)) this.del_node(k);
    for (let k of Object.keys(vmp)) this.add_node(k);
    for (let [k, v] of Object.entries(emp)) this.add_edge(k, null, v)
  }
  init_sync(e) {
    let g = this, timer = null;
    this.sync = {
      on_input: function (e) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          g.str_to_graph(e.target.value);
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