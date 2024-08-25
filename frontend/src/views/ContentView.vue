<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { GetHeaders } from '@/utils/GetHeaders'; // Ensure your utility function is imported correctly
import { RouterLink } from 'vue-router';

const apiHost = import.meta.env.VITE_host;

// State management
const data = ref([]);
const groupedDataByPosition = ref({});

// Fetch data function
const fetchData = async () => {
  try {
    const headers = GetHeaders();
    const response = await axios.get(`${apiHost}api/candidates/`, { headers });
    data.value = response.data;

    // Group data by position
    groupedDataByPosition.value = data.value.reduce((acc, item) => {
      (acc[item.position] = acc[item.position] || []).push(item);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data on component mount and set up interval
onMounted(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 5000);

  // Cleanup on unmount
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
    <section class="w-full h-screen pt-28">
    <h1 class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl pl-2 md:pl-10">
      <span class="text-primary">Candidates </span>Information
    </h1>
    <RouterLink to="/ballot">
      <div class="fixed top-28 md:right-10 right-2 animate-bounce cursor-pointer bg-white py-2 px-4 outline outline-orange-500 hover:outline-primarybg-primary text-orange-700 font-bold z-20">
        Vote Now
      </div>
    </RouterLink>

    <!-- Render positions and their candidates -->
    <div v-for="(positionData, position) in groupedDataByPosition" :key="position" class="flex flex-wrap justify-center gap-10 p-10 w-full h-max pt-10 rounded-3xl">
      <div v-for="item in positionData" :key="item.id" class="relative md:w-96 max-w-96 bg-white rounded-3xl shadow-xl md:mt-0 w-full xl:p-0">
        <div class="pt-14 p-8">
          <div class="absolute left-0 top-0 w-2/5 mx-auto">
            <div class="bg-primary text-lg p-1 text-center text-white font-bold">{{ item.position }}</div>
          </div>
          <div class="relative mx-auto bg-primary w-[137px] h-[137px] flex items-center rounded-full">
            <div class="w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto">
              <img :src="`${apiHost}uploads/${item.image}`" alt="" />
            </div>
          </div>
          <div class="-space-y-2">
            <div class="text-xl text-center text-black font-bold">{{ item.name }}</div>
            <div class="text-lg p-0.5 text-center text-primary font-medium">{{ item.partylist }}</div>
          </div>
          <div class="w-full px-5 bg-gray-500 h-0.5 mx-auto"></div>
          <div class="w-full mx-auto">
            <div class="md:text-lg  w-full p-0.5 text-center text-gray-500 font-bold">Achievements/Credentials</div>
            <textarea class="w-full p-2 text-center h-24" :value="item.credentials" readonly></textarea>
          </div>
          <div class="mt-3 w-full px-5 bg-gray-500 h-0.5 mx-auto"></div>
          <div class="w-full mx-auto">
            <div class="md:text-lg p-0.5 text-center text-gray-500 font-bold">Platforms/Goals</div>
            <textarea class="w-full p-2 text-center h-24" :value="item.platform" readonly></textarea>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>