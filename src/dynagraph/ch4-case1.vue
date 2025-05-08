<script setup>
import { computed, ref, watchEffect, onMounted, reactive, useSSRContext } from 'vue';
import {Graph} from './Graph.js'
function log(s) {
    let ld = document.getElementById('logging-div');
    let p = document.createElement('p');
    p.style.margin = "0px";
    p.innerText = String(s);
    ld.appendChild(p)
    if (ld.children.length > 15)
        for (let i = 0; i < 10; ++i)ld.removeChild(ld.children[0])
}

const graph = new Graph(0, 0);

var default_fresh_input=`0
1
2
3
4
5
0 2
0 4
0 5
1 4
1 5
2 3
2 4
4 5
1 2
a b
c d
e f
`;
onMounted(() => {
    let svg = document.getElementById('show-graph');
    let re = /^([\d]+)px$/

    graph.svg_width = Number(window.getComputedStyle(svg).width.replace(re, '$1'))
    graph.svg_height = Number(window.getComputedStyle(svg).height.replace(re, '$1'))
    
    graph.fresh.handle(default_fresh_input);
    graph.start_animation();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) graph.stop_animation();
        else graph.start_animation();
    });
});
</script>

<template>
    <div id="container">
        <!-- <div id="logging-div"></div> -->
        <!-- <temp/> -->
        <div style="display: flex; flex-direction: row;">
            <textarea spellcheck="false" @input="graph.fresh.on_input">{{ default_fresh_input }}</textarea>
            <svg id="show-graph">
                <g v-for="(edge,ename) in graph.edge_map" :key="ename">
                    <path 
                        :d="`M${edge.item1.pos.x} ${edge.item1.pos.y}L${edge.item2.pos.x} ${edge.item2.pos.y}`"
                    />
                    <text
                        v-if="edge.label!==''"
                        :x="edge.middle_pos.x"
                        :y="edge.middle_pos.y"
                        dy="-0.35em"
                        text-anchor="middle"
                        style="user-select: none;"
                    >{{ edge.label }}</text>
                </g>
                <g v-for="item in graph.vertex_map" 
                    style="cursor: pointer;"
                    @mousedown="(e)=>graph.mouse_interaction.on_mouse_down(e,item)">
                    <circle
                        :cx="item.pos.x"
                        :cy="item.pos.y"
                        :r="graph.vertex_radius.value"
                    ></circle>
                    <text 
                        :x="item.pos.x" :y="item.pos.y" dy=".35em" text-anchor="middle"
                        font-size="14"
                        stroke="white"
                        stroke-width="1"
                        style="user-select: none;"
                    >{{ item.name }}</text>
                </g>
            </svg>
        </div>
    </div>
</template>

<style scoped>
*{
    --bg-color: rgb(75, 75, 75);
    --svg-bg-color: #333333;
    font-size:14;
}
g path{
    stroke:aquamarine;
    stroke-width: 2px;
    filter: drop-shadow(0px 0px 4px rgba(127, 255, 255, 0.5));
}
g circle{
    stroke:aqua;/*rgb(0, 255, 212);*/
    stroke-width: 2;
    fill:var(--svg-bg-color);
    filter: drop-shadow(0px 0px 6px rgba(127, 255, 255, 0.5));
}
#container {
    background-color: rgb(93, 127, 57);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#show-graph {
    background-color: var(--svg-bg-color);
    width: 400px;
    height: 400px;
    border: 2px solid black;
    border-radius: 10px;
    padding: 0px;
    margin: 0px;
}

#logging-div {
    background-color: rgb(107, 159, 52);
    width: 99%;
    height: 200px;
    border: 2px solid black;
    border-radius: 10px;
    padding: 0px;
    margin: 0px;
}

p {
    margin: 0px;
    border: 0px;
    padding: 0px;
}

.fuck-p {
    background-color: red;
}

textarea{
    background-color: var(--svg-bg-color);
    width: 200px;
    flex:2;
}

</style>