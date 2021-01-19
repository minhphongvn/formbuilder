<template>
  <div id="radio">
    <div v-if="editable">
      <v-text-field
        label="Tiêu đề câu hỏi"
        class="my-5"
        v-model="data.Text"
        v-on:keyup.enter="editable = !editable"
        dense
        @focus="focusable"
      ></v-text-field>
      <div v-for="(item,i) in data.Option" :key="i">
        <v-text-field
            :label="'Option ' + (i+1)"
            class="my-2"
            v-model="data.Option[i].Text"
            v-on:keyup.enter="editable = !editable"
            dense
            @focus="focusable"
            >
            <template slot="append-outer">
              <v-btn v-if="i === data.Option.length - 1" @click="addChild(i); added = !added" :color="(added)?'primary':'grey'" text>Khác</v-btn>
              <v-icon @click="data.Option.splice(i,1); editable = -1">mdi-delete</v-icon>
            </template>
        </v-text-field>
      </div>
      <v-btn
        class="my-2"
        color="blue"
        v-on:click="
          data.Option.push({ 
            QID: genQID(),
            Text: 'Radio ' + (data.Option.length + 1) })
        "
        outlined
        block
        >Thêm</v-btn
      >
      <v-btn color="primary" @click="editable = !editable" block>
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>

    <div v-if="!editable" @click="editable = !editable">
      <div class="my-3 font-weight-bold">{{ data.Text }}</div>
      <v-radio-group :mandatory="false">
        <draggable
        v-model="data.Option"
        element="span"
        :group="{ name: 'question' }"
        :sort="true"
        handle=".handle"
        v-bind="dragOptions"
        >
          <transition-group type="transition" class="py-0" group tag="div">
            <div v-for="(item,i) in data.Option" :key="i">
              <v-radio :value="i" class="handle my-1" :label="item.Text" />
            </div>
          </transition-group>
        </draggable>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Radio",
  props: {
    data: {
      QID: String,
      Text: String,
      Option: Array,
    },
  },
  data: function () {
    return {
      editable: false,
      added: false,
    };
  },
  methods: {
    genQID() {
      const key = Math.floor(Math.random() * (1000000 - 1)) + 100000;
      return key;
    },
    focusable(e) {
      e.target.select();
    },
    addChild(index) {
      this.data.Option = this.data.Option.map((option, idx) => {
        if (index === idx) {
          return {
            ...option,
            Des: "",
            Question: [
              {
                Type: "TextBox",
                Text: "Mô tả",
                QID: this.genQID(),
                Holder: "",
              },
            ],
          };
        }
        return option;
      });
    },
  },
  components: {
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