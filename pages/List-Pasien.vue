<template>
  <div>
    <!-- Page Header -->
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-6">List Pasien</h1>
        </v-col>
      </v-row>

      <!-- Main Content Card -->
      <v-card elevation="2">
        <v-card-text class="pa-6">
          <TabelListPasien
            :items="pasienData"
            @search="handleSearch"
            @export-laporan="handleExportLaporan"
            @export-laporan-per-klinik="handleExportLaporanPerKlinik"
          />
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import TabelListPasien from '~/components/TabelListPasien.vue'

// Meta untuk SEO
definePageMeta({
  title: 'List Pasien',
  layout: 'default'
})

// Reactive states
const loading = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Sample data (replace with actual API call)
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

// Methods
const handleSearch = async (filters) => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically call your API with filters
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
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would typically call your export API
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
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would typically call your export API
    console.log('Exporting laporan pasien per klinik...')
    
    showSnackbar('Laporan pasien per klinik berhasil diexport', 'success')
  } catch (error) {
    console.error('Error exporting laporan per klinik:', error)
    showSnackbar('Gagal export laporan pasien per klinik', 'error')
  } finally {
    loading.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

const fetchPasienData = async () => {
  loading.value = true
  
  try {
    // Simulate API call to fetch patient data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically call your API
    // const response = await $fetch('/api/pasien')
    // pasienData.value = response.data
    
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
/* Custom styles if needed */
</style>