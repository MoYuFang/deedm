<script setup>
import { h, ref, onMounted,useTemplateRef, createApp, reactive} from 'vue'
import {NInput, NSpace} from 'naive-ui'
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
    <n-input
      v-model:value="value"
      type="textarea"
      placeholder="基本的 Textarea"
    />
  </n-space>
  
</template>

<style scoped>

svg{
    width: 300px; height: 300px;
    background-color:aliceblue;
}


</style>
