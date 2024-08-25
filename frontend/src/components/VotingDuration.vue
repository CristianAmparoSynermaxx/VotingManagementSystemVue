<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { GetHeaders } from '@/utils/GetHeaders';
import { useRouter } from 'vue-router';

const remainingTime = ref(0);

const headers = GetHeaders();
const router = useRouter();

onMounted(() => {
  axios.get(`${import.meta.env.VITE_host}api/votes/voteEnd`, { headers })
    .then(response => {
      const remainingTimeInSeconds = Math.floor(response.data.remainingTime / 1000);
      remainingTime.value = remainingTimeInSeconds;
    })
    .catch(error => {
      console.error('Error getting remaining time:', error);
    });

  const countdownRef = setInterval(() => {
    remainingTime.value -= 1;

    if (remainingTime.value < 0) {
      clearInterval(countdownRef); // Clear the interval
      router.push('/electionended'); // Redirect to election ended page
    }
  }, 1000);

  onUnmounted(() => {
    clearInterval(countdownRef); // Ensure the interval is cleared on unmount
  });
});

const formatTime = (timeInSeconds) => {
  const days = Math.floor(timeInSeconds / 86400);
  const hours = Math.floor((timeInSeconds % 86400) / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};
</script>

<template>
  <div class="absolute duration top-24 right-5 py-3 px-4 flex items-center cursor-help justify-center h-max bg-orange-600 text-white shadow-lg rounded-xl w-max">
    <img class="w-5 h-5" src="/duration.png" alt="Duration Icon" />
    <span class="lg:text-xl text-lg pl-2 font-bold">
      {{ remainingTime < 0 ? 'Election Ended' : formatTime(remainingTime) }}
    </span>
    <span class="absolute durationText hidden -bottom-10 z-20 text-black text-sm bg-gray-300 w-max px-2 py-1 rounded-lg">
      Election Duration
    </span>
  </div>
</template>
