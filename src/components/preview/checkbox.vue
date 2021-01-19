<template>
  <div id="checkbox">
    <div class="my-3 font-weight-bold">{{ data.Text }}</div>
    <div v-for="(item, i) in data.Option" :key="i">
      <v-checkbox class="handle my-0 py-0" :label="item.Text" />
    </div>
  </div>
</template>

<script>
export default {
  name: "checkbox",
  props: {
    data: Object,
  },
};
</script>

<style>
</style>