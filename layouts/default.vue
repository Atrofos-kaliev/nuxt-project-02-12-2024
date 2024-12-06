<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";


const authStore = useAuthStore();
const route = useRoute();

const logout = async () => {
  await authStore.signout();
}
</script>
<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div class="container-fluid">
        <NuxtLink to="/" class="navbar-brand text-primary fw-bold">KinoTower</NuxtLink>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <div class="d-flex align-items-center gap-3">
            <template v-if="!authStore.authData">
              <button
                  class="btn btn-outline-success"
                  type="button"
                  @click="$router.push('/signup')"
              >
                Sign Up
              </button>
              <button
                  type="button"
                  class="btn btn-outline-info"
                  @click="$router.push('/signin')"
              >
                Sign In
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/" class="btn btn-outline-primary" @click="$router.push('/profile/')">Profile</NuxtLink>
              <button
                  @click="logout"
                  type="button"
                  class="btn btn-outline-danger"
              >
                Sign Out
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <div class="container mt-3">
      <slot />
    </div>
  <footer class="bg-dark text-white p-3 mt-3">
    <div class="container text-center">
      <p class="lead"> &copy; Kaliyev</p>
    </div>
  </footer>
</template>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-outline-success:hover {
  color: white;
  background-color: #28a745;
}

.btn-outline-info:hover {
  color: white;
  background-color: #17a2b8;
}

.btn-outline-danger:hover {
  color: white;
  background-color: #dc3545;
}

.btn-outline-primary:hover {
  color: white;
  background-color: #007bff;
}

.container {
  padding: 1rem;
}

</style>