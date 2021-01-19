<template>
  <div id="textbox">
    <div :class="`${editable ? 'hold' : ''} ${full&&dragging==false?'py-2':'py-0'}`" v-click-outside="()=>{editable = false;editing(false)}">
      <div v-if="editable" class="px-3">
        <v-text-field
          class="my-5 font-weight-bold"
          v-model="data.Text"
          v-on:keyup.enter="editing(false)"
          dense
          autofocus
          hide-details
        ></v-text-field>
        <v-text-field
          placeholder="Gợi ý nhập"
          class="my-2"
          v-model="data.Holder"
          v-on:keyup.enter="editing(false)"
          dense
        />
        <v-divider class="my-4"></v-divider>
        <v-flex class="mx-3 mt4">
          <v-row>
            <v-col style="height: 40px" class="drag">
              <v-switch
                v-model="data.Required"
                class="my-0 py-0"
                color="error"
                inset
                dense
                label="Bắt buộc"
              ></v-switch>
            </v-col>
            <v-spacer></v-spacer>
            <toolbax
              :change="change"
              :remove="remove"
              @editable="
                editing(false);
                editable = $event;
              "
            ></toolbax>
          </v-row>
        </v-flex>
      </div>
      <div class="pointer" v-if="!editable" @click="editable=true; editing(true)">
        <div v-if="full&&dragging == false">
          <div class="text-start mb-3 font-weight-bold" v-text="data.Text"></div>
          <v-text-field
              disabled
              hide-details
              class="mx-0"
              :placeholder="data.Holder"
              outlined
              dense
          />
        </div>
        <div v-if="full == false&&dragging == false" align="left">
          <v-flex class="grey lighten-3 rounded pa-2"><span class="mr-2"><v-icon>mdi-text-short</v-icon></span><span class="text-subtitle-2 mb-2" v-text="'Trả lời ngắn'"></span></v-flex>
        </div>
        <div v-if="dragging" align="left">
          <v-flex class="grey lighten-3 rounded pa-2"><span class="mr-2"><v-icon>mdi-text-short</v-icon></span><span class="text-subtitle-2 mb-2" v-text="data.Text"></span></v-flex>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toolbax from "./layout/bottom-toolbar";
export default {
  name: "Textbox",
  props: {
    data: {
      QID: String,
      Required: Boolean,
      Text: String,
      Holder: String,
    },
    change: Function,
    index: Number,
    full: {
      type: Boolean,
      default: true
    },
    dragging:{
      type: Boolean,
      default: false
    }
    // editable: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data: function () {
    return {
      editable: false,
    };
  },
  methods: {
    editing(value) {
      // this.$emit("isEditting", value);
      this.$store.commit('setChinhSua',value)
    },
    remove() {
      this.$emit("remove", this.index);
    },
  },
  components: {
    toolbax,
  },
};
</script>
