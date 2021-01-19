<template>
  <div id="marktable">
    <div class="my-3 font-weight-bold" v-text="data.Text"></div>
    <div class="my-2" v-html="data.Des" />
    <div v-for="(item, i) in data.Topic" :key="i">
      <div class="font-weight-bold green--text my-4">{{ item.Name }}</div>
      <div class="mt-3" v-for="(ques, j) in item.Question" :key="j">
        <div class="font-weight-bold">{{ ques.Text }}</div>
        <point :data="data.ValueArray"></point>
      </div>
    </div>
  </div>
</template>

<script>
import point from './points'

export default {
  props: {
    data: Object,
  },
  components: {
    point
  }
};
</script>

<style>
</style>