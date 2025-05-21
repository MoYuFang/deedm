<script setup lang="ts">
import { onMounted, reactive, computed, ref, shallowReactive } from 'vue'

//Vue components
import { Graph } from './Graph.js';
import { ForceLayout } from './GraphLayout.js'
import graph_canvas from './GraphCanvas.vue'

const default_graph_str = `
1 2
2 3
2 4
2 5
3 6
3 7
4 8
4 9
4 10
5 11
6 11
1 9
10 7
8 9
5 8
7 5
12 13
14 15
16 17
19 20
21 22
23 24
15 26
`;

//画布的大小，单位是像素
const canvas_width:number = 400, canvas_height:number = 400;
var graph = new Graph(canvas_width, canvas_height);

/*********************增删节点************************/

//在 graph 的同步模块 sync 中将字符串同步到图关系中；
//sync.str_to_graph 函数会根据字符串对节点、边进行增删，新增节点坐标随机
graph.sync.str_to_graph(default_graph_str);

//其它增删节点的方法，均会返回 true 或 false 代表是否成功

graph.add_node('12');//不指定坐标时坐标随机
graph.add_node('13', [20, 40]);

//边的名字格式是 "nameA nameB"，其中字典序须 (nameA < nameB)
//若 nameA 或 nameB 对应的节点不存在则加边失败并报错
//add_edge 与 del_edge 均有两种方式
graph.add_edge('12 13'); //graph.add_edge('12', '13'); 有相同效果
graph.del_edge('1 2'); //graph.del_edge('1', '2'); 有相同效果
graph.del_node('2');

//arrow(边名, 正方向箭头，反方向箭头)
//显示有向边的方向，默认不显示，边名需 nameA < nameB 
graph.arrow('23 24', true, false); // 23->24

/*********************图布局************************/

//ForceLayout 会布局节点位置，通过start_animation()和stop_animation()开关动画
var force_layout = new ForceLayout(graph);

/*********************调整视觉参数************************/
/*
//一般参数
let config = graph.config;
config.node_radius = 13;    //节点半径
config.arrow_len = 13;      //有向边的箭头大小

//布局参数
force_layout.ideal_edge_length = 10;      //边的理想长度
force_layout.exclusive_radius = 70;       //各节点间的排斥距离
*/

onMounted(()=>{
  force_layout.start_animation();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) force_layout.stop_animation();
    else force_layout.start_animation();
  });
});

</script>

<template>
  <graph_canvas :graph="graph"/>
  <div>
    <button @click="force_layout.start_animation"> 开始动画 </button>
    <button @click="force_layout.stop_animation"> 停止动画</button>
  </div>
</template>

<style scoped>
*{
  
}
</style>