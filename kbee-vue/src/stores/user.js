import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isLoggedIn: false,
    }),
    actions: {
        async fetchUser() {
            const res = await axios.get('/api/users');
            this.user = res.data;
        },
        async updateUser(updatedData) {
            const res = await axios.put('/api/users', updatedData);
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
