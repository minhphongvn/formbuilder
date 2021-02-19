<template>
  <div>
    <v-toolbar
      align="right"
      class="primary pl-4 pr-2"
      style="position: fixed; width: 100%"
      height="50"
      dense
      absolute
      fixed
      flat
      dark
    >
      Danh sách mẫu
      <v-spacer></v-spacer>
      <v-btn
        class="mr-0"
        :class="loading ? '' : 'white'"
        :loading="loading"
        @click.stop="requestTemplates()"
        x-small
        fab
        icon
      >
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>
    <div
      v-if="loading"
      class="text-center text-subtitle-2"
      style="padding-top: 300px"
      color="grey"
      v-text="message"
    ></div>
    <div
      v-if="!loading && error"
      class="px-5 text-center text-subtitle-2 error--text"
      style="padding-top: 300px"
      v-text="message"
    ></div>
    <div v-show="!loading" style="padding-top: 45px">
      <v-list subheader two-line>
        <template v-for="template in sortedArray">
          <div :key="template.TemplateID">
            <v-list-item
            :class="`${
              selected == template.TemplateID ? 'orange lighten-4' : ''
            }`"
          >
            <v-list-item-content class="pointer">
              <v-list-item-title
                class="text-subtitle-2"
                @click.stop="viewForm(template.TemplateID)"
                >{{ template.TemplateID }}</v-list-item-title
              >
              <v-list-item-subtitle link
                class="text-decoration-underline text-caption mt-1 pa-0 px-0"
                v-text="
                  `${[template.NgayBatDau, template.NgayKetThuc]
                    .map((val) =>
                      moment(val.split('T')[0]).format('DD/MM/YYYY')
                    )
                    .join(' đến ')}`
                "
                @click="
                  setDatesReady(template.TemplateID, [
                    template.NgayBatDau,
                    template.NgayKetThuc,
                  ])
                " text
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                class="text-caption mt-1"
                v-text="$store.state.user['UserName']"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-show="template.DuocSuaJsondata" class="mx-0">
              <v-btn @click.stop="editTemplate(template)" icon>
                <v-icon color="orange">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action class="mx-0">
              <v-btn
                color="red lighten-2"
                dark
                @click.stop="
                  dialog = true;
                  templateDelete = template.TemplateID;
                "
                icon
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          </div>
        </template>
      </v-list>
    </div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline error--text"> Cảnh báo </v-card-title>

        <v-card-text> Mẫu sẽ bị xóa vĩnh viễn. Không thể phục hồi. Khuyến khích download mẫu dưới dạng JSON để có thể tái sử dụng. <v-btn @click="downloadJSON(templateDelete)" class="success" link x-small text>Download</v-btn></v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false" text> Trở về </v-btn>
          <v-btn color="error" @click="delTemplate(templateDelete)" text>
            Xóa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDates" max-width="400">
      <v-card>
        <v-card-title class="text-subtitle-1 px-5 py-2">
          Cập nhật thời gian khảo sát (tháng-ngày-năm)
        </v-card-title>
        <v-divider></v-divider>
        <v-form class="px-5 mt-4">
          <v-row class="mb-1" no-gutters>
            <v-col>
              <span class="text-subtitle-2">TemplateID:</span>
              <span class="ml-2 text-subtitle-2 success--text">{{dates.templateID}}</span>
            </v-col>
          </v-row>
          <v-row class="mt-1" dense no-gutters>
            <v-col cols="10" md="5">
              <div class="text-subtitle-2">Từ ngày:</div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="10" md="5">
              <div class="text-subtitle-2">Đến ngày:</div>
            </v-col>
          </v-row>
          <v-row class="mt-1" dense no-gutters>
            <v-col cols="10" md="5">
              <v-text-field
                v-model="dates.dates[0]"
                solo
                outlined
                dense
                flat
                hide-details
                tile
                placeholder="MM-dd-yyyy"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="10" md="5" align-self="right">
              <v-text-field
                v-model="dates.dates[1]"
                solo
                outlined
                dense
                flat
                hide-details
                placeholder="MM-dd-yyyy"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <pre v-if="dates.message != ''" :class="`py-2 text-caption px-3 mx-2 ${dates.error?'error--text':'success--text'}`" v-text="dates.message"
        ></pre>
        <v-card-actions>

          <v-spacer></v-spacer>
          <v-btn color="warning" :loading="dates.loading" @click="setDates()" text> Cập nhật </v-btn>
          <v-btn color="primary" @click="dialogDates = false" text>
            Trở về
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "drawer",
  props: {
    draw: Boolean,
  },
  data: function () {
    return {
      loading: false,
      error: false,
      message: "Đang tải...",
      dialog: false,
      dialogDates: false,
      templateDelete: "",
      dates: {
        message: "",
        error: false,
        loading: false,
        templateID: "",
        dates: [],
      },
      moment,
    };
  },
  methods: {
    setDatesReady: function (templateID, dates) {
      this.dates.message = ""
      this.dates.error = false
      this.dates.templateID = templateID;
      this.dates.dates = dates.map((val) => moment(val.split("T")[0]).format("MM-DD-YYYY"));
      this.dialogDates = true;
    },
    setDates: function () {
      // console.log(this.dates);
      this.fixedDates();
      this.dates.loading = true;
      this.dates.message = ""
      this.$store.dispatch("updateThoiGianKhaoSat",{templateID: this.dates.templateID,dates: this.dates.dates})
        .then(res => {
          this.dates.error = false;
          this.dates.loading = false;
          this.dates.message = res.data.data[0].message + `.Khảo sát hiện hành từ ${moment(this.dates.dates[0]).format("DD/MM/YYYY")} đến ${moment(this.dates.dates[1]).format("DD/MM/YYYY")}`;
          this.requestTemplates()
        }).catch(err => {
          setTimeout(() => {
            this.dates.error = true;
            this.dates.loading = false;
            this.dates.message =
`Đã xảy ra lỗi !
Vui lòng kiểm tra lại định dạng ngày (yêu cầu: MM-dd-yyyy).
${err}`;
          }, 500);
        });
    },
    fixedDates: function () {
      return this.dates.dates.sort(
        (a, b) => new moment(a).format("YYYYMMDD") - new moment(b).format("YYYYMMDD")
      );
    },
    viewForm: function (templateID) {
      window.open("https://qa.lhu.edu.vn/" + templateID + "/1", "_blank");
    },
    requestTemplates() {
      this.loading = true;
      this.message = "Đang tải...";
      this.$store.dispatch("getAllTemplates")
        .then(() => {
          this.loading = false;
          this.error = false;
        })
        .catch((err) => {
          setTimeout(() => {
            this.error = true;
            this.loading = false;
            this.message = "Đã xảy ra lỗi. " + err;
          }, 1000);
        });
    },
    editTemplate(template) {
      this.selected = template.TemplateID;
      this.$emit("pubTemplate", template.TemplateID);
      this.$store.commit(
        "setDates",
        [template.NgayBatDau, template.NgayKetThuc].map(
          (date) => date.split("T")[0]
        )
      );
    },
    async delTemplate(templateID) {
      const dele = this.$store.dispatch("deleteTemplate",templateID)
      await dele.then(() => {
        // console.log(templateID, res.data.data[0].message);
        // this.requestTemplates();
        this.$store.dispatch("getAllTemplates")
      });
      await dele.then(()=>{
        if (templateID == this.$store.state.template.templateID){
          this.$store.commit('setButton',false)
        }
      });
      this.dialog = false;
    },
    async downloadJSON(template) {
      let originalData = {}
      await this.$store.dispatch('getJsonDataByID',template).then(res=>{
        originalData = JSON.parse(res.data.data[0].JdataTemplate)
      });
      const a = await document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(originalData, null, 2)], {
          type: "application/json",
        })
      );
      a.setAttribute("download", originalData.Title + ".json");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  },
  created() {
    this.requestTemplates();
  },
  computed: {
    sortedArray: function () {
      return [...this.templates].sort(function (a, b) {
        return a.TemplateID.localeCompare(b.TemplateID);
      });
    },
    templates: {
      get () {
        return this.$store.state.templates
      },
      set (values) {
        this.$store.commit('getAllTemplates', values)
      }
    },
    selected: {
      get(){
        return this.$store.state.drawer.list.selected;
      },
      set(values) {
        this.$store.commit('setDrawerListSelected',values)
      }
    }
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
