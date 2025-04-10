import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    // 모든 사용자 데이터를 가져오고, 로그인한 사용자만 필터링
    async fetchUser() {
      try {
        const res = await axios.get('/api/users');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const loggedInUserId = storedUser?.id;
        if (loggedInUserId) {
          const fetchedUser = res.data.find(
            (user) => user.id === loggedInUserId
          );
          if (fetchedUser) {
            // localStorage에서 보완해 병합
            this.user = {
              ...fetchedUser,
              profileImage: storedUser?.profileImage,
            };
            this.isLoggedIn = true;
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async updateUser(updatedData) {
      if (!updatedData.id) {
        throw new Error('updatedData에 id가 없습니다.');
      }
      const res = await axios.put(`/api/users/${updatedData.id}`, updatedData);
      this.user = res.data;
    },
    login(user) {
      this.user = user;
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('user');
    },
    restoreUser() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
      }
    },
  },
});
