import {defineStore} from "pinia";
import {api} from "~/api/index.js";
import { useCookie} from "#app";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const authData = ref(null);
    const authCookie = useCookie("auth");

    const signup = async (data) => {
        try {
            console.log("Отправляемые данные:", data);
            const res = await api.post("/auth/signup", data);
            authData.value = { ...res.data, ...data };
            saveAuthData();
        } catch (e) {
            console.error("Ошибка при регистрации:", e.response?.data || e.message);
            throw new Error(e.response?.data || e.message);
        }
    };

    const signin = async (data) => {
        try {
            const res = await api.post("/auth/signin", data);
            authData.value = res.data;
            saveAuthData();
        } catch (e) {
            throw new Error(e.response.data).message;
        }
    };

    const fetchUserData = async (userId, token) => {
        try {
            const res = await api.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.data) {
                authData.value = {
                    ...authData.value,
                    email: res.data.email,
                    birthday: res.data.birthday,
                    gender: res.data.gender.name,
                    reviewCount: res.data.reviewCount,
                    ratingCount: res.data.ratingCount
                };
                saveAuthData();
            }
        } catch (e) {
            console.error("Ошибка при получении данных пользователя:", e.response ? e.response.data : e.message);
        }
    };

    const signout = async () => {
        await api.post("/auth/signout", null, {
            headers: {
                Authorization: `Bearer ${authData.value.token}`,
            }
        });
        removeAuthData();
    }

    const updateUser = async (data) => {
        try {
            const res = await api.put('/users', data, {
                headers: {
                    Authorization: `Bearer ${authData.value.token}`,
                }
            });
            if (res.data) {
                authData.value = { ...authData.value, ...data };
                saveAuthData();
            }
        } catch (e) {
            console.error("Ошибка при обновлении данных пользователя:", e.response ? e.response.data : e.message);
        }
    };

    const deleteAccount = async () => {
        try {
            await api.delete('/users', {
                headers: {
                    Authorization: `Bearer ${authData.value.token}`,
                }
            });
            removeAuthData();
        } catch (e) {
            console.error("Ошибка при удалении аккаунта:", e.response ? e.response.data : e.message);
        }
    };

    const saveAuthData = () => {
        if (authData.value) {
            authCookie.value = btoa(JSON.stringify(authData.value));
        }
    };

    const removeAuthData = () => {
        authData.value = null;
        authCookie.value = null;
    }

    const readAuthData = () => {
        if (authCookie.value) {
            try {
                authData.value = JSON.parse(atob(authCookie.value));
                console.log("Прочитанные данные:", authData.value);
                fetchUserData(authData.value.id, authData.value.token);
            } catch (e) {
                console.error("Ошибка при чтении данных из куки:", e);
            }
        }
    };
    readAuthData();

    return {
        authData,
        signup,
        signin,
        signout,
        updateUser,
        deleteAccount,
    }
});