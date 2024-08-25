<script setup>
import VotingDuration from '@/components/VotingDuration.vue';

</script>

<template>
  <section class="fixed inset-0 pt-20 pb-10 h-full w-full overflow-y-auto">
    <VotingDuration/>
    <button class="px-5 py-3 relative">
      <RouterLink to="/content">
        <img class="w-10 hover:scale-105" src="/back.png" alt="Go back" />
      </RouterLink>
    </button>
    <div class="p-5">
      <h1 class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center">
        <span class="text-orange-600">Election</span> Page
      </h1> 
    </div>
    <div class="relative flex flex-col justify-center mx-auto bg-orange-50 shadow-xl w-full md:w-5/6 lg:w-2/3 xl:w-1/2 h-max p-12 rounded-3xl">
      <h1 class="text-xl md:text-2xl font-bold text-center">
        Your response has been added!
      </h1>
      <RouterLink to="/editresponse" class="w-full flex">
        <button class="bg-orange-500 hover:bg-orange-700 w-max mx-auto cursor-pointer transition duration-300 text-white font-bold rounded-3xl px-5 py-2">
          Edit Response
        </button>
      </RouterLink>
    </div>
  </section>
</template>




