import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    modelUploadList: [
      {
        fileName: "demo.pdf",
        filePath: "a0ec4b03d9024d1096d2bd302a8e98a4/modelFile/2f0249f9412b4aa28dadcf612dabf2dd.pdf",
        fileSize: 340,
        fileType: "PDF"
      }
    ]
  },
  mutations: {},
  actions: {},
  modules: {}
});
