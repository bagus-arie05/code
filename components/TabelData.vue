<template>
  <v-card-text>
    <!-- Title Section -->
    <v-row no-gutters class="mb-3">
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
            density="default"
            hide-details
            class="shrink"
          />
          <span>entries</span>
        </div>
      </v-col>

      <v-col cols="12" sm="6" class="d-flex justify-end align-center">
        <div v-if="showSearch" class="d-flex align-center">
          <span class="mr-2">Search:</span>
          <v-text-field
            v-model="search"
            label="Search"
            hide-details
            density="compact"
            style="min-width: 200px"
          />
        </div>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="paginatedItems"
      :search="search"
      no-data-text="No data available in table"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.aksi="{ item }">
        <slot name="actions" :item="item" />
      </template>

      <template #no-data>
        <div class="text-center pa-4">No data available in table</div>
      </template>
    </v-data-table>

    <div class="d-flex justify-space-between align-center pa-4">
      <div class="text-body-2 text-grey-darken-1">
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalEntries }} entries
      </div>
      <div class="d-flex align-center">
        <v-btn
          :disabled="currentPage === 1"
          @click="previousPage"
          variant="text"
          size="small"
          class="text-body-2"
        >
          Previous
        </v-btn>
        <template v-for="page in visiblePages" :key="page">
          <v-btn
            v-if="page !== '...'"
            :color="page === currentPage ? 'primary' : ''"
            :variant="page === currentPage ? 'flat' : 'text'"
            @click="goToPage(page)"
            size="small"
            class="mx-1"
            min-width="40"
          >
            {{ page }}
          </v-btn>
          <span v-else class="mx-1">...</span>
        </template>
        <v-btn
          :disabled="currentPage === totalPages"
          @click="nextPage"
          variant="text"
          size="small"
          class="text-body-2"
        >
          Next
        </v-btn>
      </div>
    </div>
  </v-card-text>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { defineProps } from "vue";

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

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.items.slice(start, end);
});

const currentPageStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const currentPageEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEntries.value));

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }
  return pages;
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

watch(() => props.items, () => {
  currentPage.value = 1;
});
</script>