import {defineStore} from "pinia";
import {api} from "~/api/index.js";
import { useAuthStore} from "~/stores/auth.js";
import { ref } from 'vue';

export const useReviewStore = defineStore('review',() => {
    const reviews = ref([]);
    const authStore = useAuthStore();

    const fetchReviewsByFilmId = async (filmId) => {
        const res = await api.get(`/films/${filmId}/reviews`);
        reviews.value = res.data.reviews;
    }

    const fetchReviewsByUserId = async (userId) => {
        const res = await api.get(`/users/${userId}/reviews`, {
        headers: {
            Authorization: `Bearer ${authStore.authData.token}`,
        }
        });
        reviews.value = res.data.reviews;
    }

    const addReview = async (review) => {
        await api.post(`/users/${authStore.authData.id}/reviews`, review, {
            headers: {
                Authorization: `Bearer ${authStore.authData.token}`
            }
        });
        await fetchReviewsByFilmId(review.film_id); // any
    }

    const deleteReview = async (userId, reviewId) => {
        await api.delete(`/users/${userId}/reviews/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${authStore.authData.token}`,
            }
        });
        await fetchReviewsByUserId(userId);
    }

    return {
        reviews,
        fetchReviewsByFilmId,
        fetchReviewsByUserId,
        addReview,
        deleteReview,
    }
});