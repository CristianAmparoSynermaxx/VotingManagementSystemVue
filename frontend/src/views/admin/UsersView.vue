<template>
  <section class="p-5 pt-10 w-full">
    <div class="bg-white rounded-md">
      <CustomDataTable
        url="users"
        :columns="columns"
        title="Users Information"
        :search="true"
      />
    </div>
  </section>
</template>

<script setup>
import CustomDataTable from "@/components/CustomDataTable.vue";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "username", label: "Username" },
  { key: "password", label: "Password" },
  { key: "image", label: "Image" },
  { key: "action", label: "Action" },
];
</script>
