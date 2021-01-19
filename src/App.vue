<template>
  <v-app>
    <v-navigation-drawer width="300" ref="navdrawer" v-model="drawer" fixed app>
      <navdrawer @pubTemplate="loadTemplateExist" />
    </v-navigation-drawer>
    <v-main>
      <MainForm
        v-if="!loading"
        :change="change"
        :dragging="dragging"
        :templates="templates"
      />
      <v-container v-if="loading" fluid fill-height>
        <v-layout justify-center align-center>
          <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-layout>
      </v-container>
      <div v-if="retry">
        <v-btn @click="loadTemplateExist(id)">Tải lại</v-btn>
      </div>

      <v-hover open-delay="0" v-slot:default="{ hover }">
        <v-snackbar
          v-model="snackbar.snackbar"
          :timeout="hover ? -1 : snackbar.timeout"
          :class="{ 'on-hover': hover }"
          elevation="24"
          bottom
          left
        >
          Đã thay đổi 1 mục
          <template v-slot:action="{ attrs }">
            <v-btn
              color="yellow"
              text
              v-bind="attrs"
              @click="
                undo();
                snackbar.snackbar = false;
              "
            >
              Hoàn tác
            </v-btn>
          </template>
        </v-snackbar>
      </v-hover>

      <!-- <div v-for="(item,i) in oldTemplates" :key="i">
          <div>{{ item }}</div>
        </div> -->
      <!-- <pre>{{ JSON.stringify(this.temp, null, 2) }}</pre> -->

      <v-btn
          v-tooltip.left="`${isDragging?'Tắt':'Bật'} sắp xếp`"
          v-if="$store.state.template.Part[0].Question.length > 1"
          style="bottom: 150px"
          class="mr-5"
          :class="isDragging?'primary':''"
          light
          fab
          fixed
          bottom
          right
          small
          :ripple="false"
          @click="isDragging = !isDragging"
      >
        <v-icon>mdi-sort</v-icon>
      </v-btn>
      <createTemplate
          class="mr-2"
      ></createTemplate>
    </v-main>
    <v-footer class="primary" fixed app dark>
      <div style="max-width: 50px" class="pointer">
        <v-app-bar-nav-icon dark @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
      </div>
      <div class="text-md-subtitle-1 pointer mr-5" @click.stop="drawer = !drawer" v-text="`Danh sách mẫu`"></div>
      <v-spacer></v-spacer>
      <v-divider vertical></v-divider>
      <bottombar
        :data="templates"
        :scroll="scrollToBottom"
        @dragging="dragging = $event"
      ></bottombar>
      <span v-tooltip.top="'Thêm phần'" dark class="pr-4 py-1"
            v-on:click="
          templates.Part.push({
            Name: 'TÊN PHẦN',
            Des: 'Mô tả',
            Question: [],
          });
          $store.commit('setQID');
          scrollToBottom();
        "
            :ripple="false"><v-icon >mdi-view-agenda-outline</v-icon>

      </span>
      <v-divider vertical></v-divider>
      <v-spacer></v-spacer>
<!--        <v-tooltip top>-->
<!--          <template v-slot:activator="{ on, attrs }">-->
<!--            <div v-bind="attrs" v-on="on" rounded>-->
<!--              <v-btn fab small icon @click="createNew">-->
<!--                <v-icon>mdi-file</v-icon>-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </template>-->
<!--          <span>Tạo mẫu mới</span>-->
<!--        </v-tooltip>-->
      <div v-tooltip.top="'Tạo mẫu mới'">
        <xacnhan title="Tạo mẫu mới" message="Hãy chắc chắn bạn đã lưu mẫu trước khi tạo mới !" :icon="true" src="mdi-file" @agree="createNew"></xacnhan>
      </div>
<!--      <v-tooltip top>-->
<!--        <template v-slot:activator="{ on, attrs }">-->
<!--          <div v-bind="attrs" v-on="on" rounded>-->
<!--            <createTemplate-->
<!--              class="mr-2"-->
<!--            ></createTemplate>-->
<!--          </div>-->
<!--        </template>-->
<!--        <span>Xuất bản</span>-->
<!--      </v-tooltip>-->
      <jsonviewer v-tooltip.top="'JSON'"
        class="mr-2"
        :nameTemplates="nameTemplates"
        :data="templates"
      ></jsonviewer>

      <v-btn v-tooltip.top="tooltip(`Xem: ${viewMode?'Bật':'Tắt'}`)" class="mr-2" :style="viewMode?'':'opacity: 0.5'" @click="$store.commit('setViewMode')" icon>
        <v-icon>
          mdi-eye
        </v-icon>
      </v-btn>
      <!-- <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" rounded>
            <getdata :change="change" @update-data="importTemplate"></getdata>
          </div>
        </template>
        <span>Nhập Template</span>
      </v-tooltip> -->
      <v-btn small fab icon><v-icon>mdi-account</v-icon></v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import jsonviewer from "./components/dialog/JsonViewer";
import createTemplate from "./components/dialog/CreateTemplate";
import bottombar from "./components/layout/bottom-navigation";
import MainForm from "./components/layout/MainForm";
import navdrawer from "./components/layout/nav-drawer";
import Xacnhan from "@/components/dialog/xacnhan";

export default {
  name: "App",
  data: function () {
    return {
      drawer: false,
      temp: [],
      items: ["Xóa phần"],
      snackbar: {
        hover: false,
        snackbar: false,
        text: "",
        timeout: 5000,
      },
      nameTemplates: "untitled",
      // templates: {
      //   templateID: "",
      //   logo_org:
      //     "https://lhu.edu.vn/ViewPage/LHUVN/_default/image/truong_dai_hoc_lac_hong_logo.png",
      //   name_org: "Trường Đại học Lạc Hồng",
      //   url_finishRedirect: "https://lhu.edu.vn/",
      //   Title: "TÊN PHIẾU KHẢO SÁT",
      //   Des: "Mô tả của phiếu khảo sát",
      //   url_login: "",
      //   url_template: "",
      //   Part: [
      //     {
      //       Name: "TÊN PHẦN",
      //       Des: "Mô tả phần",
      //       Question: [],
      //     },
      //   ],
      // },
      loadingBtn: false,
      oldTemplates: {},
      dragging: false,
      loading: false,
      retry: false,
      id: "",
      createUpdateBtn: -1
    };
  },
  methods: {
    tooltip(content){
      return {
        content: content
      }
    },
    createNew: function () {
      this.$store.commit('setDrawerListSelected',"")
      this.nameTemplates = "untitled";
      this.templates = JSON.stringify({
        templateID: "",
        logo_org:
            "https://lhu.edu.vn/ViewPage/LHUVN/_default/image/truong_dai_hoc_lac_hong_logo.png",
        name_org: "Trường Đại học Lạc Hồng",
        url_finishRedirect: "https://lhu.edu.vn/",
        Title: "TÊN PHIẾU KHẢO SÁT",
        Des: "Mô tả của phiếu khảo sát",
        url_login: "",
        url_template: "",
        Part: [
          {
            Name: "TÊN PHẦN",
            Des: "Mô tả phần",
            Question: [],
          },
        ],
      })
    },
    change() {
      this.oldTemplates = JSON.stringify({...this.templates});
      this.snackbar.snackbar = true;
      // this.templates.Part = JSON.parse(JSON.stringify(this.temp[this.temp.length - 1].model));
    },
    // undo() {
    //   const a = [...this.temp].reverse().findIndex((i) => i.visible);
    //   this.temp[this.temp.length - 1 - a].visible = false;
    //   this.templates.Part = JSON.parse(JSON.stringify(this.temp[this.temp.length - 1 - a].model));
    // },
    undo: function () {
      this.templates = this.oldTemplates;
      this.snackbar.snackbar = false;
    },
    scrollToBottom() {
      let element = document.getElementById("endpoint");
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    },

    // handleSort() {
    //   this.templates.Part.map((value, index) => {
    //     const partID = ++index * 10000000;
    //     value.Question.map((e, i) => {
    //       const key = partID + ++i * 10000;
    //
    //       if (e.Type === "MarkTable") {
    //         e.Topic.map((val, j) => {
    //           val.GroupID = key + ++j * 100;
    //           val.Question.map((ques, k) => {
    //             ques.QID = val.GroupID + ++k * 1;
    //           });
    //         });
    //         return;
    //       }
    //       if (e.Type === "Radio") {
    //         e.QID = key;
    //         e.Option.map((val) => {
    //           if (val.Question != undefined) {
    //             val.Question.map((ques, j) => {
    //               ques.QID = e.QID + ++j * 1;
    //             });
    //           }
    //         });
    //         return;
    //       }
    //       if (e.Type === "Checkbox") {
    //         e.GroupID = key;
    //         e.Option.map((val, j) => {
    //           val.QID = e.GroupID + ++j * 10;
    //           if (val.Question != undefined) {
    //             val.Question.map((ques, k) => {
    //               ques.QID = val.QID + ++k * 1;
    //             });
    //           }
    //         });
    //         return;
    //       }
    //       e.QID = key;
    //     });
    //   });
    // },
    loadTemplateExist(templateID){
      this.id = templateID;
      this.loading = true;
      this.retry = false;
      this.$store.commit('setButton',false)
      this.$store.dispatch('loadJsonDataByTemplateID', templateID).then(() => {
        this.loading = false;
        this.$store.dispatch('kiemtraTemplateID', templateID).then(res => {
          // console.log(res)
          if (res.data.data[0].error){
            this.$store.commit('setButton',true)
          }else{
            this.$store.commit('setButton',false)
          }
        })
      }).catch(()=>{
        this.loading = false;
        this.retry = true;
      })
    }
  },
  computed: {
    getdate() {
      return this.$store.state.dates
    },
    templates: {
      get(){
        return this.$store.state.template;
      },
      set(value){
        return this.$store.commit("setTemplate", value)
      }
    },
    viewMode: {
      get(){
        return this.$store.state.viewMode
      }
    },
    isDragging: {
      get(){
        return this.$store.state.dragging;
      },
      set(value){
        return this.$store.commit("setDragging", value)
      }
    }
  },
  components: {
    Xacnhan,
    MainForm,
    jsonviewer,
    createTemplate,
    bottombar,
    // getdata,
    navdrawer,
  },
};
</script>

<style>
/* ::-webkit-scrollbar {
  width: 10px;
} */

.ghost {
  padding: 0.5rem 1rem;
  border: 2px solid #1e88e5;
  background: rgba(0, 128, 179, 0.274);
  text-align: center;
}

.ghost::before {
  color: #1e88e5;
  opacity: 0.7;
  content: "Thả ở đây !";
}

.pointer{
  cursor: pointer;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #0d47a1;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #05357c;
}

.grab {
  cursor: -webkit-grab;
  cursor: grab;
}
.hold {
  background-color: white;
  border: 1px solid gray;
  border-radius: 8px;
}

body {
  font-size: 17px;
}

@media only screen and (max-width: 1024px) {
  .float {
    left: calc(100% / 2 - 390px);
  }

  .containor {
    height: 1000px;
  }
}

@media only screen and (max-width: 720px) {
  .float {
    display: none;
  }
  .show {
    display: block !important;
  }
  .hidden {
    display: none !important;
  }
}

.custom.v-text-field>.v-input__control>.v-input__slot:before {
  border: none;
}
.custom.v-text-field>.v-input__control>.v-input__slot:after {
  border: none;
}
.custom.v-text-field>.v-input__control:hover {
  border-bottom: 1px solid #d3d9df;
}
/*.custom.v-text-field:before>.v-input__control:hover {*/
/*  border-bottom: 1px solid #d3d9df;*/
/*}*/
.aa {
  color: white !important;
  background: #1a76d2 !important;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

/*tooltipzone*/

.tooltip .tooltip-inner {
  background: #00000077;
  color: white;
  border-radius: 3px;
  padding: 5px 10px 5px;
  font-size: 14px;
  font-family: Arial
}

.tooltip .tooltip-arrow {
  display: none;
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 10px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 10px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>

<style lang="scss">
@import url("https://fonts.googleapis.com/css? family=Oxygen:300,400,700&display=swap");
@import url("https://fonts.googleapis.com/css? family=Comfortaa&display=swap");

$body-font-family: "Arial";
$title-font: "Arial";
$snackbar-top: 50;
.v-application {
  font-family: $body-font-family, sans-serif !important;
  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
}
</style>
