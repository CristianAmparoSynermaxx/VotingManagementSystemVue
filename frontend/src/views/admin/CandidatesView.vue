<template>
  <section class="p-5 pt-10 w-full">
    <div class="bg-white rounded-md">
      <CustomDataTable
        url="candidates"
        :columns="columns"
        title="Candidates Information"
        :search="true"
      />
    </div>
  </section>
</template>

<script setup>
import CustomDataTable from "@/components/CustomDataTable.vue";

const columns = [
  { key: "id", label: "Id" },
  { key: "name", label: "Name" },
  { key: "position", label: "position" },
  { key: "partylist", label: "Partylist" },
  { key: "image", label: "Image" },
  { key: "action", label: "Action" },
];
</script>
