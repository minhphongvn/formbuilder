<template>
  <div id="textarea">
    <div class="my-3 font-weight-bold" v-text="data.Text"></div>
    <v-textarea rows="2" :placeholder="data.Holder" outlined />
  </div>
</template>

<script>
export default {
  name: "textarea",
  props: {
    data: Object,
  },
};
</script>

<style>
</style>