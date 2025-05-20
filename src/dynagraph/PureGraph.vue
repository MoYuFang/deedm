<script setup lang="ts">
import './basic_style.css'
import { onMounted, reactive, computed, ref, shallowReactive } from 'vue'

//Vue components
import { GraphConfigure } from './GraphConfigure.js'
import { Graph } from './Graph.js';
import { ForceLayout } from './GraphLayout.js'
import graph_canvas from './GraphCanvas.vue'

//浅层响应即可
const width:number = 400, height:number = 400;
var graph_configure = shallowReactive(new GraphConfigure());
var graph = shallowReactive(new Graph(width, height));

var default_fresh_input = `
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
12 13
15 16
`;
graph.fresh.handle(default_fresh_input);

var force_layout = new ForceLayout(graph);

onMounted(()=>{
  force_layout.start_animation();
});

</script>

<template>
  <graph_canvas :graph="graph" :graph_configure="graph_configure" />
  <button @click="force_layout.start_animation"> 开始动画 </button>
  <button @click="force_layout.stop_animation"> 停止动画</button>
</template>

<style scoped>
*{
  
}
</style>