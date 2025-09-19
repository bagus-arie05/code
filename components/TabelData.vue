<!-- components/TabelData.vue -->
<template>
  <v-card-text>
    <!-- Title Section -->
    <v-row no-gutters class="mb-3" v-if="title">
      <v-col cols="12">
        <v-card-title 
          class="text-subtitle-1 font-weight-bold pa-0" 
          :class="getTitleClass(title)"
        >
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
      :items="paginatedItems"
      :search="search"
      no-data-text="No data available in table"
      hide-default-footer
      class="elevation-1"
      item-value="no"
    >
      <!-- Custom slot untuk nomor urut -->
      <template v-slot:item.no="{ index }">
        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
      </template>

      <!-- Custom slot untuk jam panggil dengan highlighting -->
      <template v-slot:item.jamPanggil="{ item }">
        <slot name="item.jamPanggil" :item="item">
          <span>{{ item.jamPanggil }}</span>
        </slot>
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

      <!-- Custom slot untuk barcode dengan formatting -->
      <template v-slot:item.barcode="{ item }">
        <span class="font-mono">{{ item.barcode }}</span>
      </template>

      <!-- Custom slot untuk no antrian dengan highlighting -->
      <template v-slot:item.noAntrian="{ item }">
        <div>
          <span class="font-weight-medium">{{ item.noAntrian.split(' |')[0] }}</span>
          <br>
          <small class="text-grey-darken-1">{{ item.noAntrian.split(' |')[1] }}</small>
        </div>
      </template>

      <!-- Custom slot untuk klinik dengan chip styling -->
      <template v-slot:item.klinik="{ item }">
        <v-chip
          size="small"
          variant="outlined"
          :color="getKlinikColor(item.klinik)"
        >
          {{ item.klinik }}
        </v-chip>
      </template>

      <!-- Custom slot untuk fast track -->
      <template v-slot:item.fastTrack="{ item }">
        <v-chip
          size="small"
          color="info"
          variant="tonal"
        >
          {{ item.fastTrack }}
        </v-chip>
      </template>

      <!-- Custom slot untuk pembayaran -->
      <template v-slot:item.pembayaran="{ item }">
        <v-chip
          size="small"
          color="success"
          variant="tonal"
        >
          {{ item.pembayaran }}
        </v-chip>
      </template>

      <!-- Custom slot untuk keterangan -->
      <template v-slot:item.keterangan="{ item }">
        <span v-if="item.keterangan" class="text-green font-weight-medium">
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
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ filteredTotal }} entries
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

// Filter items based on search
const filteredItems = computed(() => {
  if (!search.value) {
    return props.items;
  }
  
  const searchLower = search.value.toLowerCase();
  return props.items.filter(item => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });
});

const filteredTotal = computed(() => filteredItems.value.length);
const totalPages = computed(() => Math.ceil(filteredTotal.value / itemsPerPage.value));

// Paginate the filtered items
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const currentPageStart = computed(() => {
  if (filteredTotal.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const currentPageEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredTotal.value);
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
    case 'Aktif':
      return 'success';
    case 'Menunggu':
      return 'warning';
    default:
      return 'grey';
  }
};

// Method untuk mendapatkan warna klinik
const getKlinikColor = (klinik) => {
  switch (klinik) {
    case 'KANDUNGAN':
      return 'pink';
    case 'IPD':
      return 'blue';
    case 'THT':
      return 'orange';
    case 'SARAF':
      return 'purple';
    default:
      return 'grey';
  }
};

// Method untuk mendapatkan class title
const getTitleClass = (title) => {
  if (title.includes('TERLAMBAT')) {
    return 'text-warning';
  } else if (title.includes('PENDING')) {
    return 'text-info';
  } else if (title.includes('DI LOKET')) {
    return 'text-success';
  }
  return 'text-primary';
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
  color: #f44336 !important;
}

.text-warning {
  color: #ff9800 !important;
}

.text-info {
  color: #2196f3 !important;
}

.text-success {
  color: #4caf50 !important;
}

.text-primary {
  color: #1976d2 !important;
}

.font-mono {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

/* Table enhancements */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table tbody tr) {
  transition: background-color 0.2s ease;
}

:deep(.v-data-table tbody tr:hover) {
  background: rgba(25, 118, 210, 0.04) !important;
}

:deep(.v-data-table th) {
  font-weight: 600 !important;
  background: #fafafa !important;
  color: #424242 !important;
}

:deep(.v-data-table td) {
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.v-data-table) {
    font-size: 0.875rem;
  }
  
  .v-pagination {
    :deep(.v-pagination__item) {
      min-width: 32px;
      height: 32px;
    }
  }
}
</style>