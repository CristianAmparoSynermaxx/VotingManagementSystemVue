<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const userData = JSON.parse(localStorage.getItem('userData'))

</script>

<template>
  <h1 class="mt-56">hello world {{ userData.username }}</h1>
</template>
