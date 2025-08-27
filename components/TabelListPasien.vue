<template>
  <div>
    <!-- Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filterDate"
          type="date"
          label="Tanggal"
          density="compact"
          hide-details
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Status"
          density="compact"
          hide-details
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center gap-2">
        <v-btn color="primary" @click="searchData">
          Search
        </v-btn>
        <v-btn color="success" variant="outlined" @click="exportLaporan">
          Laporan Pasien
        </v-btn>
        <v-btn color="info" variant="outlined" @click="exportLaporanPerKlinik">
          Laporan Pasien Per Klinik
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table Controls -->
    <v-row class="mb-3">
      <v-col cols="12" md="6" class="d-flex align-center">
        <span class="mr-2">Show</span>
        <v-select
          v-model="itemsPerPage"
          :items="[10, 25, 50, 100]"
          density="compact"
          hide-details
          style="width: 80px"
          variant="outlined"
        />
        <span class="ml-2">entries</span>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <div class="d-flex align-center">
          <span class="mr-2">Search:</span>
          <v-text-field
            v-model="search"
            density="compact"
            hide-details
            style="min-width: 200px"
            variant="outlined"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="paginatedItems"
      :search="search"
      hide-default-footer
      class="elevation-1"
    >
      <!-- Custom Status Column -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Custom Keterangan Column -->
      <template v-slot:item.keterangan="{ item }">
        <span :class="getKeteranganClass(item.keterangan)">
          {{ item.keterangan }}
        </span>
      </template>

      <!-- No Data -->
      <template #no-data>
        <div class="text-center pa-4">
          No data available in table
        </div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div class="d-flex justify-space-between align-center pa-4">
      <div class="text-body-2 text-grey-darken-1">
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalFilteredItems }} entries
      </div>
      <div class="d-flex align-center">
        <v-btn
          :disabled="currentPage === 1"
          @click="previousPage"
          variant="text"
          size="small"
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
        >
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'export-laporan', 'export-laporan-per-klinik'])

// Filter states
const filterDate = ref('')
const filterStatus = ref('Semua')
const search = ref('')

// Pagination states
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Status options
const statusOptions = ['Semua', 'Online', 'Offline', 'Tunggu Daftar', 'Barcode']

// Table headers
const headers = [
  { title: 'No', key: 'no', sortable: false, width: '60px' },
  { title: 'Tgl Periksa', key: 'tglPeriksa', sortable: true },
  { title: 'NIK', key: 'nik', sortable: true },
  { title: 'RM', key: 'rm', sortable: true },
  { title: 'Barcode', key: 'barcode', sortable: true },
  { title: 'No Antrian', key: 'noAntrian', sortable: true },
  { title: 'Klinik', key: 'klinik', sortable: true },
  { title: 'First Name Last Name', key: 'fullName', sortable: true },
  { title: 'Shift', key: 'shift', sortable: true },
  { title: 'Pembayaran', key: 'pembayaran', sortable: true },
  { title: 'Keterangan', key: 'keterangan', sortable: true },
  { title: 'Status', key: 'status', sortable: true }
]

// Computed properties
const filteredItems = computed(() => {
  let filtered = props.items

  // Filter by date
  if (filterDate.value) {
    filtered = filtered.filter(item => 
      item.tglPeriksa === filterDate.value
    )
  }

  // Filter by status
  if (filterStatus.value && filterStatus.value !== 'Semua') {
    filtered = filtered.filter(item => 
      item.status === filterStatus.value
    )
  }

  return filtered
})

const totalFilteredItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.ceil(totalFilteredItems.value / itemsPerPage.value))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end).map((item, index) => ({
    ...item,
    no: start + index + 1
  }))
})

const currentPageStart = computed(() => 
  totalFilteredItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
)

const currentPageEnd = computed(() => 
  Math.min(currentPage.value * itemsPerPage.value, totalFilteredItems.value)
)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// Methods
const searchData = () => {
  currentPage.value = 1
  emit('search', {
    date: filterDate.value,
    status: filterStatus.value
  })
}

const exportLaporan = () => {
  emit('export-laporan')
}

const exportLaporanPerKlinik = () => {
  emit('export-laporan-per-klinik')
}

const getStatusColor = (status) => {
  const colorMap = {
    'Online': 'success',
    'Offline': 'error', 
    'Tunggu Daftar': 'warning',
    'Barcode': 'info'
  }
  return colorMap[status] || 'default'
}

const getKeteranganClass = (keterangan) => {
  return keterangan === 'Online' ? 'text-success' : ''
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Watchers
watch(itemsPerPage, () => {
  currentPage.value = 1
})

watch([filterDate, filterStatus], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.text-success {
  color: rgb(76, 175, 80) !important;
}
</style>