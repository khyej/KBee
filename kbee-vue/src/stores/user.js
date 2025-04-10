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
            // 서버에서 가져온 정보 그대로 반영
            this.user = fetchedUser;
            this.isLoggedIn = true;

            // localStorage도 서버 정보로 덮어쓰기
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    // 사용자 정보 업데이트 (DB + localStorage)
    async updateUser(updatedData) {
      if (!updatedData.id) {
        throw new Error('updatedData에 id가 없습니다.');
      }

      try {
        const res = await axios.put(`/api/users/${updatedData.id}`, updatedData);
        this.user = res.data;

        // ✅ localStorage도 함께 업데이트
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error('유저 정보 업데이트 실패:', err);
        throw err;
      }
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
