<template>
  <div id="checkbox">
    <div :class="`${editable ? 'hold' : ''} ${dragging==false?'py-2':'py-0'}`" v-click-outside="()=>{editable = false;editing(false)}">
      <div v-if="editable" class="px-3">
        <v-text-field
          class="font-weight-bold mb-4"
          v-model="data.Text"
          placeholder="Câu hỏi"
          @focus="focusable"
          hide-details
        ></v-text-field>
        <draggable
            v-model="data.Option"
            element="span"
            :group="{ name: 'checkbox-question' }"
            handle=".checkbox"
            :ghost-class="ee"
            @sort="$store.commit('setQID')"
            v-bind="dragOptions"
        >
          <transition-group type="transition" class="py-0" group tag="div">
            <div class="white rounded" v-for="(item,i) in data.Option" @mouseover="hoverItem=i" :key="i">
              <v-text-field :class="`py-0 my-0 text-body-1 ${(curentItem == i)?'':'custom'} ${item.Question == undefined?'':'grey lighten-3'}`"
                            v-model="data.Option[i].Text"
                            v-on:click="curentItem = i; focusItem=i" :placeholder="`Tuỳ chọn ${i+1}`" :rules="[$store.state.required]"
                            @focus="focusable"
                            hide-details
                            :autofocus="i == focusItem"
                            @change="removeEmptyOption();removeChild()"
              ><template v-slot:prepend>
                <v-icon class="checkbox">mdi-drag-vertical</v-icon>
                <v-icon>mdi-checkbox-blank-outline</v-icon>
              </template>
                <template v-slot:append-outer>
                  <!--              v-if="i === data.Option.length - 1";:color="(added)?'primary':'grey'"-->
                  <v-btn
                      v-show="(i==curentItem||i==hoverItem)&&item.Question == undefined"
                      small
                      @click="
                      addChild(i);
                      $store.commit('setQID')
                      added = !added;
                      toggle = i;
                    "
                      color="grey darken-2"
                      icon
                      :key="i"
                  ><v-icon>mdi-plus</v-icon></v-btn>
                  <v-btn-toggle v-model="toggle" tile borderless background-color="transparent">
                    <v-btn
                        :ripple="false"
                        v-show="(item.Question != undefined)"
                        rounded
                        small
                        active-class="rad"
                        :value="i"
                        icon
                        :key="i"
                    ><v-icon>mdi-chevron-{{ (toggle == i)?'up':'down' }}</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn
                      small
                      color="grey darken-2"
                      v-if="data.Option.length > 1"
                      @click="
                  change();
                  data.Option.splice(i, 1);
                  curentItem = -1;
                  focusItem = -1;
                " icon
                  ><v-icon>mdi-close</v-icon></v-btn>
                </template>
              </v-text-field>
              <child-control v-show="toggle == i" :index="i" :data="item" :change="change"></child-control>
            </div>
          </transition-group>
        </draggable>
<!--        <div v-for="(item, i) in data.Option" @mouseover="hoverItem=i" :key="i">-->
<!--          <v-text-field :class="`py-0 my-0 text-body-1 ${(curentItem == i)?'':'custom'} ${item.Question == undefined?'':'grey lighten-3'}`"-->
<!--            prepend-icon="mdi-checkbox-blank-outline"-->
<!--            v-model="data.Option[i].Text" :placeholder="`Tuỳ chọn ${i+1}`" :rules="[$store.state.required]"-->
<!--            v-on:click="curentItem = i; focusItem=i"-->
<!--            @focus="focusable"-->
<!--            hide-details-->
<!--            :autofocus="i == focusItem"-->
<!--          >-->
<!--            <template slot="append-outer">-->
<!--              <v-btn-->
<!--                  v-show="(i==curentItem||i==hoverItem)&&item.Question == undefined"-->
<!--                small-->
<!--                @click="-->
<!--                  addChild(i);-->
<!--                  $store.commit('setQID');-->
<!--                  added = !added;-->
<!--                "-->
<!--                color="grey darken-2"-->
<!--                icon-->
<!--                :key="i"-->
<!--                ><v-icon>mdi-plus</v-icon></v-btn>-->
<!--              <v-btn-->
<!--                small-->
<!--                color="grey darken-2"-->
<!--                @click="-->
<!--                  change();-->
<!--                  data.Option.splice(i, 1);-->
<!--                  curentItem = -1;-->
<!--                  focusItem = -1;-->
<!--                " icon-->
<!--                ><v-icon>mdi-close</v-icon></v-btn-->
<!--              >-->
<!--            </template>-->
<!--          </v-text-field>-->
<!--          <child-control :index="i" :data="item" :change="change"></child-control>-->
<!--          <AddChild :index="i" :data="item" :change="change"></AddChild>-->
<!--        </div>-->
        <div>
          <v-text-field
              color="grey lighten-4 my-2"
              style="width: 150px"
              class="text-body-1 custom my-1 ml-6"
              prepend-icon="mdi-checkbox-blank-outline"
              v-on:click.stop="
                  data.Option.push({
                    QID: '',
                    Text: 'Tùy chọn ' + (data.Option.length + 1),
                  });
                  focusItem = data.Option.length-1;
                  curentItem = data.Option.length-1;
                  $store.commit('setQID');
                "
              dense
              hide-details
              placeholder="Thêm tuỳ chọn"
          />
        </div>
        <v-divider class="my-4"></v-divider>
        <v-flex class="mx-3 mt-4">
          <v-row>
            <v-col style="height: 40px" class="drag pa-0" cols="2">
<!--              <v-btn-->
<!--              elevation="0"-->
<!--              class="ma-0"-->
<!--              color="success"-->
<!--              width="70"-->
<!--                v-on:click="-->
<!--                  data.Option.push({-->
<!--                    QID: '',-->
<!--                    Text: 'Checkbox ' + (data.Option.length + 1),-->
<!--                  });-->
<!--                  $store.commit('setQID')-->
<!--                "-->
<!--                ><v-icon>mdi-plus-circle</v-icon></v-btn-->
<!--              >-->
            </v-col>
            <v-spacer></v-spacer>
            <toolbax
              :remove="remove"
              :change="change"
              @editable="editing(false); editable = $event; outside()"
            ></toolbax>
          </v-row>
        </v-flex>
      </div>

      <div v-if="!editable" @click="editable=true;editing(true)">
        <div v-if="dragging==false">
          <div class="text-start mb-1 font-weight-bold">{{ data.Text }}</div>
          <div v-for="(item, i) in data.Option" :key="i">
  <!--          <v-checkbox class="handle my-1 py-0" :label="item.Text" />-->
            <div class="mb-1"><v-icon>mdi-checkbox-blank-outline</v-icon><span class="ml-2" v-text="item.Text"></span></div>
          </div>
          <draggable
            v-model="data.Option"
            element="span"
            @sort="$store.commit('setQID')"
            :group="{ name: 'question' }"
            :sort="false"
            handle=".handle"
            v-bind="dragOptions"
          >
            <!-- <transition-group type="transition" class="py-0" group tag="div">
            <div v-for="(item,i) in data.Option" :key="i">
              <v-checkbox class="handle my-0 py-0" :label="item.Text" />
            </div>
          </transition-group> -->
          </draggable>
        </div>
        <div v-if="dragging" align="left">
          <v-flex class="grey lighten-3 rounded pa-2"><span class="mr-2"><v-icon>mdi-checkbox-marked</v-icon></span><span class="text-subtitle-2 mb-2" v-text="data.Text"></span></v-flex>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import AddChild from "./child/AddChild";
import toolbax from "./layout/bottom-toolbar";
import ChildControl from "@/components/child/child-control";

export default {
  name: "CheckBox",
  props: {
    change: Function,
    data: {
      GroupID: String,
      Text: String,
      Option: Array,
    },
    index: Number,
    dragging:{
      type: Boolean,
      default: false
    }
    // editable: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  data: function () {
    return {
      // editable: false,
      added: false,
      curentItem: -1,
      focusItem: -1,
      hoverItem: -1,
      editable: false,
      toggle: -1,
    };
  },
  methods: {
    outside(){
      this.hoverItem = -1;
      this.curentItem = -1;
      this.focusItem = -1;
    },
    removeEmptyOption(){
      if (this.data.Option.length <= 2){
        this.data.Option.map((value, index) => {
          if (value.Text.trim().length == 0){
            this.data.Option[index] = {
              ...this.data.Option[index],
              Text: "Tuỳ chọn " + (index + 1)
            }
          }
        })
        return
      }
      this.data.Option.map((value, index) => {
        if (value.Text.trim().length == 0) {
          this.toggle = -1
          this.data.Option.splice(index, 1)
          return
        }
      })

    },
    editing(value){
      this.removeChild();
      this.removeEmptyOption();
      this.$store.commit('setChinhSua',value)
    },
    remove() {
      this.$emit("remove", this.index);
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
                QID: "",
                Required: false,
                Type: "TextBox",
                Text: "Câu hỏi",
                Holder: "",
              }
            ],
          };
        }
        return option;
      });
      this.$store.commit('setQID')
    },
    removeChild() {
      this.data.Option.map((val) => {
        if (val.Question != undefined && val.Question.length == 0) {
          this.$delete(val, 'Question')
          this.$delete(val, 'Des')
        }
      });
    },
  },
  components: {
    ChildControl,
    draggable,
    // AddChild,
    toolbax,
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
