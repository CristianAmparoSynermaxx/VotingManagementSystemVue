<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { GetHeaders } from "@/utils/GetHeaders";

// Constants
const apiHost = import.meta.env.VITE_host;

// Reactive state
const data = ref([]);
const uniquePositions = ref([]);
const charts = ref([]);
const headers = GetHeaders();

// Fetch data
const fetchData = async () => {
  try {
    const response = await axios.get(`${apiHost}api/votes/count`, { headers });
    data.value = response.data;
    updateCharts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Update charts based on the data
const updateCharts = () => {
  uniquePositions.value = [...new Set(data.value.map((item) => item.position))];

  charts.value = uniquePositions.value
    .map((position) => {
      const positionData = data.value.filter(
        (item) => item.position === position
      );
      const votes = positionData.map((item) => item.vote_count);
      const candidates = positionData.map((item) => item.name);

      if (votes.length === 0 || candidates.length === 0) {
        return null;
      }

      return {
        position,
        series: [
          {
            name: "Votes",
            data: votes,
          },
        ],
        options: {
          colors: ["#FFA500"],
          plotOptions: {
            bar: {
              borderRadius: 0,
              horizontal: true,
            },
          },
          xaxis: {
            categories: candidates,
          },
          responsive: [
            {
              breakpoint: 750,
              options: {
                plotOptions: {
                  bar: {
                    horizontal: false,
                  },
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      };
    })
    .filter((chart) => chart !== null);
};

// Lifecycle hooks
onMounted(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 3000);
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <div
    class="graph overflow-auto overflow-x-hidden w-full gap-5 grid grid-cols-1 xl:grid-cols-2 py-10"
  >
    <div
      v-for="chart in charts"
      :key="chart.position"
      class="flex flex-col justify-between items-center w-full h-96 bg-gray-100 shadow-lg rounded-md p-10 pr-5"
    >
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left"
      >
        <span class="text-orange-600">{{ chart.position }}</span>
      </h1>
      <apexchart
        class="w-full"
        type="bar"
        :options="chart.options"
        :series="chart.series"
        height="100%"
      />
    </div>
  </div>
</template>
