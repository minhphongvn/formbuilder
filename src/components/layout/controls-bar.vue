<template>
  <div>
    <div
      class="floatDown rounded"
      horizontal
    >
      <div v-show="dragging">
        <div
          class="d-inline px-4"
          v-for="(element, i) in controls"
          :key="i"
        >
          <span>
            <v-icon class="mr-1" v-text="items[i].icon"></v-icon>
          </span>
        </div>
      </div>
      <draggable
        v-show="!dragging"
        v-model="controls"
        :sort="false"
        :move="()=>draggle = true"
        v-bind="dragOptions"
        @choose="draggle = false;"
        @unchoose="draggle = true;"
        @start="
          // isDragging(true);
          // draggle = false;
          $store.state.moveControl = true;
          dragging = true;
        "
        @end="
          // isDragging(false);
          // draggle = false;
          $store.state.moveControl = false;
          dragging = false;
        "
        :group="{ name: 'items', pull: 'clone', put: false }"
        :clone="handleClone"
      >
        <div
          class="px-4 grab"
          :class="!dragging ? 'd-inline' : ''"
          v-for="(element, i) in controls"
          :key="i"
          @click="
            scroll();
            data.Part[data.Part.length - 1].Question.push(
              JSON.parse(JSON.stringify(element))
            );
            $store.commit('setQID')
          "
        >
          <!-- <span class="blue--text text--darken-4">
              {{ items[i].icon }}
            </span> -->
          <!-- <span :class="(!show)?'mr-0':'mr-2'">
              <v-icon v-text="items[i].icon"></v-icon>
              <span v-text="items[i].name"></span>
            </span> -->
          <span class="py-2" v-tooltip="items[i].name">
            <v-icon
              v-show="!dragging"
              class="mr-1"
              v-text="items[i].icon"
            ></v-icon>
          </span>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "",
  props: {
    data: {
      Part: Array,
      dragging: false,
    },
    scroll: Function,
  },
  data: function () {
    return {
      dragging: false,
      show: false,
      items: [
        { icon: "mdi-radiobox-marked", name: "Trắc nghiệm" },
        { icon: "mdi-checkbox-marked", name: "Hộp kiểm" },
        { icon: "mdi-text-short", name: "Trả lời ngắn" },
        { icon: "mdi-text-subject", name: "Đoạn" },
        { icon: "mdi-table", name: "Mẫu đánh giá" },
      ],
      controls: [
        {
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
        },
        {
          GroupID: "",
          Type: "Checkbox",
          Text: "Câu hỏi",
          Option: [
            {
              QID: "",
              Text: "Tuỳ chọn 1",
            },
          ],
        },
        {
          QID: "",
          Required: false,
          Type: "TextBox",
          Text: "Câu hỏi",
          Holder: "",
        },
        // {
        //   QID: "",
        //   Type: "FileInput",
        //   Text: "Tiêu đề",
        // },
        {
          QID: "",
          Type: "TextArea",
          Required: false,
          Text: "Câu hỏi",
          Row: "3",
          Holder: "",
        },
        {
          Type: "MarkTable",
          Text: "Tiêu đề MarkTable",
          Des: "Mô tả",
          ValueArray: [
            {
              Value: "1",
              Text: "Nội dung"
            },
            {
              Value: "2",
              Text: "Nội dung"
            },
            {
              Value: "3",
              Text: "Nội dung"
            },
            {
              Value: "4",
              Text: "Nội dung"
            },
            {
              Value: "5",
              Text: "Nội dung"
            },
          ],
          Topic: [
            {
              GroupID: "",
              Name: "TIÊU ĐỀ NHÓM CÂU HỎI",
              Question: [
                {
                  QID: "",
                  Text: "1. Câu hỏi",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    isDragging(val) {
      this.$emit("dragging", val);
    },
    handleClone(item) {
      // Create a fresh copy of item
      let cloneMe = JSON.parse(JSON.stringify(item));
      this.$delete(cloneMe, "uid");
      return cloneMe;
    },
    // uuid(e) {
    //   if (e.uid) return e.uid;
    //   const key = Math.random().toString(16).slice(2);
    //   this.$set(e, "uid", key);
    //   return e.uid;
    // },
  },
  components: {
    draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: false,
      };
    },
    draggle: {
      get(){
        return this.$store.state.draggle;
      },
      set(value){
        return this.$store.commit("setDraggle", value)
      }
    },
  },
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  background-color: rgba(0, 128, 179, 0.274);
}
.grab:hover {
  background-color: transparent !important;
}
.grab {
  cursor: -webkit-grab;
  cursor: grab;
}
.grab:hover {
  background-color: rgba(114, 114, 114, 0.164);
}
/* .ghost {
  opacity: 0.8;
  background-color: rgba(0, 128, 179, 0.274);
} */
.is-show {
  display: flex;
  text-align: left;
  margin-left: 5px;
}

/* .floatLeft{
  display: block !important;
} */

/* .floatDown{
  display: none !important;
} */
.floatLeft {
  display: none !important;
}
.floatDown {
  /* background-color: #00000050; */
  padding: 6.5px 0px;
  width: 320px !important;
  border-radius: 2px;
  display: block !important;
}

@media only screen and (max-width: 1024px) {
  .is-show {
    display: none !important;
  }
}

@media only screen and (max-width: 720px) {
  .floatLeft {
    display: none !important;
  }
  .floatDown {
    border-radius: 2px;
    display: block !important;
  }
}
</style>
