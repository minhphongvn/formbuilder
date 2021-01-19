<template>
  <div id="precommit">
    <v-dialog scrollable v-model="dialog" width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            v-tooltip.left="`${($store.state.button.createUpdate == 0 && $store.state.template.templateID != '')?'Tải lên':$store.state.button.createUpdate == 1?'Cập nhât':'Tải lên'}`"
            class="mb-15 mr-3"
            v-bind:color="`${($store.state.button.createUpdate == 0 && $store.state.template.templateID != '')?'green':$store.state.button.createUpdate == 1?'warning':'primary'}`"
            dark
            fab
            fixed
            bottom
            right
          v-bind="attrs"
          v-on="on"
          @click="requestTemplateID"
        >
          <v-icon>mdi-upload</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div>
          <div class="mx-2 mt-2" align="center">
            <v-date-picker
              width="100%"
              locale="vi-VN"
              color="primary"
              header-color="primary"
              v-model="dates"
              :show-current="true"
              @input="fixedDates"
              @change="fixedDates"
              @click="fixedDates"
              range
            ></v-date-picker>
          </div>
          <div class="mx-3 mb-1">
            Mẫu sẽ hiện hành từ
            <b>{{ moment(dates[0]).format("DD/MM/YYYY") }}</b> đến
            <b>{{ dates.length > 1?moment(dates[1]).format("DD/MM/YYYY"):moment(dates[0]).add(10, "days").format("DD/MM/YYYY") }}</b>
          </div>
        </div>
        <div>
          <v-text-field
          class="pa-1"
            label="templateID"
            v-model="template.templateID"
            @change="requestTemplateID"
            @input="requestTemplateID"
            flat
            outlined
            dense
            solo
            hide-details
          ></v-text-field>
        </div>
        <div
          :class="`py-2 text-caption px-3 mx-1 white--text ${block.background} rounded`" v-text="`${block.text}`"
        >
        </div>
        <div>
          <v-toolbar class="text-right py-1" tile dense>
            <v-btn class="text-subtitle-2 mr-1" :disabled="!btns.viewBtn.status" :color="btns.viewBtn.color" v-text="`${btns.viewBtn.text}`" @click="viewBtn" text></v-btn>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-2 mr-1" :disabled="!btns.createBtn.status" :color="btns.createBtn.color" v-text="`${btns.createBtn.text}`" @click="createBtn" text></v-btn>
            <v-btn class="text-subtitle-2" :color="btns.backBtn.color" v-text="`${btns.backBtn.text}`" @click="backBtn" text></v-btn>
          </v-toolbar>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "precommit",
  props: {
    nameTemplates: String,
  },
  data: function () {
    return {
      // dates: [

      // ],
      dialog: false,
      block: {
        color: 'white',
        background: 'white',
        text: ''
      },
      btns: {
        viewBtn: {
          status: false,
          color: 'purple',
          text: 'Xem'
        },
        createBtn: {
          status: false,
          color: 'success',
          text: 'Tạo'
        },
        backBtn: {
          status: true,
          color: 'primary',
          text: 'Trở về'
        }
      },
      moment,
    };
  },
  methods: {
    fixedDates: function () {
      this.requestTemplateID();
      return this.dates.sort(
        (a, b) => new moment(a).format("YYYYMMDD") - new moment(b).format("YYYYMMDD")
      );
    },
    requestTemplateID() {
      if(this.template.templateID.length == 0 || this.template.templateID.indexOf(' ') >= 0){
        this.block.background = 'error';
        this.btns.createBtn.status = false;
        this.btns.viewBtn.status = false;
        this.$store.commit('setButton',-1)
        this.block.text = 'TemplateID không hợp lệ (không được chứa khoảng trắng hoặc để trống)';
        return
      }else{
        this.$store.dispatch('kiemtraTemplateID').then((res)=>{
            this.btns.createBtn.status = true;
            this.btns.viewBtn.status = false;
            if(res.data.data[0].error){
              //insert
              this.btns.createBtn.text = 'Cập nhật';
              this.btns.createBtn.color = 'warning';
              this.block.background = 'warning';
              this.btns.viewBtn.status = true;
              this.$store.commit('setButton',true)
              this.block.text = res.data.data[0].message + ', cập nhật mẫu ?';
            }else{
              //create
              this.btns.createBtn.text = 'Tạo';
              this.btns.createBtn.color = 'success';
              this.block.background = 'success';
              this.$store.commit('setButton',false)
              this.block.text = res.data.data[0].message + ', tạo mẫu mới ?';
            }
          })
      }
    },
    //btn actions
    backBtn: function (){
      this.dialog = false;
    },
    createBtn: function (){
      this.$store.dispatch("createTemplate")
      .then((response) => {
        this.message = response.data.data[0].message;
        this.btns.createBtn.status = false;
        this.btns.viewBtn.status = true;
        this.$store.commit('setButton',true)
        this.$store.dispatch('getAllTemplates').then(()=>{
          this.$root.$refs.navdrawer.requestTemplates()
        });
        this.$store.state.drawer.list.selected = this.$store.state.template.templateID;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    viewBtn: function(){
      window.open(
        "https://qa.lhu.edu.vn/" + this.template.templateID + "/1",
        "_blank"
      );
    }
  },
  computed: {
    dates: {
      get () {
        return this.$store.state.dates
      },
      set (value) {
        this.$store.commit('setDates', value)
      }
    },
    template:{
      get(){
        return this.$store.state.template;
      },
      set(value){
        this.$store.commit('setTemplate',value)
      }
    }
  }
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
</style>
