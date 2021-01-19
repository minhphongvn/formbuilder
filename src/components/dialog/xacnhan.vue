<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        text
        v-bind="attrs"
        v-on="on"
        :icon="icon"
        :rounded="rounded"
        :color="color"
        :small="small"
      >
        <span v-if="icon==false">{{ src }}</span>
        <v-icon v-if="icon">{{ src }}</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning darken-1" text @click="agree"> Đồng ý </v-btn>
        <v-btn color="success darken-1" text @click="dialog = false">
          Trở lại
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "xacnhan",
  props: {
    disabled: Boolean,
    // btnContent: String,
    title: {
      type: String,
      default: "Vui lòng xác nhận",
    },
    message: String,
    icon: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: "mdi-account"
    },
    rounded: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    agree() {
      this.$emit("agree");
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>
