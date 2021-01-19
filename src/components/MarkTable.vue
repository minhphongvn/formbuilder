<template>
  <div id="marktable">
    <div :class="`${dragging==false?'mt-5':'mt-0'}`">
      <div
        v-if="editable" :class="`${editable ? 'hold' : ''} ${dragging==false?'py-2':'py-0'}`" v-click-outside="()=>{editable = false;mergeDes();editing(false)}"
        class="px-3 my-3 rounded"
      >
        <v-text-field
          class="my-2 font-weight-bold"
          v-model="data.Text"
          dense
          @focus="focusable"
        ></v-text-field>
        <v-textarea
          rows="2"
          auto-grow
          label="Chỉnh sửa mô tả"
          class="my-2"
          v-model="data.Des"
          @change="coverty"
          dense
        />
        <div class="mb-2 caption font-weight-medium primary--text">
          Chỉnh sửa nội dung mức điểm
        </div>
        <div>
<!--          <v-radio-group v-model="scoreVal" class="my-2 ml-2" @change="handleScoreColumn" row>-->
<!--            <v-radio :on-icon="`mdi-numeric-${i}-box`" :off-icon="`mdi-numeric-${i}-box-outline`" v-for="i in [2,3,4,5,6]" :value="i" :key="i"></v-radio>-->
<!--          </v-radio-group>-->
          <v-btn-toggle
            v-model="scoreVal"
            class="mb-2"
            @change="handleScoreColumn" tile mandatory>
            <v-btn :ripple="false" class="text-subtitle-2" active-class="aa" v-for="i in [2,3,4,5,6]" :value="i" v-text="i" :key="i"></v-btn>
          </v-btn-toggle>
        </div>
        <v-row no-gutters>
<!--          <div>{{ updateRate }}</div>-->

          <v-col v-for="(item, i) in data.ValueArray" :key="i">
            <div
              class="py-1 text-center primary white--text text-subtitle-2"
              outlined
            >
              {{ item.Value }}
            </div>
            <div class="px-2 grey lighten-3">
              <v-textarea
                rows="2"
                auto-grow
                v-model="item.Text"
                :rules="[$store.state.required]"
                required
                @focus="focusable"
                class="mt-0"
              ></v-textarea>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-flex class="mx-3 mt-2">
          <v-row>
            <v-col class="drag" cols="2"> </v-col>
            <v-spacer></v-spacer>
            <toolbax
              :remove="remove"
              :change="change"
              @editable="
                editing(false);
                coverty();
                editable = $event;
              "
            ></toolbax>
          </v-row>
        </v-flex>
      </div>
      <div v-if="dragging" @click="
          editable = true
          editing(true);
        " align="left">
        <v-flex class="grey lighten-3 rounded pa-2"><span class="mr-2"><v-icon>mdi-table</v-icon></span>
          <span class="text-subtitle-2 mb-2" v-text="data.Des.replaceAll('<br/>','  ')"></span>
        </v-flex>
      </div>
      <div
        @click="
          editable = true;
          editing(true);
        "
        v-if="!editable&&dragging==false"
      >
        <div class="text-start mt-2 font-weight-bold" v-text="data.Text"></div>
        <div class="text-start my-3" v-html="data.Des" />
<!--        <div class="text-start" v-html="valueArray"></div>-->
      </div>
      <div v-if="dragging==false" v-click-outside="()=>edititem = {}">
        <div v-for="(item, i) in data.Topic" :key="i">
          <v-card flat class="mb-0 pb-3" align="left">
            <div>
              <div
                  v-if="edititem == item"
                  :class="edititem == item ? 'hold' : ''"
                  class="px-3 pt-2 pb-1"
              >
                <v-text-field
                    class="mb-2 font-weight-bold"
                    v-model="item.Name"
                    @focus="focusable"
                    autofocus
                />
                <draggable
                    v-model="item.Question"
                    element="span"
                    :group="{ name: 'group-question' }"
                    handle=".group-question"
                    ghost-class="ee"
                    @sort="$store.commit('setQID')"
                    v-bind="dragOptions"
                >
                  <transition-group type="transition" class="py-0" group tag="div">
                <div class="white rounded" v-for="(ques, j) in item.Question" :key="j">
                  <v-text-field
                      class="custom2"
                      hide-details
                      solo
                      flat
                      v-model="ques.Text"
                      dense
                      :autofocus="j == item.Question.length-1"
                  >
                    <template slot="prepend">
                      <v-icon class="group-question">mdi-drag-vertical</v-icon>
                    </template>
                    <template slot="append-outer">
                      <v-icon
                          @click="
                        change();
                        item.Question.splice(j, 1);
                        $store.commit('setQID')
                      "
                      >mdi-close</v-icon
                      >
                    </template>
                  </v-text-field>
                  <v-divider class="mr-8"></v-divider>
                </div>

                  </transition-group>
                </draggable>
                <div>
                  <v-text-field
                      readonly
                      color="grey lighten-4"
                      style="width: 150px"
                      class="text-body-1 custom my-4"
                      @click="
                       item.Question.push({
                        QID: '',
                        Text: item.Question.length + 1 + '. ',
                    });
                    $store.commit('setQID')
                    "
                      dense
                      hide-details
                      placeholder="Thêm câu hỏi"
                  />
                </div>
                <v-divider class="my-4"></v-divider>
                <v-flex class="mx-3 mt-4">
                  <v-row>
                    <v-col style="height: 40px" class="drag pa-0" cols="2">
                      <!--                    <v-btn-->
                      <!--                      elevation="0"-->
                      <!--                      class="ma-0"-->
                      <!--                      color="success"-->
                      <!--                      @click="-->
                      <!--                        item.Question.push({-->
                      <!--                          QID: '',-->
                      <!--                          Text: item.Question.length + 1 + '. ',-->
                      <!--                        });-->
                      <!--                        $store.commit('setQID')-->
                      <!--                      "-->
                      <!--                      >+ </v-btn-->
                      <!--                    >-->
                    </v-col>
                    <v-spacer></v-spacer>
                    <div class="pb-2">
                      <v-col class="d-inline drag mr-0 pr-0">
                        <v-btn
                            elevation="0"
                            class="ma-0"
                            color="grey"
                            @click="removeTopic(i)"
                            large
                            icon
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </v-col>
                    </div>
                    <!--                  <toolbax-->
                    <!--                    :change="change"-->
                    <!--                    @editable="-->
                    <!--                      editing(false);-->
                    <!--                      edititem = $event;-->
                    <!--                    "-->
                    <!--                    :delShow="false"-->
                    <!--                  ></toolbax>-->
                  </v-row>
                </v-flex>
              </div>
              <div
                  v-if="edititem != item"
                  @click="
                edititem = item;
                editing(true);
              "
              >
                <div class="font-weight-bold green--text">
                  {{ item.Name }}
                </div>
                <div
                    class="handle"
                    v-for="(ques, j) in item.Question"
                    :key="j"
                >
                  <div>{{ ques.Text }}</div>
                  <point v-if="viewMode" class="mb-4" :data="data.ValueArray"></point>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </div>

      <!-- </transition-group>
      </draggable> -->
      <v-btn
          class="mb-4"
          v-if="dragging==false"
        small
        color="blue"
        v-on:click="
          data.Topic.push({
            GroupID: '',
            Name: 'TIÊU ĐỀ NHÓM CÂU HỎI',
            Question: [
              {
                QID: '',
                Text: '1. Câu hỏi',
              },
            ],
          });
          $store.commit('setQID')
        "
        outlined
        ><v-icon small>mdi-plus</v-icon> Thêm nhóm câu hỏi</v-btn
      >
    </div>
  </div>
</template>

<script>
import toolbax from "./layout/bottom-toolbar";
import point from "./preview/points";
import draggable from "vuedraggable";

export default {
  name: "marktable",
  props: {
    change: Function,
    data: {
      Text: String,
      Des: String,
      ValueArray: Array,
      Topic: Array,
    },
    index: Number,
    dragging:{
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      des: "",
      scoreVal: 5,
      editable: false,
      edititem: {},
      markbar: false,
    };
  },
  methods: {
    isNumeric(value) {
      return /^-?\d+$/.test(value);
    },
    mergeDes(){
      const des = this.data.Des.split("<br/>").map(value => {
        if (this.isNumeric(value.trim()[0])){
          return "";
        }
        return `${value.trim().length == 0?'':value.trim() + '<br/>'}`;
      }).join("");
      const points = this.data.ValueArray;
      this.data.Des = `${des} ${points.map(val => `<br/>${val.Value}. ${val.Text}`).join().replaceAll(",","")}`
    },
    removeTopic(i) {
      this.change();
      this.data.Topic.splice(i, 1);
      this.editing(false);
      this.$store.commit('setQID')
    },
    editing(value) {
      // this.$emit("isEditting", value);
      this.$store.commit('setChinhSua',value)
    },
    remove() {
      this.$emit("remove", this.index);
    },
    handleScoreColumn() {
      let ori = this.data.ValueArray.length;
      const score = this.scoreVal;
      // console.log(ori, score);
      if (ori >= score) {
        this.data.ValueArray.splice(score, ori - score);
        return;
      }
      while (ori < score) {
        this.data.ValueArray.push({
          Value: this.data.ValueArray.length + 1,
          Text: "Nội dung",
        });
        ori = this.data.ValueArray.length;
      }
    },
    coverty() {
      const mota = this.data.Des.slice();
      this.data.Des = mota.replace(/[\n\r]/g, "<br/>");
    },
    focusable(e) {
      e.target.select();
    },
  },
  components: {
    toolbax,
    point,
    draggable
  },
  computed: {
    updateRate() {
      // vm.data.Des = `${this.data.Des.split("<br/>")[0]}<br/>1. ${this.data.ValueArray[0].Text} <br/>2. ${this.data.ValueArray[1].Text} <br/>3. ${this.data.ValueArray[2].Text} <br/>4. ${this.data.ValueArray[3].Text}<br/>5. ${this.data.ValueArray[4].Text}`
      return "";
    },
    dragOptions() {
      return {
        animation: 100,
        disabled: false,
        ghostClass: "ghost",
      };
    },
    viewMode: {
      get(){
        return this.$store.state.viewMode;
      },
    },
    // valueArray(){
    //   return `${this.data.ValueArray.map(val => `${val.Value}. ${val.Text}`).join("<br/>")}<br/><br/>`.replaceAll(",","")
    // }
  },
};
</script>
<style scoped>
.square {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 50px;
}
/*.hold {*/
/*  !* border: 2px solid rgba(128, 128, 128, 0.425); *!*/
/*  border: 1px solid gray;*/
/*}*/

.headbar:active {
  background-color: #f1f1f1;
}
.aa {
  color: white !important;
  background: #1a76d2 !important;
}
</style>
