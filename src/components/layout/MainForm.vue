<template>
  <div class="containor">
    <v-row class="my-1" justify="center" no-gutters>
      <v-col style="max-width: 640px !important" tile>
        <v-card
          elevation="0"
          class="py-2 mt-1 transparent"
          style="margin-bottom: 150px"
        >
          <div class="mx-0">
            <formtitle :data="templates"></formtitle>

            <draggable
              v-model="templates.Part"
              element="span"
              v-bind="dragOptions"
              @sort="$store.commit('setQID')"
              :group="{ name: 'part' }"
              :sort="true"
              handle=".dragbar"
            >
              <v-card
                class="px-3 mt-2"
                flat
                v-for="(element, i) in templates.Part"
                :key="i"
              >
                <div @click="editing ? (edititem = i) : ''">
                  <session
                    :data="element"
                    :change="change"
                    :index="i"
                    :editable="edititem == i"
                    @remove="removeSession"
                    @isEditting="
                      editing = $event;
                      edititem = -1;
                    "
                    :draggle="dragging"
                  ></session>
                </div>
              </v-card>
            </draggable>
          </div>
        </v-card>
        <div id="endpoint" style="max-height: 1px"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import session from "../Session";
import formtitle from "../Formtitle";
export default {
  name: "main",
  props: {
    templates: Object,
    change: Function,
    dragging: Boolean,
  },
  data: function () {
    return {
      editing: false,
      edititem: -1,
      // dragging: false,
    };
  },
  methods: {
    removeSession(i) {
      console.log(i);
      this.change();
      this.templates.Part.splice(i, 1);
    },
  },
  components: {
    draggable,
    session,
    formtitle,
  },
  computed: {
    dragOptions() {
      return {
        animation: 100,
        disabled: false,
        ghostClass: "ghost",
      };
    },
    listString() {
      return JSON.stringify(this.templates, null, 2);
    },
  },
};
</script>

<style>
</style>