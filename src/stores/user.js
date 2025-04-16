import { defineStore } from "pinia";
import { DoAxiosWithErro } from "@/api";
export const useUserStore =  defineStore('user',{
    state:() => ({
        userInfo:JSON.parse(localStorage.getItem('useInfo')) || {},
        userToken: localStorage.getItem('userToken') || '',
        isLoggedIn:false
    }),
    getters: {
        isAuthenticated: (state) => !!state.userInfo,
        userName: (state) => (state.userInfo ? state.userInfo.username : 'Guest')
      },
    
      // 3. 定义 actions
      actions: {
        async login(userData) {
              let Info = {};
              await DoAxiosWithErro('/api/auth/login','post',userData,false).then(data => {
                Info = data.data;
                this.userToken = data.data.token;
                localStorage.setItem('userToken', this.userToken);
                this.userInfo = Info;
                const infoJSON = JSON.stringify(Info);
                localStorage.setItem('useInfo',infoJSON);
                this.isLoggedIn = true; 
              }
              );
              
        },
        async logout() {
          this.userInfo = null;
          await DoAxiosWithErro('/api/users/logout','post',{},true);
          localStorage.removeItem('userToken');
          localStorage.removeItem('useInfo');
          this.isLoggedIn = false;
        }
      }
})