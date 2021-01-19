<template>
  <div id="jsonviewer">
    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog"
      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab small dark v-bind="attrs" v-on="on" @click="getdata" text>
          <v-icon>mdi-code-json</v-icon>
        </v-btn>
      </template>
      <v-card v-click-outside="onClickOutside" align="center">
        <v-toolbar elevation="0" color="primary" dark dense tile height="30">
          <!-- <v-toolbar-title>Preview</v-toolbar-title> -->
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              text
              small
              @click="copyJson"
            >
              copy
            </v-btn>
            <v-btn small text @click="downloadJSON(data.templateID)">
              Tải xuống
            </v-btn>
            <xacnhan
              :disabled="saveState"
              src="Lưu"
              title="Xác nhận thay đổi"
              message="Sau khi lưu, mẫu khảo sát sẽ bị thay đổi !"
              small
              @agree="changeData"
            ></xacnhan>
            <v-btn color="error" @click="dialog = false" tile small>
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div>
          <v-card
            elevation="0"
            scrollable
            v-click-outside="onClickOutside"
            align="start"
          >
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
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
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
      saveState: true,
    };
  },
  methods: {
    getdata() {
      this.json = this.data;
    },
    downloadJSON() {
      const originalData = this.json;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(originalData, null, 2)], {
          type: "application/json",
        })
      );
      a.setAttribute("download", this.data.Title + ".json");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // async downloadJSON(templateID) {
    //   alert(templateID)
    //   let originalData = {}
    //   await this.$store.dispatch('getJsonDataByID',templateID).then(res=>{
    //     originalData = JSON.parse(res.data.data[0].JdataTemplate)
    //   });
    //   const a = await document.createElement("a");
    //   a.href = URL.createObjectURL(
    //       new Blob([JSON.stringify(originalData, null, 2)], {
    //         type: "application/json",
    //       })
    //   );
    //   a.setAttribute("download", originalData.Title + ".json");
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // },
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
        this.$store.commit('setTemplate', JSON.stringify(this.json));
      }
      this.dialog = false;
      this.getdata();
    },
    // isChanged() {
    //   this.saveState = JSON.stringify(this.json) === JSON.stringify(this.data);
    // },
    onJsonChange() {
      this.saveState = false;
    },
  },
  computed: {
    listString() {
      return JSON.stringify(this.json, null, 2);
    },
  },
  components: {
    vueJsonEditor,
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

.v-toolbar__content, .v-toolbar__extension{
  padding: 0px!important;
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
