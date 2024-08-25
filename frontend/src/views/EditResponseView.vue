<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import VotingDuration from '@/components/VotingDuration.vue';

import axios from 'axios';
import Swal from 'sweetalert2';
import { GetHeaders } from '@/utils/GetHeaders';


const apiHost = import.meta.env.VITE_host;
const router = useRouter();
const headers = GetHeaders();

const userID = JSON.parse(localStorage.getItem('userData'))?.id || null;
const data = ref([]);
const success = ref('');
const error = ref('');


const selectedCandidates = ref({
  President: null,
  Vice_President: null,
  Secretary: null,
  Treasurer: null,
  Auditor: null,
  Peace_Officer: null,
});
const isChecked = ref(false);

const fetchData = async () => {
  try {
    const response = await axios.get(`${apiHost}api/candidates`, { headers });
    data.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchVotes = async () => {
  try {
    const response = await axios.get(`${apiHost}api/votes/${userID}`, { headers });
    if (response.data) {
        
        const { President, Vice_President, Secretary, Treasurer, Auditor, Peace_Officer } = response.data[0];
        selectedCandidates.value = {
        President,
        Vice_President,
        Secretary,
        Treasurer,
        Auditor,
        Peace_Officer,
      };
    }
  } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/ballot')
        
  }
};


onMounted(() => {
  fetchVotes();
  fetchData();

});

const uniquePositions = computed(() => [...new Set(data.value.map((item) => item.position))]);

const filteredData = (position) => data.value.filter((item) => item.position === position);


const handleSubmit = async () => {
  const result = await Swal.fire({
    icon: 'question',
    title: 'Confirmation',
    text: 'Are you sure you want to update your vote?',
    showCancelButton: true,
    confirmButtonText: 'Yes, update',
    cancelButtonText: 'No, cancel',
  });

  if (result.isConfirmed) {
    try {
      const formDataToSend = selectedCandidates.value;
      const response = await axios.put(`${apiHost}api/votes/${userID}`, formDataToSend, { headers });
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
      });
      router.push('/donevoting');
    } catch (error) {
      console.log(error.response.data.error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.error,
      });
      success.value = '';
    }
  }
};
</script>

<template>
  <section class="fixed inset-0 pt-20 pb-10 h-full w-full overflow-y-auto">
    <button class="px-5 py-3 relative">
      <router-link to="/user">
        <img class="w-10 hover:scale-105" src="/back.png" alt="" />
      </router-link>
    </button>

    <VotingDuration/>

    <form class="flex flex-col gap-5 justify-center items-center p-2" @submit.prevent="handleSubmit">
      <div>
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
          <span class="text-orange-600">Update</span> Vote
        </h1>
      </div>
      <div v-for="position in uniquePositions" :key="position" class="relative flex flex-col justify-center bg-orange-50 shadow-xl w-full md:w-5/6 lg:w-2/3 xl:w-1/2 h-max p-12 rounded-3xl">
        <div class="absolute top-0 left-0 bg-orange-500 text-white w-1/3 text-center p-1 font-bold text-lg">{{ position }}</div>
        <input type="radio" :id="`abstain${position}`" :name="position" :value="`abstain${position}`" v-model="selectedCandidates[position]" class="hidden" />
        <label :for="`abstain${position}`">
          <div :class="['cursor-pointer hover:bg-green-700 md:hover:bg-orange-600 absolute top-2 right-2 text-white w-28 p-0.5 text-center rounded-xl font-bold border-2 ring-red-600', { 'bg-green-700': selectedCandidates[position] === `abstain${position}`, 'bg-orange-500': selectedCandidates[position] !== `abstain${position}` }]">Abstain</div>
        </label>
        <div class="h-max flex flex-wrap sm:flex-row flex-col md:items-center justify-evenly gap-5">
          <div v-for="item in filteredData(position)" :key="item.id">
            <div class="flex sm:flex-col gap-2 md:gap-0 items-center">
              <div class="bg-orange-600 w-[86px] h-[86px] flex items-center rounded-full -mb-1">
                <div class="w-20 h-20 bg-orange-100 rounded-full overflow-hidden border-2 border-white flex justify-center items-center mx-auto">
                  <img :src="`${apiHost}/uploads/${item.image}`" alt="" />
                </div>
              </div>
              <div class="sm:text-center">
                <div class="-space-y-2">
                  <h1 class="font-bold">{{ item.name }}</h1>
                  <h2 class="text-orange-700">{{ item.partylist }}</h2>
                </div>
                <input type="radio" :id="item.name" :name="position" :value="item.name" v-model="selectedCandidates[position]" class="hidden" />
                <label :for="item.name">
                  <div :class="['cursor-pointer hover:bg-green-700 md:hover:bg-orange-600 w-32 sm:mx-auto text-white text-center p-1 rounded-lg font-bold transition duration-300', { 'bg-green-700': selectedCandidates[position] === item.name, 'bg-orange-500': selectedCandidates[position] !== item.name }]">
                    {{ selectedCandidates[position] === item.name ? 'Voted' : 'Vote' }}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-5/6 lg:w-2/3 xl:w-1/2 text-xs sm:text-sm lg:text-[16px]">
        <div class="text-center w-full">
          <h1 v-if="success" class="text-green-700">{{ success }}</h1>
          <h1 v-if="error" class="text-red-700">{{ error }}</h1>
        </div>
        <input type="checkbox" id="checkbox" v-model="isChecked" />
        <label for="checkbox" class="ml-2 text-gray-600 cursor-pointer">
          I confirm that I have reviewed and agree with the provided information
        </label>
      </div>
      <div class="flex w-full md:w-5/6 lg:w-2/3 xl:w-1/2 justify-end gap-2">
        <router-link to="/user/doneVoting">
          <div class="border-2 border-orange-500 hover:border-orange-700 bg-white text-orange-700 cursor-pointer transition duration-300 text-lg font-bold rounded-xl px-5 py-2">Cancel</div>
        </router-link>
        <input type="submit" value="Update" :disabled="!isChecked" :class="{'bg-orange-500 hover:bg-orange-700 cursor-pointer': isChecked, 'bg-gray-500': !isChecked}" class="transition duration-300 text-white text-lg font-bold rounded-xl px-5 py-2" />
      </div>
    </form>
  </section>
</template>



