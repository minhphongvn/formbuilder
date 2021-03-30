<template>
  <div id="child">
    <div v-if="notNull(data.Question)" class="mt-1 mb-5 ml-15" align="right">
      <div>
        <draggable
            element="span"
            v-model="data.Question"
            v-bind="dragOptions"
            :group="{ name: 'child' }"
            ghost-class="ghost2"
            :scroll-sensitivity="250"
            @start="dragging = true"
            @end="dragging = false"
            @sort="
            $store.commit('setQID')
          "
            handle=".pinter"
            :sort="true"
        >
          <transition-group type="transition" tag="v-list">
            <div class="my-1" v-for="(element, j) in data.Question" :key="j">
              <component
                  align="left"
                  class="y-0"
                  :style="(edititem != j && editing)?'opacity: 0.2;':''"
                  :class="editing ? '' : 'pinter'"
                  :index="j"
                  :is="element.Type"
                  :data="element"
                  :change="change"
                  :full="false"
                  :key="j"
                  :editable="edititem == j"
                  @isEditting="editing = $event; edititem = -1;"
                  @remove="removeChild"
              ></component>
            </div>
          </transition-group>
        </draggable>
      </div>
      <v-flex class="rounded text-center">
<!--        <span class="grey&#45;&#45;text text&#45;&#45;darken-1 text-subtitle-2 mr-2">Nhấn để tạo</span>-->

        <v-btn @click="addTextBox" v-tooltip.left="'Trả lời ngắn'" color="white" class="text-sm-subtitle-2 blue align-center rounded-tl rounded-bl" tile text><span><v-icon>mdi-text-short</v-icon></span></v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="addRadio" v-tooltip.right="'Trắc nghiệm'" color="white" class="text-sm-subtitle-2 blue align-center rounded-tr rounded-br" tile text><span><v-icon>mdi-radiobox-marked</v-icon></span></v-btn>
      </v-flex>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: "child-control",
  props: {
    i: Number,
    data: {
      Question: Array,
    },
    change: Function,
  },
  data(){
    return {
    }
  },
  methods:{
    toolTip(content){
      return {
        content: content,
      }
    },
    notNull(questions) {
      return questions != undefined;
    },
    removeChild(i) {
      this.data.Question.splice(i, 1);
    },
    addTextBox(){
      this.data.Question.push({
        QID: "",
        Required: false,
        Type: "TextBox",
        Text: "Câu hỏi",
        Holder: "",
      })
      this.$store.commit('setQID')
    },
    addRadio(){
      this.data.Question.push({
        QID: "",
        Type: "Radio",
        Text: "Câu hỏi",
        Option: [
          {
            Text: "Tuỳ chọn 1",
          },
          {
            Text: "Tuỳ chọn 2",
          },
        ],
      })
      this.$store.commit('setQID')
    }
  },
  components: {
    TextBox: () => import("../controls/TextBox"),
    Radio: () => import("../controls/Radio"),
    draggable
  },
  computed:{
    dragOptions() {
      return {
        animation: 220,
        disabled: false,
      };
    },
  }

}
</script>

<style scoped>

</style>
