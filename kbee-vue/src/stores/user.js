import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      const res = await axios.get('http://localhost:3001/user');
      this.user = res.data;
    },
    async updateUser(updatedData) {
      const res = await axios.put('http://localhost:3001/user', updatedData);
      this.user = res.data;
    },
  },
});
