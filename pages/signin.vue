<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref('');

const login = async () => { // any
  try {
    await authStore.signin({
      email: email.value,
      password: password.value,
    });
    await router.push('/');
  } catch (e: any) {
    errorMessage.value = e.response ? e.response.data.message : e.message;
  }
};
</script>
<template>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4">
      <h1>Please login</h1>
      <form @submit.prevent="login" style="width: 22rem;">
        <div class="form-outline mb-4">
          <input v-model="email" type="email" id="email" class="form-control" required>
          <label for="email">Email address</label>
        </div>

        <div class="form-outline mb-4">
          <input v-model="password" type="password" id="password" class="form-control" required>
          <label for="password">Password</label>
        </div>

        <div class="row mb-4">
          <div class="col">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" checked>
              <label class="form-check-label" for="rememberMe">Remember me</label>
            </div>
          </div>
          <div class="col text-end">
            <a href="#">Forgot your password?</a>
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary btn-block mb-4">SignIn</button>
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

