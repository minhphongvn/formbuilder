<template>
  <div
    id="Session"
    :class="editable ? 'hold px-3' : ''"
    class="mt-3 pt-2 pb-3 mb-3"
  >
    <div v-if="editable">
      <v-text-field
        v-model="data.Name"
        v-on:keyup.enter="editable = !editable"
        dense
        autofocus
      ></v-text-field>
      <v-textarea
        hide-details="true"
        rows="2"
        auto-grow
        v-model="data.Des"
        dense
      ></v-textarea>
      <v-flex class="mx-3 mt-3">
        <v-row>
          <v-col style="height: 40px" class="drag pa-0" cols="2"></v-col>
          <v-spacer></v-spacer>
          <toolbax
            deleteContent="Xóa phần"
            :remove="remove"
            :change="change"
            @editable="
              coverty();
              editable = $event;
            "
          ></toolbax>
        </v-row>
      </v-flex>
    </div>
    <div class="mb-3" v-if="!editable" v-on:click="editable = !editable">
      <div class="alert-primary py-2 text-center">
        {{ data.Name }}
      </div>
      <div v-html="data.Des"></div>
    </div>
    <draggable
      element="span"
      class="list-group"
      v-model="data.Question"
      v-bind="dragOptions"
      :sort="!editing"
      :scroll-sensitivity="250"
      @start="dragging = true"
      @end="dragging = false"
      @sort="handleSort()"
      handle=".pointer"
      :group="{ name: 'items' }"
    >
      <transition-group type="transition" tag="div">
        <div v-for="(element, i) in data.Question" :key="i">
          <v-card :ripple="false" flat class="my-2">
            <div v-bind="attrs" v-on="on" rounded>
              <component
                :class="editing ? '' : 'pointer'"
                :is="element.Type"
                :data="element"
                :getQID="handleSort"
                :change="change"
                :index="i"
                :key="i"
                @isEditting="editing = $event"
                @remove="removeComponent"
              ></component>
            </div>
          </v-card>
        </div>
      </transition-group>
      <!-- <div v-if="(data.Question.length) == 0" class="text-center" style="outline: 2px dotted #1e88e5;" v-text="'Kéo thả vào đây !'"></div> -->
    </draggable>
  </div>
</template>

<script>
import Radio from "./Radio.vue";
import Checkbox from "./CheckBox";
import TextBox from "./TextBox.vue";
import TextArea from "./TextArea.vue";
import MarkTable from "./MarkTable.vue";
import FileInput from "./FileInput.vue";
import draggable from "vuedraggable";
import toolbax from "./layout/bottom-toolbar";

export default {
  name: "Session",
  props: {
    handleSort: Function,
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
    };
  },
  methods: {
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
        ghostClass: "ghost",
        dragClass: "ghost",
      };
    },
  },
  components: {
    draggable,
    Checkbox,
    TextBox,
    Radio,
    FileInput,
    MarkTable,
    TextArea,
    toolbax,
  },
};
</script>
<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
/* .list-group {
  min-height: 20px;
} */
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

.list-group:empty,
.list-group > div:empty {
  outline: 1px dotted #1e88e5;
  padding: 0rem 1rem;
  text-align: center;
}

.list-group:empty:before,
.list-group > div:empty:before {
  opacity: 0.7;
  color: #1e88e5;
  content: "Kéo thả ở đây !";
}

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

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.headbar:active {
  background-color: #f1f1f1;
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