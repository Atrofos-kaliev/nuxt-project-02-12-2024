<script setup lang="ts">
import { ref } from 'vue';
import { useGenderStore } from '@/stores/gender';
import {useAuthStore} from "~/stores/auth";

const fio = ref('');
const email = ref('');
const password = ref('');
const birthday = ref('');
const gender = ref(0);
const genderStore = useGenderStore();
const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref('');

const register = async () => {
  if (!fio.value || !email.value || !password.value || !birthday.value || gender.value === 0) {
    console.log("Некоторые поля не заполнены или некорректны.");
    return;
  }

  try { // any
    await authStore.signup({
      fio: fio.value,
      email: email.value,
      password: password.value,
      birthday: birthday.value,
      gender_id: gender.value,
    });
    router.push('/');
  } catch (e: any) {
    errorMessage.value = e.message;
  }
};

</script>

<template>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4">
      <h1 align="center">Registration</h1>
      <form @submit.prevent="register">
      <label for="fio" class="form-label">Full name</label>
        <input type="text" class="form-control" id="fio" v-model="fio">

        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email">
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="password">
        </div>

        <div class="mb-3">
          <label for="birthday" class="form-label">Birthday</label>
          <input type="date" class="form-control" id="birthday" v-model="birthday">
        </div>

        <div class="mb-3">
          <label for="gender" class="form-label">Gender</label>
          <select class="form-select" v-model="gender">
            <option value="0" selected>Gender</option>
            <option
                v-for="gender in genderStore.genders"
                :key="gender.id"
                :value="gender.id">{{ gender.name }}</option>
          </select>
        </div>

        <div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </div>
      </form>
      <div class="alert alert-danger" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>