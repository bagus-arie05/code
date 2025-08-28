<!-- components/TabelData.vue -->
<template>
  <v-card-text>
    <!-- Title Section -->
    <v-row no-gutters class="mb-3" v-if="title">
      <v-col cols="12">
        <v-card-title class="text-subtitle-1 font-weight-bold pa-0" :class="{ 'red--text': title.includes('TERLAMBAT') }">
          {{ title }}
        </v-card-title>
      </v-col>
    </v-row>

    <!-- Controls Section -->
    <v-row no-gutters class="d-flex align-center mb-4">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <div class="d-flex align-center">
          <span>Show</span>
          <v-select
            v-model="itemsPerPage"
            :items="[10, 25, 50, 100]"
            density="compact"
            variant="outlined"
            hide-details
            class="mx-2"
            style="width: 80px;"
          />
          <span>entries</span>
        </div>
      </v-col>

      <v-col cols="12" sm="6" class="d-flex justify-end align-center">
        <div v-if="showSearch" class="d-flex align-center">
          <span class="mr-2">Search:</span>
          <v-text-field
            v-model="search"
            hide-details
            density="compact"
            variant="outlined"
            style="width: 200px;"
          />
        </div>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :items-per-page="itemsPerPage"
      :search="search"
      no-data-text="No data available in table"
      hide-default-footer
      class="elevation-1"
      item-value="id"
    >
      <!-- Custom slot untuk nomor urut -->
      <template v-slot:item.no="{ index }">
        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
      </template>

      <!-- Custom slot untuk status -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          text-color="white"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Custom slot untuk keterangan -->
      <template v-slot:item.keterangan="{ item }">
        <span v-if="item.keterangan" class="text-red font-weight-bold">
          {{ item.keterangan }}
        </span>
        <span v-else>-</span>
      </template>

      <!-- Slot untuk aksi -->
      <template v-slot:item.aksi="{ item }">
        <slot name="actions" :item="item" />
      </template>

      <template #no-data>
        <div class="text-center pa-4">No data available in table</div>
      </template>
    </v-data-table>

    <!-- Footer Pagination -->
    <div class="d-flex justify-space-between align-center mt-4">
      <div class="text-body-2 text-grey-darken-1">
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalEntries }} entries
      </div>
      
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
      />
    </div>
  </v-card-text>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const search = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

const totalEntries = computed(() => props.items.length);
const totalPages = computed(() => Math.ceil(totalEntries.value / itemsPerPage.value));

// Filter items based on search and pagination
const filteredItems = computed(() => {
  let filtered = props.items;
  
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = props.items.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }
  
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.slice(start, end);
});

const currentPageStart = computed(() => {
  if (totalEntries.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const currentPageEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalEntries.value);
});

// Method untuk mendapatkan warna status
const getStatusColor = (status) => {
  switch (status) {
    case 'Tunggu Daftar':
      return 'orange';
    case 'Barcode':
      return 'blue';
    case 'Selesai':
      return 'green';
    case 'Batal':
      return 'red';
    default:
      return 'grey';
  }
};

// Watch untuk reset halaman ketika items per page berubah
watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Watch untuk reset halaman ketika items berubah
watch(() => props.items, () => {
  currentPage.value = 1;
});

// Watch untuk reset halaman ketika search berubah
watch(search, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.text-red {
  color: #d32f2f;
}
</style>