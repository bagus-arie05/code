<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:item.pilih="{ item }">
      <v-checkbox
        :model-value="isSelected(item.id)"
        @change="toggleService(item.id)"
      ></v-checkbox>
    </template>
  </v-data-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  headers: Array,
  items: Array,
  selectedItems: Array,
});

const emit = defineEmits(['update:selectedItems']);

const isSelected = (id) => props.selectedItems.includes(id);

const toggleService = (id) => {
  const newSelection = isSelected(id)
    ? props.selectedItems.filter(serviceId => serviceId !== id)
    : [...props.selectedItems, id];
  
  emit('update:selectedItems', newSelection);
};
</script>