<template>
  <div id="formtitle">
    <v-card flat class="px-3">
      <div
        class="my-2 py-2 px-3"
        :class="editable ? 'hold' : ''"
        v-if="editable"
        v-click-outside="()=>{editable = false}"
      >
        <v-img :src="data.logo_org" height="92" contain></v-img>
        <!-- <v-text-field
          label="templateID"
          v-model="data.templateID"
          @change="requestTemplateID"
          @input="requestTemplateID"
          :color="
            isCorrectTemplateID
              ? data.templateID.indexOf(' ') >= 0
                ? 'error'
                : 'success'
              : 'error'
          "
          :suffix="
            data.templateID.length == ''
              ? 'Không được để trống'
              : isCorrectTemplateID
              ? data.templateID.indexOf(' ') >= 0
                ? 'Không chứa khoảng trắng'
                : 'ID hợp lệ'
              : 'ID đã tồn tại'
          "
          dense
          autofocus
        ></v-text-field> -->
        <v-textarea
          class="mt-5"
          label="Link Logo"
          v-model="data.logo_org"
          auto-grow
          rows="1"
          v-on:keyup.enter="switchVal"
          dense
        ></v-textarea>
        <v-text-field
          label="url_login"
          v-model="data.url_login"
          v-on:keyup.enter="switchVal"
          dense
        ></v-text-field>
        <v-text-field
          label="url_template"
          v-model="data.url_template"
          v-on:keyup.enter="switchVal"
          dense
        ></v-text-field>
        <v-text-field
          label="url_finishRedirect"
          v-model="data.url_finishRedirect"
          v-on:keyup.enter="switchVal"
          dense
        ></v-text-field>
        <v-text-field
          label="name_org"
          v-model="data.name_org"
          v-on:keyup.enter="switchVal"
          dense
        ></v-text-field>
        <v-text-field
          label="Title"
          v-model="data.Title"
          v-on:keyup.enter="switchVal"
          dense
        ></v-text-field>
        <v-textarea label="Mô tả" auto-grow v-model="data.Des" rows="1"></v-textarea>
<!--        <v-flex class="mx-3 mt-3">-->
<!--          <v-row>-->
<!--            <v-col style="height: 40px" class="drag pa-0" cols="2"></v-col>-->
<!--            <v-spacer></v-spacer>-->
<!--            <toolbax-->
<!--              :delShow="false"-->
<!--              @editable="coverty();editable = $event;"-->
<!--            ></toolbax>-->
<!--          </v-row>-->
<!--        </v-flex>-->
      </div>
      <div
        v-if="!editable"
        v-on:click="
          switchVal();
        "
      >
        <v-img :src="data.logo_org" height="92" contain></v-img>
        <div class="header-title" align="center">
          {{ data.name_org }}
        </div>
        <div
          class="text-uppercase mb-2 mt-1 pb-3 font-weight-bold"
          style="color: #17a2b8 !important; font-size: 24px !important"
          v-text="data.Title"
          align="center"
        ></div>
        <div class="pb-0 py-0" v-html="data.Des"></div>
      </div>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "formtitle",
  props: {
    data: {
      name_org: String,
      templateID: String,
      Title: String,
      Des: String,
    },
    editable: {
      type: Boolean,
      default: false,
    }
  },

  data: function () {
    return {
      // editable: false,
      isCorrectTemplateID: false,
    };
  },
  methods: {
    coverty() {
      const mota = this.data.Des;
      this.data.Des = mota.replace(/[\n\r]/g, "<br/>");
    },
    switchVal() {
      this.editable = !this.editable;
    },
    // requestTemplateID() {
    //   this.$store.dispatch('kiemtraTemplateID')
    //     .then((response) => {
    //       if (response.data.data[0].error) {
    //         this.isCorrectTemplateID = false;
    //       } else {
    //         if (this.data.templateID == "") {
    //           this.isCorrectTemplateID = false;
    //           return;
    //         }
    //         this.isCorrectTemplateID = true;
    //       }
    //     });
    // },
  },
};
</script>
<style>
.header-title {
  font-size: 28.9px !important;
  color: #0277bd;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 2.5em;
}
</style>