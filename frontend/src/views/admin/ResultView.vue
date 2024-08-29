<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import { GetHeaders } from "@/utils/GetHeaders";
import VotingDuration from "@/components/VotingDuration.vue";

const apiHost = import.meta.env.VITE_host;
const data = ref([]);

const headers = GetHeaders();

const fetchData = async () => {
  try {
    const response = await axios.get(`${apiHost}api/votes/count`, { headers });
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const findCandidatesWithHighestVotes = () => {
  const highestVotesMap = new Map();

  data.value.forEach((candidate) => {
    const { position, vote_count } = candidate;

    if (
      !highestVotesMap.has(position) ||
      vote_count > highestVotesMap.get(position).vote_count
    ) {
      highestVotesMap.set(position, { candidate, vote_count });
    }
  });

  return Array.from(highestVotesMap.values()).map((entry) => entry.candidate);
};

const candidatesWithHighestVotes = ref([]);

onMounted(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 3000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

watch(
  () => data.value,
  () => {
    candidatesWithHighestVotes.value = findCandidatesWithHighestVotes();
  }
);
</script>

<template>
  <section
    class="fixed top-20 left-0 xl:left-72 bottom-0 right-0 flex flex-col overflow-auto p-5"
  >
    <VotingDuration />
    <h1
      class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-left"
    >
      <span class="text-orange-600">Result</span> Page
    </h1>
    <div class="pt-5">
      <h2
        class="text-sm leading-tight tracking-tight text-gray-900 md:text-xl text-center pb-5"
      >
        This shows the leading candidates for eachposition"
      </h2>
      <div class="flex flex-wrap justify-center gap-5">
        <div
          v-for="candidate in candidatesWithHighestVotes"
          :key="candidate.id"
          class="relative w-96 bg-white rounded-3xl shadow-xl md:mt-0 sm:max-w-md xl:p-0"
        >
          <div class="pt-14 p-8">
            <div class="absolute left-0 top-0 w-2/5 mx-auto">
              <div
                class="bg-orange-600 text-lg p-1 text-center text-white font-bold"
              >
                {{ candidate.position }}
              </div>
            </div>
            <div
              class="relative mx-auto bg-orange-600 w-[137px] h-[137px] flex items-center rounded-full"
            >
              <div
                class="w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto"
              >
                <div>
                  <img :src="`${apiHost}uploads/${candidate.image}`" alt="" />
                </div>
              </div>
            </div>
            <div class="-space-y-2">
              <div class="text-xl text-center text-black font-bold">
                {{ candidate.name }}
              </div>
              <div
                class="text-lg p-0.5 text-center text-orange-600 font-medium"
              >
                {{ candidate.partylist }}
              </div>
            </div>
            <div><div class="w-80 bg-gray-500 h-0.5 mx-auto"></div></div>
            <div class="w-max mx-auto">
              <div class="text-lg p-0.5 text-center text-gray-500 font-bold">
                Achievements/Credentials
              </div>
              <textarea
                class="w-72 p-2 text-center h-24"
                :value="candidate.credentials"
                readonly
              ></textarea>
            </div>
            <div class="pt-3">
              <div class="w-80 bg-gray-500 h-0.5 mx-auto"></div>
            </div>
            <div class="w-max mx-auto">
              <div class="text-lg p-0.5 text-center text-gray-500 font-bold">
                Platforms/Goals
              </div>
              <textarea
                class="w-72 p-2 text-center h-24"
                :value="candidate.platform"
                readonly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add your styles here if needed */
</style>
