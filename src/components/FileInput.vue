<template>
  <div id="fileinput">
    <div v-if="editable">
      <v-text-field
        class="my-2"
        v-model="data.Text"
        v-on:keyup.enter="editable = !editable"
        dense
        autofocus
      ></v-text-field>
      <v-btn color="primary" class="mb-3" @click="editable = !editable" block>
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <div v-if="!editable" @click="editable = !editable">
      <div class="mb-2 font-weight-bold" v-text="data.Text"></div>
      <template>
        <v-file-input show-size multiple label="Nhập file"></v-file-input>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextArea",
  props: {
    data: {
      QID: String,
      Text: String,
    },
  },
  data: function () {
    return {
      editable: false,
    };
  },
};
</script>