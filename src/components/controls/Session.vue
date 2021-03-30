<template>
  <div
    id="Session"
    class="mt-3 pt-2 pb-2 mb-3"
  >
    <div v-if="editable" class="py-2" :class="editable ? 'hold px-3' : ''" v-click-outside="()=>{editable = false;coverty();isEditing(false);}">
      <v-text-field class="font-weight-bold"
        placeholder="Tên phần"
        v-model="data.Name"
        v-on:keyup.enter="isEditing(false)"
        dense
        autofocus
      ></v-text-field>
      <v-textarea placeholder="Mô tả phần"
        hide-details="true"
        rows="2"
        auto-grow
        v-model="data.Des"
        dense
      ></v-textarea>
      <v-flex class="mx-3 mt-4">
        <v-row>
          <v-col style="height: 40px" class="drag pa-0" cols="2"></v-col>
          <v-spacer></v-spacer>
          <toolbax
              v-if="template.Part.length >1"
            :remove="remove"
            :change="change"
            @editable="
              coverty();
              isEditing(false);
              editable = $event;
              tab = (tab>0)?(index - 1):0;
            "
          ></toolbax>
        </v-row>
      </v-flex>
    </div>
    <div class="mb-3" v-if="!editable" v-on:click="editable=true;isEditing(true)">
      <div class="alert-primary py-2 text-center">
        <span>{{ data.Name }}</span>
      </div>
      <div v-html="data.Des"></div>
    </div>
    <draggable
      element="span"
      :animatiton="false"
      :class="draggle?'':'list-group'"
      v-model="data.Question"
      v-bind="dragOptions"
      :ghost-class="$store.state.moveControl?'ghost':''"
      :sort="isDragging"
      :scroll-sensitivity="250"
      @sort="$store.commit('setQID');"
      :handle="isDragging?'.pointer':'ss'"
      :group="{ name: 'items' }"
    >
      <transition-group type="transition" tag="div">
        <div v-for="(element, i) in data.Question" :key="i">
          <v-card :ripple="false" :class="(outlined == i)?'':''" @mouseover="outlined = i" @mouseleave="outlined = -1" flat class="my-2">
            <div
              v-bind="attrs"
              v-on="on"
              rounded
              @click="editable=false; editing ? (edititem = i): ''"
            >
              <component
                :style="edititem != i && editing ? 'opacity: 1;' : ''"
                :class="editing ? '' : 'pointer'"
                :is="element.Type"
                :data="element"
                :change="change"
                :index="i"
                :key="i"
                :dragging="isDragging"
                @isEditting="
                  editing = $event;
                  edititem = -1;
                "
                @remove="removeComponent"
              ></component>
            </div>
          </v-card>
        </div>
      </transition-group>
      <!-- <div v-if="(data.Question.length) == 0" class="text-center" style="outline: 2px dotted #1e88e5;" v-text="'Kéo thả vào đây !'"></div> -->
    </draggable>
<!--    <div :class="(draggle || (data.Question.length) == 0)?'':'susgest'"></div>-->
  </div>
</template>

<script>
import Radio from "./Radio.vue";
import Checkbox from "./CheckBox";
import TextBox from "./TextBox.vue";
import TextArea from "./TextArea.vue";
import MarkTable from "./MarkTable.vue";
import draggable from "vuedraggable";
import toolbax from "../layout/bottom-toolbar";

export default {
  name: "Session",
  props: {
    change: Function,
    data: {
      QID: String,
      Name: String,
      Des: String,
      Question: Array,
    },
    index: Number,
  },
  data: function () {
    return {
      items: {
        Radio: "Trắc nghiệm",
        Checkbox: "Hộp kiểm",
        TextBox: "Trả lời ngắn",
        TextArea: "Đoạn",
        MarkTable: "Mẫu đánh giá",
      },
      editable: false,
      dragging: false,
      editing: false,
      edititem: -1,
      outlined: false
    };
  },
  methods: {
    isEditing(value) {
      this.edititem = -1;
      this.$emit("isEditting", value);
    },
    coverty() {
      const mota = this.data.Des;
      this.data.Des = mota.replace(/[\n\r]/g, "<br/>");
    },
    remove() {
      this.$emit("remove", this.index);
    },
    removeComponent(i) {
      this.data.Question.splice(i, 1);
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        // ghostClass: "ghost",
        // dragClass: "ghost",
      };
    },
    template: {
      get(){
        return this.$store.state.template;
      },
      set(value){
        return this.$store.commit("setTemplate", value)
      }
    },
    isDragging: {
      get(){
        return this.$store.state.dragging;
      },
      set(value){
        return this.$store.commit("setDragging", value)
      }
    },
    draggle: {
      get(){
        return this.$store.state.draggle;
      },
      set(value){
        return this.$store.commit("setDraggle", value)
      }
    },
    tab: {
      get(){
        return this.$store.state.tab;
      },
      set(value){
        this.$store.commit('pickTab',value);
      }
    }
  },
  components: {
    draggable,
    Checkbox,
    TextBox,
    Radio,
    MarkTable,
    TextArea,
    toolbax,
  },
};
</script>
<style scoped>

.list-group {
  cursor: move;
  min-height: 50px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}

/*.list-group:empty,*/
/*.list-group > div:empty {*/
/*  outline: 2px dotted gray;*/
/*  padding: 0.2rem 1rem;*/
/*  text-align: center;*/
/*}*/
/*.list-group:empty:before,*/
/*.list-group > div:empty:before {*/
/*  opacity: 0.7;*/
/*  color: gray;*/
/*  content: "Thả ở đây";*/
/*}*/

.list-group:empty,
.list-group > div:empty,
.list-group > div:not(:empty):after{
  display: flow-root;
  border: 2px dotted grey;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  text-align: center;
}

.list-group:empty:before,
.list-group > div:empty:before,
.list-group:not(:empty),
.list-group > div:not(:empty):after {
  opacity: 0.7;
  color: grey;
  content: "Thả ở đây";
}

/*.cyt > div:not(:empty):after {*/
/*  display: flow-root;*/
/*  outline: 1px dotted grey;*/
/*  padding: 0rem 1rem;*/
/*  text-align: center;*/
/*}*/

/*.cyt:not(:empty),*/
/*.cyt > div:not(:empty):after {*/
/*  opacity: 0.7;*/
/*  color: gray;*/
/*  content: "Thả ở đây";*/
/*}*/

/*.list-group,*/
/*.list-group > div {*/
/*  outline: 1px dotted gray;*/
/*  text-align: center;*/
/*}*/

/*.list-group:empty:before,*/
/*.list-group > div:empty:before {*/
/*  opacity: 0.7;*/
/*  color: gray;*/
/*  content: "Kéo thả ở đây !";*/
/*}*/

/* .hold{
  background-color: rgb(202, 202, 202)!important;
} */
/* .hold:hover {
  outline: 2px solid rgba(128, 128, 128, 0.425);
} */
.drag {
  cursor: grab;
}
.pointer {
  cursor: pointer;
}
/* .ghost {
  opacity: 0.8;
  background: rgba(0, 128, 179, 0.274);
} */

/* .ghost {
  opacity: 0.8;
  background: rgba(0, 128, 179, 0.274);
} */

.headbar:active {
  background-color: #f1f1f1;
}
.focused {
  background-color: #ececec;
}
.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  font-size: 17px;
  font-weight: bold;
}
</style>
