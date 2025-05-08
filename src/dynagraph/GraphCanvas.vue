<script setup>
defineProps(['graph', 'graph_configure'])

import node from './Node.vue'
import edge from "./Edge.vue"
import {Node, Edge} from "./Graph.js"

</script>

<template>
  <svg :width="graph.width" :height="graph.height">
    <edge 
      v-for="(edge,name) in graph.edge_map"
      :key="name"
      :edge="edge"
      :graph_configure="graph_configure"
    />
    <node 
      v-for="(node,name) in graph.node_map"
      :key="name"
      :node="node"
      :graph_configure="graph_configure"
      @mousedown="(e)=>graph.mouse_interaction.on_mouse_down(e,node)"
    />
  </svg>
</template>

<style scoped>
* {
  --svg-bg-color: #333;
}

svg {
  background-color: var(--svg-bg-color);
  /* width: 400px;
  height: 400px; */
  border: 2px solid aquamarine;
  border-radius: 10px;
  margin: 0px;
  padding: 0px;
}
</style>