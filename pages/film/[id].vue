<script setup lang="ts">
import {useFilmStore} from "~/stores/film.js";
import { useReviewStore } from "~/stores/review.js";
import {useAuthStore} from "~/stores/auth.js";
import {ref} from "vue";
import { useRoute } from "vue-router";

const filmStore = useFilmStore();
const route = useRoute();
const reviewStore = useReviewStore();
const authStore = useAuthStore();

filmStore.fetchFilmById(route.params.id);
reviewStore.fetchReviewsByFilmId(route.params.id);
const message = ref('');
const sendReview = async () => {
  await reviewStore.addReview({
    film_id: route.params.id,
    message: message.value,
  });
  message.value = ' ';
  alert('Your review was added successfully');
}
</script>


<template>
  <template v-if="filmStore.film">
    <div class="row mb-custom">
      <div class="col-md-2">
        <h2>{{ filmStore.film.ratingAvg }}</h2>
      </div>
      <div class="col-md-8">
        <iframe class="video-player" width="750" height="450" :src="filmStore.film.link_video" allowfullscreen></iframe>
      </div>
      <div class="col-md-2" v-if="authStore.authData">
        <RatingStars :film-id="filmStore.film.id"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h1> {{ filmStore.film.name }}</h1>
      </div>

      <div class="col-md-10 fs-5">
       {{ filmStore.film.duration }} min &nbsp&nbsp |
        &nbsp&nbsp {{ filmStore.film.country.name }} {{ filmStore.film.year_of_issue }}. &nbsp&nbsp |
        &nbsp&nbsp {{ filmStore.film.age }} + &nbsp&nbsp |
        &nbsp&nbsp {{ filmStore.film.created_at }} &nbsp&nbsp |
        &nbsp&nbsp <template v-for="category in filmStore.film.categories" :key="category.id"> {{ category.name}} </template> &nbsp
      </div>

      <div class="col-md-2-fs-4 text-end">
        <a href="#">Kinopoisk</a>
      </div>
    </div>

    <div class="row">
      <div class="col-md-10" v-if="authStore.authData">
        <label for="exampleFormControlTextarea1" class="form-label" >Add review</label>
        <textarea v-model="message" class="form-control no-resize" id="exampleFormControlTextarea1" rows="1"></textarea>
      </div>
      <div class="col-md-2 d-flex flex-column-reverse" v-if="authStore.authData">
        <button class="btn btn-outline-success" @click="sendReview">Send</button>
      </div>
    </div>

    <div class="reviews-section mt-5 p-3 bg-light rounded" >
    <h3 class="textReviews mb-4 ">Reviews</h3>
    <div class="review border-bottom pb-3 mb-4" v-for="review in reviewStore.reviews " :key="review.id">
      <h4 class="text"> {{ review.user.fio}}</h4>
      <p class="text-muted"> {{ review.message }}</p>
      <small class="text-secondary"> {{ review.created_at }} </small>
    </div>
    </div>
  </template>
  <div v-else class="d-flex justify-content-center mt-4">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>

template {
  background-color: lightslategray;
}


.no-resize {
  resize: none;
}



.textReviews {
  color: #061f98;
}
.review h4 {
  font-size: 1.2rem;
}
.review p {
  font-size: 1rem;
  margin: 5px 0;
}

.video-player {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mb-custom {
  margin-bottom: 35px;
}

</style>