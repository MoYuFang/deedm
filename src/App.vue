<script setup>
import { onMounted, reactive, computed, ref, markRaw } from 'vue'
//Debug
console.clear()

//Data
class CH_DATA {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.case_data_list = {};
    this.case_data_list_index = []; // used for v-for
  }
  add_case(case_) {
    this.case_data_list[case_.id] = case_;
    this.case_data_list_index.push(case_.id);
  }
  get_default_case_id() {
    let tmp = this.case_data_list[this.id + '-case1']
    return tmp ? tmp.id : undefined
  }
}
const ch_data_list_index = []; //Used for v-for
const ch_data_list = {};
[
  ['ch1', '逻辑'],
  ['ch2', '集合与关系'],
  ['ch3', '组合计数'],
  ['ch4', '图与树'],
  ['ch5', '代数与群']
].forEach(item => {
  ch_data_list[item[0]] = new CH_DATA(item[0], item[1]);
  ch_data_list_index.push(item[0])
});


const current_ch_id = ref('ch1');

class CASE_DATA {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

[
  ['ch1-case1', '语法树'],
  ['ch1-case2', '真值表'],
  ['ch1-case3', '等值验算'],
  ['ch1-case4', '推理检验']
].forEach(item =>
  ch_data_list['ch1'].add_case(new CASE_DATA(item[0], item[1]))
);

[
  ['ch2-case1', '集合'],
  ['ch2-case2', '关系'],
  ['ch2-case3', '等价与偏序关系'],
  ['ch2-case4', '函数']
].forEach(item =>
  ch_data_list['ch2'].add_case(new CASE_DATA(item[0], item[1]))
);

[
  ['ch3-case1', '字符串计数'],
  ['ch3-case2', '排列生产'],
  ['ch3-case3', '不定方程求解'],
].forEach(item =>
  ch_data_list['ch3'].add_case(new CASE_DATA(item[0], item[1]))
);

[
  ['ch4-case1', 'DFS与BFS'],
  ['ch4-case2', '树的遍历'],
  ['ch4-case3', 'Dijkstra'],
  ['ch4-case4', 'Krusal和Prim'],
  ['ch4-case5', 'Huffman'],
].forEach(item =>
  ch_data_list['ch4'].add_case(new CASE_DATA(item[0], item[1]))
);

[
  ['ch5-case1', '运算'],
  ['ch5-case2', '子群与陪集'],
  ['ch5-case3', '置换群'],
  ['ch5-case4', '偏序集是否是格'],
  ['ch5-case5', '整除与布尔代数'],
].forEach(item =>
  ch_data_list['ch5'].add_case(new CASE_DATA(item[0], item[1]))
);

const current_case_id = ref(ch_data_list[current_ch_id.value].get_default_case_id());

function ch_btn_click(ch_id) {
  if (ch_id === current_ch_id.value) return;
  current_ch_id.value = ch_id;
  case_btn_click(ch_data_list[current_ch_id.value].get_default_case_id())
}

function case_btn_click(case_id) {
  if (case_id === current_case_id.value) return;
  current_case_id.value = case_id
  // console.log(`shift to ${current_case_id.value}`)
}

const is_ch_selected_check = reactive({});
for (let ch_id of ch_data_list_index) {
  let x = ch_data_list[ch_id];
  is_ch_selected_check[x.id] = computed(() => x.id === current_ch_id.value);
  for (let case_id of x.case_data_list_index) {
    let y = x.case_data_list[case_id];
    is_ch_selected_check[y.id] = computed(() => y.id === current_case_id.value)
  }
}

const case_map = reactive({})
onMounted(async () => {
  const modules = import.meta.glob('./components/*.vue');

  for (const path in modules) {
    const module = await modules[path]();
    let re = /^\.\/components\/(ch[\d]+\-case[\d]+)\.vue$/;
    if (!re.test(path)) continue;
    const key = path.replace(re, '$1');
    console.log(`componentName`, key);
    case_map[key] = markRaw(module.default)

    // case_map[key] = 
  }
  // console.log(`case_map`, case_map);
})

ch_btn_click('ch4'); case_btn_click('ch4-case1');

</script>

<template>
  <div id="container">
    <header>
      <nav>
        <div id="icon-container"></div>
        <button class='ch-btn' v-for='(ch_data_id, index) in ch_data_list_index' :id='`${ch_data_id}-btn`'
          :key='ch_data_id' :class="{
            'first-item': index === 0,
            'last-item': index === ch_data_list_index.length - 1,
            'selected': is_ch_selected_check[ch_data_id]
          }" @click="ch_btn_click(ch_data_id)">
          {{ ch_data_list[ch_data_id].title }}
        </button>
      </nav>
    </header>
    <main>
      <aside>
        <button class="case-btn" v-for="(case_data_id, index) in ch_data_list[current_ch_id].case_data_list_index"
          :id="`${case_data_id}-btn`" :key="`${case_data_id}`" :class="{
            'first-item': index === 0,
            'last-item': index === ch_data_list[current_ch_id].case_data_list_index.length - 1,
            'selected': is_ch_selected_check[case_data_id]
          }" @click="case_btn_click(case_data_id)">
          {{ ch_data_list[current_ch_id].case_data_list[case_data_id].title }}
          <div class="btn-top"></div>
        </button>
      </aside>

      <!-- 这里是case子界面的展示区域 -->
      <component class="component" :is="case_map[current_case_id] ? case_map[current_case_id] : case_map['ch0-case0']">
      </component>

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

  --aside-width: 160px;
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

button:hover,
button.selected {
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
  background-color: #beaa15;
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

.component {
  margin: 0px;
  flex: 1;
}
</style>
