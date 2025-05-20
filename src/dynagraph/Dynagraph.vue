<script setup>
import './basic_style.css'
import { onMounted, reactive, computed, ref, shallowReactive } from 'vue'

//Vue components
import { GraphConfigure } from './GraphConfigure.js'
import { Graph } from './Graph.js';
import { DfsAnimator, BfsAnimator } from './Animator.js';
import graph_canvas from './GraphCanvas.vue'

//Icon: npm install @vicons/ionicons5
import { PlayCircle } from "@vicons/ionicons5" //

//Naive UI: npm install naive-ui
import { NIcon } from 'naive-ui'

var graph = shallowReactive(new Graph(400, 400));
var graph_configure = reactive(new GraphConfigure());
var dfs_animator = null, bfs_animator = null;
var default_fresh_input = `1 2
2 3
2 4
2 5
3 6
3 7
4 8
4 9
4 10
5 11
`;

function rect_dots() {
  default_fresh_input = '';
  let
    radius = graph_configure.node_radius,
    rows = 5, cols = 5, x, y,
    padding = 3 * radius,
    tot_width = 2 * radius + (rows - 1) * (2 * radius + padding),
    tot_height = 2 * radius + (cols - 1) * (2 * radius + padding),
    bx = (graph.width - tot_width) / 2 + radius, dx = 2 * radius + padding,
    by = (graph.height - tot_height) / 2 + radius, dy = 2 * radius + padding,
    count;
  // console.log(`w&h:${graph.width}&${graph.height} dx:${dx} dy:${dy}`);
  for (let r = 0; r < rows; ++r) {
    y = by + r * dx;
    for (let c = 0; c < cols; ++c) {
      x = bx + c * dy;
      let id = r * cols + c;
      graph.add_node(`${id}`, [x, y]);
    }
  }
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
      let nlist = [[r, c + 1], [r + 1, c], [r + 1, c + 1], [r + 1, c - 1]];
      nlist.sort(() => Math.random() - 0.5);
      for (let [nr, nc] of nlist) {
        if (nr >= rows || nc >= cols || nr < 0 || nc < 0) continue;
        let id = r * cols + c, nid = nr * cols + nc;
        graph.add_edge(`${id}`, `${nid}`);
        default_fresh_input += `${id} ${nid}\n`;
      }
    }
  }
};

rect_dots();

dfs_animator = new DfsAnimator(graph);
bfs_animator = new BfsAnimator(graph);

var start_node = ref('12');

onMounted(() => {
  // bfs_animator.play(36);
});

</script>

<template>
  <div id="container">
    <div style="height:fit-content; display: flex; flex-direction: row; justify-content: center; align-items: stretch;">
      <div style="margin-right: 20px; ; display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap:20px" :height="graph.height">
        <div id="operate">
          <div style="height:100%; display: flex; flex-direction: row; justify-content: center; align-items: center;">
            <label style="margin-right:5px">Origin:</label>
            <input v-model="start_node" style="width: 100px; text-align: center; color:aquamarine" type="text">
          </div>
          <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px">
            <button @click="dfs_animator.play(start_node)"><NIcon><PlayCircle /></NIcon>DFS</button>
            <button @click="bfs_animator.play(start_node)"><NIcon><PlayCircle /></NIcon>BFS</button>
          </div>
        </div>
        <textarea 
          @input="(e)=>{ graph.fresh.on_input(e);}" spellcheck="false" >{{ default_fresh_input }}</textarea>
      </div>
      <graph_canvas :graph="graph" :graph_configure="graph_configure" />
    </div>
    <div>

    </div>
  </div>
</template>

<style scoped>
* {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  color-scheme: light dark;
  color: aquamarine;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#operate {
  background-color: #333;
  width: 200px;
  padding: 10px 5px 10px 5px;

  border: 2px solid aquamarine;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

#operate button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

</style>
