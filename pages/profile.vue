<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRatingStore } from '~/stores/rating';
import { useReviewStore } from '~/stores/review';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const ratingStore = useRatingStore();
const reviewStore = useReviewStore();
const router = useRouter();

const userName = computed(() => authStore.authData?.fio || 'Guest');
const userEmail = computed(() => authStore.authData?.email || 'Not available');
const userBirthday = computed(() => authStore.authData?.birthday || 'Not available');
const userGender = computed(() => authStore.authData?.gender || 'Not available');
const reviewCount = computed(() => authStore.authData?.reviewCount || 0);
const ratingCount = computed(() => authStore.authData?.ratingCount || 0);

const tabs = [
  { id: 'profile', label: 'MY PROFILE' },
  { id: 'reviews', label: 'MY REVIEWS' },
  { id: 'scores', label: 'MY SCORES' },
];

const activeTab = ref('profile');

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

const deleteAccount = async () => {
  try {
    await authStore.deleteAccount();
    await router.push('/');
  } catch (e: any) {
    console.error("Ошибка при удалении аккаунта:", e.message);
  }
};

const navigateToEditProfile = () => {
  router.push('/editProfile');
};

const fetchUserReviews = async () => {
  try {
    await reviewStore.fetchReviewsByUserId(authStore.authData?.id);
    console.log("Загруженные отзывы:", reviewStore.reviews);
  } catch (e) {
    console.error("Ошибка при получении отзывов:", e);
  }
};

const fetchUserScores = async () => {
  try {
    await ratingStore.fetchRatingByUserId();
    console.log("Загруженные оценки:", ratingStore.ratings);
  } catch (e) {
    console.error("Ошибка при получении оценок:", e);
  }
};

const deleteReview = async (reviewId) => {
  try {
    await reviewStore.deleteReview(authStore.authData?.id, reviewId);
    fetchUserReviews();
  } catch (e) {
    console.error("Ошибка при удалении отзыва:", e.response ? e.response.data : e.message);
  }
};

const deleteRating = async (ratingId) => {
  try {
    await ratingStore.deleteRating(authStore.authData?.id, ratingId);
    fetchUserScores();
  } catch (e) {
    console.error("Ошибка при удалении оценки:", e.response ? e.response.data : e.message);
  }
};

onMounted(() => {
  if (authStore.authData?.id && authStore.authData?.token) {
    fetchUserReviews();
    fetchUserScores();
  }
});
</script>

<template>
  <div>
    <div class="text-section mb-3 fw-bold fs-3">
      <p>{{ userName }}</p>
      <p>Count scores: {{ ratingCount }} </p>
      <p>Count reviews: {{ reviewCount }}</p>
    </div>

    <nav class="nav nav-tabs mt-4 d-flex mb-4">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-link text-center flex-grow-1"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div v-show="activeTab === 'profile'" class="tab-pane show active fs-5">
      <div class="mb-3">
        <span class="fw-bold">Email: </span>{{ userEmail }}
      </div>
      <div class="mb-3">
        <span class="fw-bold">Birthday: </span> {{ userBirthday }}
      </div>
      <div class="mb-3">
        <span class="fw-bold">Gender: </span>{{ userGender }}
      </div>
      <div class="mb-3">
      <button class="btn btn-primary me-2" @click="navigateToEditProfile">User</button>
      <button class="btn btn-danger " @click="deleteAccount">Delete account</button>
      </div>
    </div>

    <div v-show="activeTab === 'reviews'" class="tab-pane show">
      <div v-if="reviewStore.reviews.length > 0">
        <div class="card mb-3" v-for="review in reviewStore.reviews" :key="review.id">
          <div class="card-body">
            <h5 class="card-title">{{ review.film.name }}</h5>
            <p class="card-text">{{ review.message }}</p>
            <p class="card-text"><small class="text-muted">Date: {{ review.created_at }}</small></p>
            <button class="btn btn-danger" @click="deleteReview(review.id)">Remove</button>
          </div>
        </div>
      </div>
      <p v-else>No reviews yet.</p>
    </div>

    <div v-show="activeTab === 'scores'" class="tab-pane show">
      <div v-if="ratingStore.ratings.length > 0">
        <div class="card mb-3" v-for="score in ratingStore.ratings" :key="score.id">
          <div class="card-body">
            <h5 class="card-title">{{ score.film.name }}</h5>
            <p class="card-text">Score: {{ score.score }}</p>
            <p class="card-text"><small class="text-muted">Date: {{ score.created_at }}</small></p>
            <button class="btn btn-danger" @click="deleteRating(score.id)">Remove</button>
          </div>
        </div>
      </div>
      <p v-else>No scores yet.</p>
    </div>
  </div>
</template>

<style scoped>
.text-section {
  border-radius: 8px;
  padding: 15px;
}

.text-section p {
  margin: 0;
}

.nav-tabs {
  border-bottom: 2px solid #ddd;
}

.nav-link {
  border: 1px solid #ddd;
  margin-right: 5px;
  padding: 10px 20px;
  border-radius: 5px;
  color: #b908f6;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.nav-link.active {
  background-color: #040945;
  color: #fff;
}

.nav-link:hover {
  background-color: #007bff;
}

.tab-pane {
  padding: 20px;
}

.tab-pane .card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tab-pane .card-body {
  padding: 15px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  cursor: pointer;
  opacity: 0.8;
}

button.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

button.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

button.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

button.btn-danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

p {
  color: #2b3343;
}

/* Increased button size */
button.btn-lg {
  padding: 12px 24px;
  font-size: 1.25rem;
  border-radius: 8px;
}

/* Optional: Further button effects */
button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  cursor: pointer;
  opacity: 0.8;
  transform: translateY(-2px);
}

button.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

button.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

button.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

button.btn-danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

</style>
