import { defineStore } from "pinia";
import {api} from "~/api/index.js";
import { useAuthStore } from "~/stores/auth.js";
import { ref } from 'vue';

export const useRatingStore = defineStore('rating', () => {
    const authStore = useAuthStore();
    const ratings = ref([]);

    const userRatingByFilmId = computed( () => {
         return (filmId) => {
             return ratings.value.find((item) => item.film.id === filmId);
         }
    });

    const addRating = async (rating) => {
        await api.post(`/users/${authStore.authData.id}/ratings`, rating, {
            headers: {
                Authorization: `Bearer ${authStore.authData.token}`,
            }
        });
        await fetchRatingByUserId();
    }

    const fetchRatingByUserId = async () => {
        const res = await api.get(`/users/${authStore.authData.id}/ratings`, {
            headers: {
                Authorization: `Bearer ${authStore.authData.token}`,
            }
        });
        ratings.value = res.data.ratings;
    }

    const deleteRating = async (userId, ratingId) => {
        await api.delete(`/users/${userId}/ratings/${ratingId}`, {
            headers: {
                Authorization: `Bearer ${authStore.authData.token}`,
            }
        });
        await fetchRatingByUserId();
    }

    return {
        addRating,
        ratings,
        fetchRatingByUserId,
        userRatingByFilmId,
        deleteRating,
    }
});


