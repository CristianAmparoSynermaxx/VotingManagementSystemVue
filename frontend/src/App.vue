<script setup>

import Navbar from "@/components/Navbar.vue";
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
const showNavbar = computed(() => route.meta.requiresNavbar ?? true);

</script>

<template>
  <Navbar v-if="showNavbar" />
  <RouterView />
</template>
