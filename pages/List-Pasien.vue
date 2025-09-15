<template>
  <div class="pasien-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-account-group</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">List Pasien</h1>
            <p class="page-subtitle">Senin, 15 September 2025 - Data Master Pasien</p>
          </div>
        </div>
        <div class="header-right">
          <v-chip
            color="success"
            variant="flat"
            class="mr-2"
          >
            Total {{ pasienData.length }} Pasien
          </v-chip>
          <v-chip
            color="white"
            variant="flat"
            class="text-primary"
          >
            Status: Aktif
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Filter Controls
    <v-card class="filter-controls-card mb-4" elevation="2">
      <v-card-text class="py-4">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center flex-wrap gap-10">
              <span class="text-subtitle-1 font-weight-medium">Filter Cepat:</span>
              <v-btn
                color="primary"
                variant="flat"
                size="default"
                class="px-4"
                @click="filterByStatus('Tunggu Daftar')"
              >
                <v-icon start size="16">mdi-clock-outline</v-icon>
                Tunggu Daftar
              </v-btn>
              <v-btn
                color="success"
                variant="flat"
                size="default"
                class="px-4"
                @click="filterByStatus('Selesai')"
              >
                <v-icon start size="16">mdi-check-circle</v-icon>
                Selesai
              </v-btn>
              <v-btn
                color="warning"
                variant="flat"
                size="default"
                class="px-4"
                @click="filterByKlinik('JKN')"
              >
                <v-icon start size="16">mdi-card-account-details</v-icon>
                JKN
              </v-btn>
              <v-btn
                color="info"
                variant="flat"
                size="default"
                class="px-4"
                @click="resetFilter()"
              >
                <v-icon start size="16">mdi-refresh</v-icon>
                Reset
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex justify-end gap-2">
              <v-btn
                color="success"
                variant="flat"
                @click="handleExportLaporan"
                :loading="loading"
              >
                <v-icon start>mdi-file-excel</v-icon>
                Export Laporan
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="handleExportLaporanPerKlinik"
                :loading="loading"
              >
                <v-icon start>mdi-hospital-building</v-icon>
                Export Per Klinik
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card> -->

    <!-- Main Patients Table -->
    <v-card class="main-table-card mb-4" elevation="2">
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-table</v-icon>
          <span class="text-h6 font-weight-bold">DATA PASIEN</span>
        </div>
        <v-chip color="info" variant="flat">
          {{ filteredData.length }} dari {{ pasienData.length }} pasien
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <TabelListPasien
        :items="filteredData"
        @search="handleSearch"
        @export-laporan="handleExportLaporan"
        @export-laporan-per-klinik="handleExportLaporanPerKlinik"
      />
    </v-card>

    Statistics Cards
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="text-center pa-4">
            <v-icon size="40" color="success" class="mb-2">mdi-account-check</v-icon>
            <div class="text-h4 font-weight-bold text-success">{{ getStatsByStatus('Tunggu Daftar') }}</div>
            <div class="text-body-2 text-grey-darken-1">Tunggu Daftar</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="text-center pa-4">
            <v-icon size="40" color="info" class="mb-2">mdi-barcode</v-icon>
            <div class="text-h4 font-weight-bold text-info">{{ getStatsByStatus('Barcode') }}</div>
            <div class="text-body-2 text-grey-darken-1">Barcode</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="text-center pa-4">
            <v-icon size="40" color="warning" class="mb-2">mdi-wifi</v-icon>
            <div class="text-h4 font-weight-bold text-warning">{{ getStatsByKeterangan('Online') }}</div>
            <div class="text-body-2 text-grey-darken-1">Online</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="text-center pa-4">
            <v-icon size="40" color="error" class="mb-2">mdi-wifi-off</v-icon>
            <div class="text-h4 font-weight-bold text-error">{{ getStatsByKeterangan('Offline') }}</div>
            <div class="text-body-2 text-grey-darken-1">Offline</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          icon
          @click="snackbar.show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TabelListPasien from '~/components/TabelListPasien.vue'

// Meta untuk SEO
definePageMeta({
  title: 'List Pasien',
  layout: 'default'
})

// Reactive states
const loading = ref(false)
const currentFilter = ref('')
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Sample data
const pasienData = ref([
  {
    tglPeriksa: '27/08/2025',
    nik: '3507264104730004',
    rm: '11412584',
    barcode: '250627100001',
    noAntrian: 'HQ1001',
    klinik: 'HOM',
    fullName: 'Binti Almatul',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '3504096063630001',
    rm: '',
    barcode: '250627100002',
    noAntrian: 'QB1001',
    klinik: 'KANDUNGAN',
    fullName: 'maret kumalal',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '3507114102250002',
    rm: '11555560',
    barcode: '250627100003',
    noAntrian: 'QB1002',
    klinik: 'KANDUNGAN',
    fullName: 'ayu rafti lelu amanda',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '3508185040150002',
    rm: '11333655',
    barcode: '250627100004',
    noAntrian: 'AN1001',
    klinik: 'ANAK',
    fullName: 'Erin Wahyuni',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '3515085040110004',
    rm: '11585554',
    barcode: '250627100005',
    noAntrian: 'IP1001',
    klinik: 'IPD',
    fullName: 'Yohana Karina Pusplta Sari',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '3506246105750002',
    rm: '11527608',
    barcode: '250627100006',
    noAntrian: 'IP1001',
    klinik: 'IPD',
    fullName: 'Elok Suharsti',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Online',
    status: 'Tunggu Daftar'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '',
    rm: '',
    barcode: '250627100007',
    noAntrian: 'HQ1002',
    klinik: 'HOM',
    fullName: '',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Offline',
    status: 'Barcode'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '',
    rm: '',
    barcode: '250627100008',
    noAntrian: 'IP1002',
    klinik: 'IPD',
    fullName: '',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Offline',
    status: 'Barcode'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '',
    rm: '',
    barcode: '250627100009',
    noAntrian: 'IP1001',
    klinik: 'IPD',
    fullName: '',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Offline',
    status: 'Barcode'
  },
  {
    tglPeriksa: '27/08/2025',
    nik: '',
    rm: '',
    barcode: '250627100010',
    noAntrian: 'IP1001',
    klinik: 'IPD',
    fullName: '',
    shift: 'Shift 1',
    pembayaran: 'JKN',
    keterangan: 'Offline',
    status: 'Barcode'
  }
])

// Computed properties
const filteredData = computed(() => {
  if (!currentFilter.value) {
    return pasienData.value
  }
  
  return pasienData.value.filter(item => {
    return item.status === currentFilter.value || 
           item.pembayaran === currentFilter.value ||
           item.keterangan === currentFilter.value
  })
})

// Methods
const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

const filterByStatus = (status) => {
  currentFilter.value = status
  showSnackbar(`Filter diterapkan: ${status}`, 'info')
}

const filterByKlinik = (pembayaran) => {
  currentFilter.value = pembayaran
  showSnackbar(`Filter diterapkan: ${pembayaran}`, 'info')
}

const resetFilter = () => {
  currentFilter.value = ''
  showSnackbar('Filter direset', 'success')
}

const getStatsByStatus = (status) => {
  return pasienData.value.filter(item => item.status === status).length
}

const getStatsByKeterangan = (keterangan) => {
  return pasienData.value.filter(item => item.keterangan === keterangan).length
}

const handleSearch = async (filters) => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Search filters:', filters)
    showSnackbar('Data berhasil difilter', 'success')
  } catch (error) {
    console.error('Error searching data:', error)
    showSnackbar('Gagal memfilter data', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportLaporan = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Exporting laporan pasien...')
    showSnackbar('Laporan pasien berhasil diexport', 'success')
  } catch (error) {
    console.error('Error exporting laporan:', error)
    showSnackbar('Gagal export laporan pasien', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportLaporanPerKlinik = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Exporting laporan pasien per klinik...')
    showSnackbar('Laporan pasien per klinik berhasil diexport', 'success')
  } catch (error) {
    console.error('Error exporting laporan per klinik:', error)
    showSnackbar('Gagal export laporan pasien per klinik', 'error')
  } finally {
    loading.value = false
  }
}

const fetchPasienData = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Patient data loaded successfully')
  } catch (error) {
    console.error('Error fetching patient data:', error)
    showSnackbar('Gagal memuat data pasien', 'error')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchPasienData()
})

// Head untuk SEO
useHead({
  title: 'List Pasien - Antrean RSSA',
  meta: [
    {
      name: 'description',
      content: 'Daftar master data seluruh pasien rumah sakit'
    }
  ]
})
</script>

<style scoped>
.pasien-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
}

.page-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  margin-right: 20px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* .filter-controls-card, */
.main-table-card,
.stats-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-card {
  transition: all 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Enhanced table styling */
.main-table-card :deep(.v-data-table th) {
  background: #fafbfc;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.main-table-card :deep(.v-data-table tbody tr:hover) {
  background: #f8fafc !important;
}

.main-table-card :deep(.v-data-table tbody td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
}

/* Button styling */
.v-btn {
  text-transform: none !important;
  font-weight: 500;
}

.v-btn--size-default {
  height: 40px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .pasien-container {
    padding: 16px;
  }
  
  .header-content {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-icon {
    padding: 12px;
  }

  /* .filter-controls-card .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  } */

  .filter-controls-card .v-col:last-child .d-flex {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 20px;
  }
  
  .filter-buttons-container {
    justify-content: center;
  }
  
  .filter-btn {
    margin-right: 12px;
    margin-bottom: 10px;
  }

  .header-right .v-chip {
    font-size: 12px;
  }
}
</style>