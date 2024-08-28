<script setup>
import Navbar from "@/components/Navbar.vue";

const userData = localStorage.getItem("userData");
</script>

<template>
  <Navbar v-if="userData" />
  <router-view />
</template>
