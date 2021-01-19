<template>
  <div id="jsonviewer">
    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab small dark v-bind="attrs" v-on="on" @click="getdata" text>
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
      <v-card v-click-outside="onClickOutside" align="center">
        <v-tabs dark right>
          <v-toolbar dark dense color="blue darken-4">
            <v-btn icon dark @click="dialog = false">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
            <!-- <v-toolbar-title>Preview</v-toolbar-title> -->
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-tab class="">TRỰC QUAN</v-tab>
              <v-tab>JSON</v-tab>
            </v-toolbar-items>
          </v-toolbar>

          <v-tab-item :key="0">
            <v-container class="main">
              <v-card elevation="0" width="640" align="start">
                <v-img :src="data.logo_org" height="92" contain></v-img>
                <div class="header-title" align="center">
                  {{ data.name_org }}
                </div>
                <div
                  class="text-h5 text-uppercase pb-3 py-3 font-weight-bold"
                  style="color: #17a2b8 !important"
                  v-text="data.Title"
                  align="center"
                ></div>
                <div class="pb-3 py-3" v-html="data.Des"></div>
                <div v-for="(part, p) in data.Part" :key="p">
                  <div class="alert-primary pb-2 py-2 text-center">
                    {{ part.Name }}
                  </div>
                  <div v-for="(ques, q) in part.Question" :key="q">
                    <div class="pb-2 py-2">
                      <!-- {{ ques.Type }} -->
                      <component
                        v-bind:is="ques.Type"
                        :data="ques"
                        :key="q"
                      ></component>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-container class="pa-0">
              <v-card
                elevation="0"
                scrollable
                v-click-outside="onClickOutside"
                width="900"
                height="450 "
                align="start"
              >
                <v-col class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="isCopy ? 'success' : 'grey darken-1'"
                    class="mr-3"
                    text
                    small
                    @click="copyJson"
                  >
                    {{ isCopy ? "" : "copy" }}
                    <v-icon v-if="isCopy">mdi-check</v-icon>
                  </v-btn>
                  <v-btn color="grey darken-1" small text @click="export2txt">
                    Tải xuống
                  </v-btn>
                  <xacnhan
                    :disabled="saveState"
                    btnContent="Lưu"
                    title="Xác nhận thay đổi"
                    message="Sau khi lưu, mẫu khảo sát sẽ bị thay đổi !"
                    @agree="respond"
                  ></xacnhan>
                </v-col>
                <vue-json-editor
                  v-model="json"
                  :show-btns="false"
                  :expandedOnStart="true"
                  mode="code"
                  @json-change="onJsonChange" 
                ></vue-json-editor>
                <!-- <v-card-text>
                  <pre class="mt-1">{{ listString }}</pre>
                </v-card-text> -->
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
import Checkbox from "../preview/checkbox";
import TextBox from "../preview/textbox";
import Radio from "../preview/radio";
import TextArea from "../preview/textarea";
import MarkTable from "../preview/marktable";
import xacnhan from "../dialog/xacnhan";

export default {
  name: "jsonviewer",
  props: {
    data: Object,
    nameTemplates: String,
  },
  data: function () {
    return {
      json: {},
      dialog: false,
      isCopy: false,
      editJson: false,
      saveState: true
    };
  },
  methods: {
    getdata() {
      this.json = this.data;
    },
    export2txt() {
      const originalData = this.json;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(originalData, null, 2)], {
          type: "application/json",
        })
      );
      a.setAttribute("download", this.nameTemplates + ".json");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onClickOutside() {
      this.isCopy = false;
    },
    copyJson() {
      navigator.clipboard.writeText(JSON.stringify(this.json, null, 2));
      this.isCopy = true;
    },
    changeData() {
      this.saveState = true;
      
      if (this.json != null) {
        this.$emit("update-data", this.json);
      }
      this.dialog = false;
      this.getdata();
    },
    respond() {
      this.changeData();
    },
    // isChanged() {
    //   this.saveState = JSON.stringify(this.json) === JSON.stringify(this.data);
    // },
    onJsonChange() {
      this.saveState = false;
    }
  },
  computed: {
    listString() {
      return JSON.stringify(this.json, null, 2);
    },
  },
  components: {
    vueJsonEditor,
    TextBox,
    Checkbox,
    Radio,
    TextArea,
    MarkTable,
    xacnhan,
  },
};
</script>

<style>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.main {
  margin: auto;
  width: 640px;
}
.header-title {
  font-size: 1.8em;
  color: #0277bd;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 2.5em;
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
.disabled {
  pointer-events: none;
}
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 6em;
  z-index: 2;
}

.jsoneditor-vue {
  height: 500px;
}
</style>