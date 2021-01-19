setAuthorizationHeader: (token)=>{
    },
    setUser: function () {
      var token = this.$cookies.get('awt');
      var user='';
      
      if (token != null && token !== "undefined") {
        
        setAuthorizationHeader(token);
      
        localStorageMemory.setItem('sllToken', token);
        user = jwt.decode(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`);
        // this.$store.dispatch('setUser', { token: token, user: user.uid });
      }
      else {
        window.location = 'https://app.lhu.edu.vn/?ur=https://qa.lhu.edu.vn';
      }
    },