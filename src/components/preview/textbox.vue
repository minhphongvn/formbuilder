<template>
  <div id="textbox">
    <div class="my-3 font-weight-bold" v-text="data.Text"></div>
    <v-text-field class="my-2" :placeholder="data.Holder" outlined dense />
  </div>
</template>

<script>
export default {
  name: "textbox",
  props: {
    data: Object,
  },
};
</script>

<style>
</style>