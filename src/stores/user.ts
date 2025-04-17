import { defineStore } from "pinia";
import { DoAxiosWithErro } from "@/api";

// 定义用户信息类型（根据实际接口返回结构调整）
interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: number;
  token?: string;
}

// Store 定义
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') as UserInfo | null,
    userToken: localStorage.getItem('userToken') || '',
    isLoggedIn: !!localStorage.getItem('userToken')
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.userToken,
    userName: (state): string => state.userInfo?.username || 'Guest'
  },

  actions: {
    async login(userData: { username: string; password: string }) {
      try {
        const res = await DoAxiosWithErro('/api/auth/login', 'post', userData, false);
        const info: UserInfo = res.data;

        this.userToken = info.token!;
        this.userInfo = info;
        this.isLoggedIn = true;

        // 持久化
        localStorage.setItem('userToken', this.userToken);
        localStorage.setItem('userInfo', JSON.stringify(info));
      } catch (err) {
        this.logout(); // 失败时清空状态
        throw err;
      }
    },

    async logout() {
      try {
        await DoAxiosWithErro('/api/users/logout', 'post', {}, true);
      } catch (err) {
        // 可忽略登出接口错误（如 token 失效）
      }
      this.userInfo = null;
      this.userToken = '';
      this.isLoggedIn = false;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
    }
  }
});
