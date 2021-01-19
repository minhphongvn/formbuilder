<template>
  <div class="pb-2">
    <v-col v-if="delShow" class="d-inline drag mr-0 pr-0">
      <v-btn
        elevation="0"
        color="grey"
        large
        @click="
          change();
          remove();
          $store.commit('setQID');
          edited();
        " icon
      >
        <v-icon>mdi-trash-can-outline</v-icon>
        {{deleteContent}}
      </v-btn>
    </v-col>
<!--    <v-col v-if="saveShow" class="d-inline drag pr-0">-->
<!--      <v-btn elevation="0" width="70" color="primary" @click="edited">-->
<!--        <v-icon>mdi-content-save</v-icon>-->
<!--        {{savecontent}}-->
<!--      </v-btn>-->
<!--    </v-col>-->
  </div>
</template>

<script>
export default {
  props: {
    remove: Function,
    change: Function,
    deleteContent: String,
    savecontent: String,
    delShow: {
      type: Boolean,
      default: true
    },
    saveShow: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    edited: function () {
      this.$emit("editable", false);
    },
  },
};
</script>

<style>
</style>