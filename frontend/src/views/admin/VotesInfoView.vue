<template>
  <section class="p-5 pt-10 w-full">
    <div class="bg-white rounded-md">
      <CustomDataTable
        url="votes"
        :columns="columns"
        title="Votes Information"
        :search="false"
      />
    </div>
  </section>
</template>

<script setup>
import CustomDataTable from "@/components/CustomDataTable.vue";

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "President", label: "President" },
  { key: "Vice_President", label: "Vice President" },
  { key: "Secretary", label: "Secretary" },
  { key: "Auditor", label: "Auditor" },
  { key: "Treasurer", label: "Treasurer" },
  { key: "Peace_Officer", label: "Peace Officer" },
];
</script>
