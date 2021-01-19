<template>
  <div id="addchild">
    <div v-if="notNull(data.Question)" class="mb-5" align="right">
      <div style="max-width: 90%" class="grey lighten-4 pa-2 rounded">
        <div class="mb-2 text-caption font-weight-bold" align="left">
          Mục con
          <span class="success--text">[Radio, TextBox]</span>
        </div>
        <draggable
          element="span"
          v-model="data.Question"
          v-bind="dragOptions"
          :group="{ name: 'items' }"
          ghost-class="ghost"
          :scroll-sensitivity="250"
          @start="dragging = true"
          @end="dragging = false"
          @sort="
            $store.commit('setQID')
            justOnly(data.Question);
          "
          handle=".move"
          :sort="true"
        >
          <transition-group type="transition" tag="v-list">
            <div class="mb-2" v-for="(element, j) in data.Question" :key="j">
              <div class="px-3" @click="editing?edititem = j:''">
                <v-row>
                  <v-col cols="10">
                    <component
                      align="left"
                      :style="(edititem != j && editing)?'opacity: 0.2;':''"
                      :class="editing ? '' : 'pointer'"
                      :index="j"
                      :is="element.Type"
                      :data="element"
                      :change="change"
                      :key="j"
                      :editable="edititem == j"
                      @isEditting="editing = $event; edititem = -1;"
                      @remove="removeChild"
                    ></component>
                  </v-col>
                  <v-col width="50" class="move">
                    <v-btn class="mt-2" text icon color="gray">
                      <v-icon size="20">mdi-drag</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "AddChild",
  props: {
    i: Number,
    data: {
      Question: Array,
    },
    change: Function,
  },
  data() {
    return {
      edititem: -1,
      editing: false,
    };
  },
  methods: {
    justOnly(questions) {
      questions.map((val, i) => {
        if (["TextBox", "Radio"].includes(val.Type)) {
          return;
        } else {
          questions.splice(i, 1);
        }
      });
    },
    notNull(questions) {
      return questions != undefined;
    },
    removeChild(i) {
      this.data.Question.splice(i, 1);
    },
  },
  components: {
    TextBox: () => import("../TextBox"),
    Radio: () => import("../Radio"),
    draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>

<style>
</style>