<script setup>
import { onMounted, reactive, computed, ref, markRaw } from 'vue'
//Debug
console.clear()

//Data
class CH_DATA {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.case_data_list = [];
  }
  get_default_case_id(){
    let tmp=this.case_data_list[0]
    return tmp?tmp.id:undefined
  }
}
const ch_data_list = [
  ['ch1', '逻辑'],
  ['ch2', '集合与关系'],
  ['ch3', '组合计数'],
  ['ch4', '图与树'],
  ['ch5', '代数与群'],
].map(item => new CH_DATA(
  item[0], item[1]
))

const current_ch_index = ref(0);
const current_ch_id = ref(ch_data_list[current_ch_index.value].id);

class CASE_DATA {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

ch_data_list[0].case_data_list = [
  ['ch1-case1', '语法树'],
  ['ch1-case2', '真值表'],
  ['ch1-case3', '等值验算'],
  ['ch1-case4', '推理检验']
].map(item => new CASE_DATA(
  item[0], item[1]
))

const current_case_index = ref(0);
const current_case_id = ref(ch_data_list[current_ch_index.value].get_default_case_id());

function ch_btn_click(ch_id, index) {
  if (ch_id === current_ch_id.value) return;
  current_ch_index.value = index;
  current_ch_id.value = ch_id;
  case_btn_click(ch_data_list[current_ch_index.value].get_default_case_id(), 0)
}

function case_btn_click(case_id, index) {
  if (case_id === current_case_id.value) return;
  current_case_index.value = index
  current_case_id.value = case_id
  console.log(`shift to ${current_case_id.value}`)
}

const is_ch_selected_check = reactive({});
for (let x of ch_data_list){
  is_ch_selected_check[x.id] = computed(()=>x.id===current_ch_id.value);
  for(let y of x.case_data_list){
    is_ch_selected_check[y.id] = computed(()=>y.id===current_case_id.value)
  }
}

const case_map = reactive({})
onMounted(async () => {
    const modules = import.meta.glob('./components/*.vue');
 
    for (const path in modules) {
        const module = await modules[path]();
        let re = /^\.\/components\/(ch[\d]+\-case[\d]+)\.vue$/;
        if(!re.test(path))continue;
        const key = path.replace(re, '$1');
        console.log(`componentName`,key);
        case_map[key] = markRaw(module.default)
    }
    console.log(`case_map`,case_map);
})

</script>

<template>
  <div id="container">
    <header>
      <nav>
        <div id="icon-container"></div>
        <button class='ch-btn' v-for='(ch_data, index) in ch_data_list'
          :id='`${ch_data.id}-btn`' :key='ch_data.id'
          :class="{
            'first-item': index === 0,
            'last-item': index === ch_data_list.length - 1,
            'selected': is_ch_selected_check[ch_data.id]}"
          @click="ch_btn_click(ch_data.id, index)">
          {{ ch_data.title }}
        </button>
      </nav>
    </header>
    <main>
      <aside>
        <button class="case-btn" v-for="(case_data, index) in ch_data_list[current_ch_index].case_data_list"
          :id="`${case_data.id}-btn`" :key="`${case_data.id}`"
          :class="{
            'first-item': index === 0,
            'last-item': index === ch_data_list[current_ch_index].case_data_list.length - 1,
            'selected': is_ch_selected_check[case_data.id]
          }"
          @click="case_btn_click(case_data.id, index)">
          {{ case_data.title }}
          <div class="btn-top"></div>
        </button>
      </aside>
        <component class="component" :is="case_map[current_case_id]?case_map[current_case_id]:case_map['ch0-case0']"></component>
    </main>
    <footer></footer>
  </div>
</template>

<style scoped>
* {
  font-size: 16px;
  --font-color: aquamarine;
  --font-color-hover: aqua;
  --bg-color: #444;
  --bg-color-hover: #333;
  font-family: Avenir;
  color: var(--font-color);
  text-align: center;

  --aside-width: 150px;
}

#container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

nav {
  display: flex;
  flex-flow: row wrap;
}

button {
  background-color: var(--bg-color);
  border: 0px;
  transition: border-color 0.25s;
  transition: color 0.25s;
  transition: background-color;
  cursor: pointer;
}
button:hover,button.selected {
  color: var(--font-color-hover);
  background-color: var(--bg-color-hover);
}

.ch-btn {
  background-color: var(--bg-color);
  color: var(--font-color);
  border: solid transparent;
  border-width: 0px 0px 0px 0px;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  flex-direction: row;
}

.ch-btn.first-item {
  border-radius: 10px 0px 0px 10px;
  border-left-width: 0px;
}

.ch-btn.last-item {
  border-radius: 0px 10px 10px 0px;
  border-right-width: 0px;
}

#icon-container {
  width: var(--aside-width);
}

main {
  background-color: #523c3c;
  display: flex;
  flex-flow: row;
  flex: 1;
}

aside {
  background-color: rgb(214, 231, 126);
  width: var(--aside-width);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.case-btn {
  background-color: var(--bg-color);
  color: var(--font-color);
  border: solid transparent;
  border-width: 0px 0px 0px 0px;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
}

.case-btn.first-item {
  border-radius: 10px 10px 0px 0px;
  border-top-width: 0px;
}

.case-btn.last-item {
  border-radius: 0px 0px 10px 10px;
  border-bottom-width: 0px;
}

article {
  background-color: rgb(71, 72, 0);
  flex: 1;
  display: flex;
  flex-direction: column;
}
.component{
  margin: 0px;
  background-color:rgb(93, 127, 57);
  flex:1;
}
</style>
