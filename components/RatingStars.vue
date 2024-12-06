<script setup lang="ts">
import { useRatingStore} from "~/stores/rating";

const props = defineProps({
  filmId: {
  type: Number,
  required: true,
  }
});

const ratingStore = useRatingStore();
ratingStore.fetchRatingByUserId();

const sendRating = async (num: number) => {
  await ratingStore.addRating({
    film_id: props.filmId,
    ball: num,
  });
  alert('Your rating has been started.');
}
</script>


<template>
  <ul class="rating-stars">
    <template v-for="i in 5" :key="i">
    <li class="star-item">
      <template v-if="ratingStore.userRatingByFilmId(filmId)">
        <span
            class="star-link"
            @click="sendRating(i)"
            :class="{ filled: i <= ratingStore.userRatingByFilmId(filmId).score }"
        >
            <i :class="i <= ratingStore.userRatingByFilmId(filmId).score ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </span>
      </template>
      <template v-else>
        <a
            @click.prevent="sendRating(i)"
            href="" class="star-link"
            data-bs-toggle="tooltip"
            :title="i"> <i class="bi bi-star"></i></a>
      </template>
      </li>
    </template>
  </ul>
</template>

<style scoped>
.rating-stars {
  list-style-type: none;
}
.star-item {
  font-size: 2.5rem;
}
.star-link {
  color: #490495;
}
.star-link:hover {
  color: #ff00cd;
}
</style>