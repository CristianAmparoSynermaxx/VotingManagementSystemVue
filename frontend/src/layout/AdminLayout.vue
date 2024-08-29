<script setup>
import Navbar from "@/components/Navbar.vue";

const userData = localStorage.getItem("userData");
</script>

<template>
  <Navbar v-if="userData" />
  <section
    class="overflow-y-auto fixed top-20 left-0 xl:left-72 bottom-0 right-0 flex flex-col lg:items-start items-center"
  >
    <router-view />
  </section>
</template>
