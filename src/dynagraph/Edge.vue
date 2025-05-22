<script setup>
import { computed } from 'vue';
import { v2d } from'./Geograph.js'
const props = defineProps(['edge', 'graph_configure'])

let edge = props['edge'], graph_configure = props['graph_configure'];
var positive_arrow = computed(()=>{
  let
    e = v2d.nrm(v2d.sub(edge.v, edge.u)), re = v2d.rot(e),
    t1 = v2d.add(edge.v, e, -graph_configure.node_radius),
    tmp = v2d.add(t1, e, -0.86602540378443864676372317075294*graph_configure.arrow_len),
    t2 = v2d.add(tmp, re, 0.5*graph_configure.arrow_len), //\sqrt(3)/2
    t3 = v2d.add(tmp, re, -0.5*graph_configure.arrow_len),
    str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
  return str;
});
var negative_arrow = computed(()=>{
  let
    e = v2d.nrm(v2d.sub(edge.u, edge.v)), re = v2d.rot(e),
    t1 = v2d.add(edge.u, e, -graph_configure.node_radius),
    tmp = v2d.add(t1, e, -0.86602540378443864676372317075294*graph_configure.arrow_len),
    t2 = v2d.add(tmp, re, 0.5*graph_configure.arrow_len), //\sqrt(3)/2
    t3 = v2d.add(tmp, re, -0.5*graph_configure.arrow_len),
    str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
  return str;
});
</script>

<template>
  <g>
    <path
      :d="`M${edge.u.x} ${edge.u.y}L${edge.v.x} ${edge.v.y}`"
      :class="edge.style_class"
    ></path>
    <polygon
      :class="[edge.style_class,{show:edge.negative_arrow}]"
      :points="negative_arrow"
    ></polygon>
    <polygon
      :class="[edge.style_class,{show:edge.positive_arrow}]"
      :points="positive_arrow"
    ></polygon>
  </g>
  
</template>

<style scoped>

@import './animation_configure.css';

path{
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;

  transition: opacity var(--opacity-transition-duration) ease;
}

polygon{
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;

  transition: opacity var(--style-transition-duration) ease;
}

path.init_style{
  stroke: aquamarine;
  stroke-width: 2;
  opacity: 0.5;
}

path.visited_style{
  stroke: gold;
  stroke-width: 3;
  opacity: 1;
}

path.current_style{
  stroke: crimson;
  stroke-width: 3;
  opacity: 1;
}

path.link_style{
  stroke: greenyellow;
  stroke-width: 3;
  opacity: 1;
}

path.hide_style{
  stroke: aquamarine;
  stroke-width: 2;
  opacity: 0;
}

polygon{
  opacity: 0;
}

polygon.init_style{
  fill: aquamarine;
}

polygon.visited_style{
  fill: gold;
}

polygon.current_style{
  fill: crimson;
}

polygon.link_style{
  fill: greenyellow;
}

polygon.show{
  opacity: 1;
}

polygon.hide_style{
  fill: aquamarine;
  opacity: 0;
}
</style>