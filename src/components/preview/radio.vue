<template>
  <div id="radio">
    <span class="mt-4 font-weight-bold">{{ data.Text }}</span>
    <v-radio-group class="my-1" :mandatory="false">
      <div v-for="(item, i) in data.Option" :key="i">
        <v-radio :value="i" class="handle my-2" :label="item.Text" />
      </div>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "radio",
  props: {
    data: Object,
  },
};
</script>

<style>
</style>