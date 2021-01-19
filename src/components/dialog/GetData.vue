<template>
  <div id="getdata">
    <v-dialog scrollable v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab small dark v-bind="attrs" v-on="on" @click="getData" text>
          <v-icon>mdi-import</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-tabs right>
          <v-tab class="">Có sẵn</v-tab>
          <v-tab>Tải lên</v-tab>
          <v-tab-item :key="0">
            <v-container fluid>
              <v-text-field
                label="Nhập TemplateID"
                v-model="templateID"
                @input="getData"
                @keyup.enter="commitData"
                dense
                autofocus
              ></v-text-field>
              <div
                class="text-caption"
                :class="isAvalable ? 'success--text' : 'error--text'"
                v-text="message"
              ></div>
            </v-container>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-container fluid>
              <v-file-input
                label="Nhập template (*.json)"
                accept="application/json"
                prepend-icon="mdi-import"
                @change="importTemplates"
              >
              </v-file-input>
            </v-container>
          </v-tab-item>
        </v-tabs>

        <v-toolbar elevation="3" dense>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-0"
            text
            @click="commitData"
            color="primary"
            :ripple="false"
            elevation="0"
            >Nhập</v-btn
          >
          <v-btn
            color="error"
            class="mr-0"
            text
            @click="
              dialog = false;
              isCopy = false;
            "
          >
            đóng
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: "getdata",
  props: {
    change: Function
  },
  data: function () {
    return {
      isAvalable: false,
      dialog: false,
      isCopy: false,
      newData: null,
      isCorrectTemplateID: false,
      message: "",
      templateID: "",
    };
  },
  methods: {
    importTemplates(files) {
      if (files.length <= 0) {
        return false;
      }
      const fr = new FileReader();
      fr.onload = (e) => {
        const result = JSON.parse(e.target.result);
        this.newData = JSON.parse(JSON.stringify(result, null, 2));
      };
      fr.readAsText(files);
    },
    getData() {
      this.$axios
        .post("/Web_LoadJsonDataByTemplateID", {
          TemplateID: this.templateID,
        })
        .then((response) => {
          const result = response.data.data[0];
          this.message = result.message;
          if (!result.error) {
            this.newData = JSON.parse(result.JdataTemplate, null, 2);
            this.isAvalable = true;
          } else {
            this.isAvalable = false;
          }
        });
    },
    commitData() {
      if(this.newData != null) {
        this.$emit("update-data", this.newData);
        this.templateID = "";
      }
      this.dialog = false;
      // this.change()
    },
  },
};
</script>