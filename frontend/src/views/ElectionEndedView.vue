<script setup>

</script>

<template>
  <section class="fixed inset-0 pt-20 pb-10 h-full w-full overflow-y-auto">
    <RouterLink to="/content">
        <button class="px-5 py-3 relative">
             <img class="w-10 hover:scale-105" src="/back.png" alt="Back" />
        </button>
    </RouterLink>
    <div class="p-5">
      <h1 class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center">
        <span class="text-orange-600">Election</span> Page
      </h1>
    </div>
    <div class="relative flex flex-col justify-center mx-auto bg-orange-50 shadow-xl w-full md:w-5/6 lg:w-2/3 xl:w-1/2 h-max p-12 rounded-3xl">
      <h1 class="text-xl md:text-2xl font-bold text-center">
        The election has been ended!
      </h1>
    </div>
  </section>
</template>


