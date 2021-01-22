<!--<template>-->
<!--  <div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import jwt from 'jsonwebtoken'-->
<!--export default {-->
<!--  name: "hoho",-->
<!--  methods:{-->
<!--    setUser: function () {-->
<!--      let token = 'eyJ1aWQiOiIxMTgwMDAxNDgiLCJzaWQiOiI4QUQxODQ2RTg0MUNEMEU3IiwiZXhwIjoyMDgzODU4NTYwfQ.VXuyHaEY0alAcxh1CM0etjeAP3LRLu7wYY3JpwB7BFM' //this.$cookies.get('awt');-->
<!--      let user='';-->
<!--      if (token != null && token !== "undefined") {-->

<!--        this.$store.commit('setToken',token);-->

<!--        // localStorageMemory.setItem('sllToken', token);-->
<!--        user = jwt.decode(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`);-->
<!--        this.$store.commit('setUser', { token: token, user: user.uid });-->
<!--        console.log(this.$store.state.user)-->
<!--      }-->
<!--      else {-->
<!--        window.location = 'https://app.lhu.edu.vn/?ur=https://qa.lhu.edu.vn';-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--  created() {-->
<!--    this.setUser();-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
