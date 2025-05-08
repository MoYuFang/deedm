<script setup>
defineProps(['node', 'graph_configure'])
</script>
<!-- 
  @mouseenter="node.style_class='visited_style'"
  @mouseleave="node.style_class='init_style'"
  @mousedown="node.style_class='current_style'"
  @mouseup="node.style_class='init_style'"
-->
<template>
  <g>
    <circle
      :cx="node.x" :cy="node.y" :r="graph_configure.node_radius"
      :class="node.style_class"
      :style="`transition-duration: ${graph_configure.style_transition_time};`"
    ></circle>
    <text 
        :x="node.x" :y="node.y" dy=".35em" text-anchor="middle"
        :class="node.style_class"
        font-size="14"
        stroke-width="1"
        :style="`user-select: none;`"
    >{{ node.name }}</text>
  </g>
</template>

<style scoped>

@import './animation_configure.css';

circle,text{
  transition-property: fill, stroke, filter, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;
}

circle.init_style{
  fill: gray;
  stroke: aqua;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px aqua)
}
text.init_style{
  stroke: white;
}

circle.visited_style{
  fill: rgb(168, 152, 58);
  stroke: gold;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px gold)
}
text.visited_style{
  stroke: rgb(246, 240, 209);
}

circle.current_style{
  fill: rgb(112, 33, 49);
  stroke:crimson;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px crimson)
}
text.current_style{
  stroke: rgb(239, 189, 200);
}

circle.link_style{
  fill: rgb(135, 157, 101);
  stroke:greenyellow;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px aqua)
}
text.link_style{
  stroke: rgb(216, 236, 183);
}

</style>