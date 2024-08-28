<script setup>
import Navbar from "@/components/Navbar.vue";
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <RouterView />
</template>
