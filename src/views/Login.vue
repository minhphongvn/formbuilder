<script>
export default {
  name: "Login",
  methods: {
    setUser(){
      let token = this.$cookies.get('awt');
      let user = '';
      if (token != null && token !== "undefined"){
        this.$store.commit('setToken', token);
        user = this.$jwt.decode(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`);
        this.$store.commit('setUser',{user: user.id})
      }
    }
  },
  created() {
    this.setUser();
  }
}
</script>

<style scoped>

</style>
