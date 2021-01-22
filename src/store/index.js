import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";
import api from '../api';
import jwt from 'jsonwebtoken';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: "",
    user: {},
    useless: true,
    dates: [moment().format("YYYY-MM-DD"), moment().add(10, "days").format("YYYY-MM-DD")],
    template: {
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
    },
    drawer: {
      list: {
        selected: ""
      }
    },
    form: {
      valid: false
    },
    templates: [],
    viewMode: true,
    dangChinhSua: false,
    button:{
      createUpdate: false
    },
    dragging: false,
    moveControl: false,
    required: value => !!value || 'Bắt buộc nhập !',
    draggle: true
  },
  mutations: {
    setUser: function (state, payload){
      state.user = {
        ...state.user,
        ...payload
      }
    },
    setAuth: function(state,token){
      let user = '';
      if (token != null && token !== "undefined"){
        user = jwt.decode(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`);
        this.commit('setUser',user.uid)
      }
      state.accessToken = token;
    },
    setDraggle: function (state,payload){
      state.draggle = payload
    },
    setDragging: function (state,payload){
      state.dragging = payload
    },
    setButton: function (state,payload){
      state.button.createUpdate = payload
    },
    setChinhSua: function(state, status){
      state.dangChinhSua = status
    },
    setDates: function (state, dates) {
      state.dates = dates;
    },
    setTemplates: (state, templates) => state.templates = templates,
    setTemplate: (state, template) => state.template = JSON.parse(template),
    setDrawerListSelected: (state, itemKey) => state.drawer.list.selected = itemKey,
    setQID: function(state){
      state.template.Part.map((value, index) => {
        const partID = ++index * 10000000;
        value.Question.map((e, i) => {
          const key = partID + ++i * 10000;

          if (e.Type === "MarkTable") {
            e.Topic.map((val, j) => {
              val.GroupID = key + ++j * 100;
              val.Question.map((ques, k) => {
                ques.QID = val.GroupID + ++k * 1;
              });
            });
            return;
          }
          if (e.Type === "Radio") {
            e.QID = key;
            e.Option.map((val,k) => {
              if (val.Question != undefined) {
                val.Question.map((ques, j) => {
                  ques.QID = e.QID + k*100 + ++j;
                });
              }
            });
            return;
          }
          if (e.Type === "Checkbox") {
            e.GroupID = key;
            e.Option.map((val, j) => {
              val.QID = e.GroupID + ++j * 100;
              if (val.Question != undefined) {
                val.Question.map((ques, k) => {
                  ques.QID = val.QID + ++k;
                });
              }
            });
            return;
          }
          e.QID = key;
        });
      });
    },
    setViewMode: state => state.viewMode = !state.viewMode
  },
  actions: {
    getUserInfo: async function ({commit}){
      const user = api.get("https://tapi.lhu.edu.vn/me/obj/UserInfo/");
      await user.then(res => commit('setUser', res.data.data)).catch(err => console.log(err))
    },
    getAllTemplates: async function ({commit}) {
      const data = api.get("/Web_SelectTemplate");
      await data.then(res => commit('setTemplates',res.data.data)).catch(err => console.log(err))
      return data
    },
    createTemplate: function ({state}){
      const create = api.post("/Web_TemplateUpdate", {
        TemplateID: state.template.templateID,
        TenKhaoSat: state.template.Title,
        jsonDataNew: JSON.stringify(state.template),
        NgayBD: moment(state.dates[0]).format("MM-DD-YYYY"),
        NgayKT: state.dates.length > 1 ? moment(state.dates[1]).format("MM-DD-YYYY"):moment(state.dates[0]).add(10, "days").format("MM-DD-YYYY"),
      });
      return create;
    },
    kiemtraTemplateID: async function ({state}) {
      const idd = await api.post("/Web_KiemTraTemplateID", {
        TemplateID: state.template.templateID,
      });
      return idd;
    },
    deleteTemplate: async function({state},templateID){
      state.useless = true
      const del = api.post("/Web_TemplateDelete", {
        TemplateID: templateID,
      })
      return del;
    },
    updateThoiGianKhaoSat: function ({state},obj) {
      state.useless=true
      const thoigianks = api.post("/Web_TemplateUpdateThoiGianKhaoSat", {
        TemplateID: obj.templateID,
        NgayBD: moment(obj.dates[0]).format("MM-DD-YYYY"),
        NgayKT: obj.dates.length > 1 ? moment(obj.dates[1]).format("MM-DD-YYYY")
            : moment(obj.dates[0])
                .add(10, "days")
                .format("MM-DD-YYYY"),
      });
      return thoigianks;
    },
    loadJsonDataByTemplateID: function ({commit}, templateID){
      const data = api.post("/Web_LoadJsonDataByTemplateID",{
        TemplateID: templateID
      });
      data.then(async res => {
        await commit('setTemplate', res.data.data[0].JdataTemplate);
        await commit('setQID');
      }).catch(err => {
        console.log(err);
      })
      return data;
    },
    getJsonDataByID: function ({state}, templateID){
      state.useless = true
      const data = api.post("/Web_LoadJsonDataByTemplateID",{
        TemplateID: templateID
      });
      return data;
    },
  },
  modules: {
  }
})
