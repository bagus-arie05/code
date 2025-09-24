<!-- pages/FastTrack.vue -->
<template>
  <div class="fast-track-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-flash</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">Fast Track</h1>
            <p class="page-subtitle">Manajemen Pasien Jalur Cepat</p>
          </div>
        </div>
        <div class="header-right">
          <!-- <v-chip
            :color="isLiveMode ? 'success' : 'warning'"
            variant="flat"
            class="mr-3"
          >
            <v-icon start>{{ isLiveMode ? 'mdi-circle' : 'mdi-circle-outline' }}</v-icon>
            {{ isLiveMode ? 'Live Mode' : 'Offline Mode' }}
          </v-chip> -->
          <!-- <v-btn
            color="white"
            variant="flat"
            prepend-icon="mdi-qrcode-scan"
            @click="openScanDialog"
            class="text-primary"
          >
            Scan Barcode
          </v-btn> -->
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <!-- <div class="stats-section">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <StatCard
            title="Total Pasien"
            :value="totalPatients"
            icon="mdi-account-group"
            color="primary"
            trend="+12%"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <StatCard
            title="Tunggu Daftar"
            :value="waitingCount"
            icon="mdi-clock-outline"
            color="warning"
            :urgent="waitingCount > 10"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <StatCard
            title="Proses Barcode"
            :value="barcodeCount"
            icon="mdi-qrcode"
            color="info"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <StatCard
            title="Selesai Hari Ini"
            :value="completedCount"
            icon="mdi-check-circle"
            color="success"
          />
        </v-col>
      </v-row>
    </div> -->

    <!-- Additional Controls -->
    <v-card class="controls-card mb-4" elevation="2">
      <v-card-text class="py-3">
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="d-flex align-center flex-wrap gap-3">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Filter Status"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                style="min-width: 160px;"
              />
              
              <v-select
                v-model="selectedShift"
                :items="shiftOptions"
                label="Filter Shift"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                style="min-width: 120px;"
              />

              <v-select
                v-model="selectedKlinik"
                :items="klinikOptions"
                label="Filter Klinik"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                style="min-width: 140px;"
              />
            </div>
          </v-col>
          
          <v-col cols="12" md="6">
            <div class="d-flex justify-end align-center flex-wrap gap-2">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="refreshData"
                :loading="loading"
                size="small"
              >
                Refresh
              </v-btn>
              
              <v-btn
                variant="outlined"
                prepend-icon="mdi-export"
                @click="exportData"
                size="small"
              >
                Export
              </v-btn>

              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addNewPatient"
                size="small"
              >
                Tambah Pasien
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Menggunakan TabelData Component yang sudah ada -->
    <v-card elevation="2" class="main-table-card">
      <TabelData
        :headers="enhancedHeaders"
        :items="filteredItems"
        :title="tableTitle"
        :show-search="true"
      >
        <!-- Custom Actions Slot -->
        <template #actions="{ item }">
          <div class="action-buttons">
            <!-- Quick Status Update Buttons -->
            <v-btn
              v-if="item.status === 'Tunggu Daftar'"
              icon
              size="small"
              variant="text"
              color="info"
              @click="updateStatus(item, 'Proses Barcode')"
              v-tooltip="'Proses Barcode'"
            >
              <v-icon>mdi-qrcode</v-icon>
            </v-btn>

            <v-btn
              v-if="item.status === 'Proses Barcode'"
              icon
              size="small"
              variant="text"
              color="success"
              @click="updateStatus(item, 'Selesai')"
              v-tooltip="'Tandai Selesai'"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            
            <!-- View Details -->
            <v-btn
              icon
              size="small"
              variant="text"
              color="primary"
              @click="viewDetails(item)"
              v-tooltip="'Lihat Detail'"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            
            <!-- Track Patient -->
            <v-btn
              icon
              size="small"
              variant="text"
              color="info"
              @click="trackPatient(item)"
              v-tooltip="'Track Pasien'"
            >
              <v-icon>mdi-map-marker-path</v-icon>
            </v-btn>
            
            <!-- More Actions Menu -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  v-bind="props"
                  v-tooltip="'Aksi Lainnya'"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              
              <v-list density="compact">
                <v-list-item @click="copyBarcode(item.barcode)">
                  <v-list-item-title>
                    <v-icon start size="16">mdi-content-copy</v-icon>
                    Copy Barcode
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="printLabel(item)">
                  <v-list-item-title>
                    <v-icon start size="16">mdi-printer</v-icon>
                    Print Label
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="editPatient(item)">
                  <v-list-item-title>
                    <v-icon start size="16">mdi-pencil</v-icon>
                    Edit Data
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="cancelPatient(item)" class="text-error">
                  <v-list-item-title>
                    <v-icon start size="16">mdi-close</v-icon>
                    Batalkan
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </TabelData>
    </v-card>

    <!-- Barcode Scanner Dialog -->
    <!-- <v-dialog v-model="scanDialog" max-width="500">
      <v-card class="scanner-dialog">
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-icon class="mr-2">mdi-qrcode-scan</v-icon>
          Scan Barcode Pasien
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="scanner-container">
            <div class="scanner-preview">
              <v-icon size="100" color="grey-lighten-1">mdi-qrcode</v-icon>
              <p class="text-center mt-3 text-medium-emphasis">
                Arahkan kamera ke barcode pasien
              </p>
            </div>
            
            <v-text-field
              v-model="manualBarcode"
              label="Atau masukkan barcode manual"
              prepend-icon="mdi-keyboard"
              variant="outlined"
              class="mt-4"
              hint="Contoh: 25090310822"
              persistent-hint
            />
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="scanDialog = false" variant="text">
            Batal
          </v-btn>
          <v-btn 
            color="primary" 
            @click="processBarcode"
            :disabled="!manualBarcode"
            variant="flat"
          >
            Proses Barcode
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- Patient Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="800">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-account-details</v-icon>
          Detail Pasien
        </v-card-title>
        
        <v-card-text v-if="selectedPatient" class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Barcode</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold text-primary">
                    {{ selectedPatient.barcode }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">No Antrian</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedPatient.noAntrian }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Rekam Medis</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedPatient.rm }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Klinik Tujuan</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="small" :color="getKlinikColor(selectedPatient.klinik)">
                      {{ selectedPatient.klinik }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip :color="getStatusColor(selectedPatient.status)" size="small">
                      {{ selectedPatient.status }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Shift</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedPatient.shift }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Pembayaran</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedPatient.pembayaran }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Keterangan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ selectedPatient.keterangan || '-' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="detailDialog = false" variant="text">
            Tutup
          </v-btn>
          <v-btn color="primary" @click="printPatientDetail" variant="flat">
            Print Detail
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top right"
    >
      {{ snackbarText }}
      
      <template v-slot:actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TabelData from '@/components/TabelData.vue'

// Stats Card Component
const StatCard = {
  props: ['title', 'value', 'icon', 'color', 'trend', 'urgent'],
  template: `
    <v-card 
      :class="{ 'urgent-card': urgent }" 
      class="stat-card" 
      elevation="2"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-subtitle-2 text-medium-emphasis">{{ title }}</div>
            <div class="text-h5 font-weight-bold mt-1" :class="urgent ? 'text-warning' : ''">
              {{ value }}
            </div>
            <div v-if="trend" class="text-caption text-success mt-1">
              <v-icon size="12">mdi-trending-up</v-icon>
              {{ trend }}
            </div>
          </div>
          <v-avatar :color="color" variant="tonal" size="48">
            <v-icon>{{ icon }}</v-icon>
          </v-avatar>
        </div>
      </v-card-text>
    </v-card>
  `
}

// Reactive data
const loading = ref(false)
const selectedStatus = ref(null)
const selectedShift = ref(null)
const selectedKlinik = ref(null)
const scanDialog = ref(false)
const detailDialog = ref(false)
const manualBarcode = ref('')
const selectedPatient = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const isLiveMode = ref(true)

// Sample data (dalam implementasi nyata, ini dari API)
const items = ref([
  {
    id: 1,
    barcode: '25090310822',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'AN1113',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'ANAK',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 2,
    barcode: '25090310831',
    tanggal: '03-09-2025 / 06:51',
    noAntrian: 'BD1147',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'BEDAH',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Proses Barcode'
  },
  {
    id: 3,
    barcode: '25090310830',
    tanggal: '03-09-2025 / 06:51',
    noAntrian: 'BD1146',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'BEDAH',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 4,
    barcode: '25090310829',
    tanggal: '03-09-2025 / 06:51',
    noAntrian: 'TH1022',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'THT',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 5,
    barcode: '25090310828',
    tanggal: '03-09-2025 / 06:50',
    noAntrian: 'OB1045',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'KANDUNGAN',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 6,
    barcode: '25090310827',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'IP1036',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'IPD',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 7,
    barcode: '25090310826',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'OB1044',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'KANDUNGAN',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 8,
    barcode: '25090310825',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'MT1067',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'MATA',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 9,
    barcode: '25090310824',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'JT1072',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'JANTUNG',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar'
  },
  {
    id: 10,
    barcode: '25090310823',
    tanggal: '03-09-2025 / 06:49',
    noAntrian: 'MT1066',
    rm: 'JKN',
    shift: 'Shift 1',
    klinik: 'MATA',
    pj: 'JKN',
    keterangan: 'Tunggu Daftar',
    pembayaran: 'JKN',
    status: 'Selesai'
  }
])

// Enhanced headers untuk TabelData component
const enhancedHeaders = ref([
  { title: 'No', value: 'no', sortable: false, width: '60px' },
  { title: 'Barcode', value: 'barcode', sortable: true, width: '140px' },
  { title: 'Tanggal / Jam Daftar', value: 'tanggal', sortable: true, width: '160px' },
  { title: 'No Antrian', value: 'noAntrian', sortable: true, width: '110px' },
  { title: 'RM', value: 'rm', sortable: true, width: '80px' },
  { title: 'Shift', value: 'shift', sortable: true, width: '90px' },
  { title: 'Klinik', value: 'klinik', sortable: true, width: '120px' },
  { title: 'PJ', value: 'pj', sortable: true, width: '80px' },
  { title: 'Keterangan', value: 'keterangan', sortable: false, width: '120px' },
  { title: 'Pembayaran', value: 'pembayaran', sortable: true, width: '100px' },
  { title: 'Status', value: 'status', sortable: true, width: '140px' },
  { title: 'Aksi', value: 'aksi', sortable: false, width: '140px' }
])

// Options
const statusOptions = [
  'Tunggu Daftar',
  'Proses Barcode',
  'Selesai',
  'Batal'
]

const shiftOptions = [
  'Shift 1',
  'Shift 2',
  'Shift 3'
]

const klinikOptions = [
  'ANAK',
  'BEDAH',
  'THT',
  'KANDUNGAN',
  'IPD',
  'MATA',
  'JANTUNG'
]

// Computed properties
const filteredItems = computed(() => {
  let filtered = items.value

  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  if (selectedShift.value) {
    filtered = filtered.filter(item => item.shift === selectedShift.value)
  }

  if (selectedKlinik.value) {
    filtered = filtered.filter(item => item.klinik === selectedKlinik.value)
  }

  return filtered
})

const tableTitle = computed(() => {
  const totalFiltered = filteredItems.value.length
  const totalAll = items.value.length
  
  if (totalFiltered !== totalAll) {
    return `Fast Track - ${totalFiltered} dari ${totalAll} pasien`
  }
  
  return `Fast Track - ${totalAll} pasien`
})

const totalPatients = computed(() => items.value.length)
const waitingCount = computed(() => items.value.filter(item => item.status === 'Tunggu Daftar').length)
const barcodeCount = computed(() => items.value.filter(item => item.status === 'Proses Barcode').length)
const completedCount = computed(() => items.value.filter(item => item.status === 'Selesai').length)

// Methods
const getStatusColor = (status) => {
  const colors = {
    'Tunggu Daftar': 'warning',
    'Proses Barcode': 'info',
    'Selesai': 'success',
    'Batal': 'error'
  }
  return colors[status] || 'grey'
}

const getKlinikColor = (klinik) => {
  const colors = {
    'ANAK': 'pink',
    'BEDAH': 'blue',
    'THT': 'green',
    'KANDUNGAN': 'purple',
    'IPD': 'orange',
    'MATA': 'teal',
    'JANTUNG': 'red'
  }
  return colors[klinik] || 'grey'
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const openScanDialog = () => {
  scanDialog.value = true
  manualBarcode.value = ''
}

// const processBarcode = () => {
//   if (manualBarcode.value) {
//     // Simulasi proses barcode
//     const existingPatient = items.value.find(item => item.barcode === manualBarcode.value)
    
//     if (existingPatient) {
//       showSnackbar(`Barcode ${manualBarcode.value} ditemukan - Status: ${existingPatient.status}`, 'info')
//       selectedPatient.value = existingPatient
//       detailDialog.value = true
//     } else {
//       showSnackbar(`Barcode ${manualBarcode.value} tidak ditemukan`, 'warning')
//     }
    
//     scanDialog.value = false
//   }
// }

const copyBarcode = async (barcode) => {
  try {
    await navigator.clipboard.writeText(barcode)
    showSnackbar('Barcode berhasil disalin', 'success')
  } catch (error) {
    showSnackbar('Gagal menyalin barcode', 'error')
  }
}

const refreshData = () => {
  loading.value = true
  // Simulasi refresh data
  setTimeout(() => {
    loading.value = false
    showSnackbar('Data berhasil diperbarui', 'success')
    // Update live mode status
    isLiveMode.value = Math.random() > 0.3 // 70% chance live mode
  }, 1500)
}

const exportData = () => {
  showSnackbar('Export data dimulai...', 'info')
  // Implementasi export logic
}

const addNewPatient = () => {
  showSnackbar('Fitur tambah pasien akan segera hadir', 'info')
}

const viewDetails = (item) => {
  selectedPatient.value = item
  detailDialog.value = true
}

const trackPatient = (item) => {
  showSnackbar(`Tracking pasien ${item.barcode} - ${item.klinik}`, 'info')
}

const updateStatus = (item, newStatus) => {
  const oldStatus = item.status
  item.status = newStatus
  showSnackbar(`Status ${item.barcode} berubah: ${oldStatus} → ${newStatus}`, 'success')
}

const editPatient = (item) => {
  showSnackbar(`Edit data pasien ${item.barcode}`, 'info')
}

const cancelPatient = (item) => {
  if (confirm(`Yakin ingin membatalkan pasien ${item.barcode}?`)) {
    item.status = 'Batal'
    showSnackbar(`Pasien ${item.barcode} dibatalkan`, 'warning')
  }
}

const printLabel = (item) => {
  showSnackbar(`Print label untuk ${item.barcode}`, 'info')
}

const printPatientDetail = () => {
  if (selectedPatient.value) {
    showSnackbar(`Print detail pasien ${selectedPatient.value.barcode}`, 'info')
    detailDialog.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
  
  // Auto refresh setiap 30 detik untuk live mode
  setInterval(() => {
    if (isLiveMode.value) {
      // Simulasi update data real-time
      const randomIndex = Math.floor(Math.random() * items.value.length)
      const randomStatuses = ['Tunggu Daftar', 'Proses Barcode', 'Selesai']
      const randomStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)]
      
      if (items.value[randomIndex] && items.value[randomIndex].status !== 'Selesai') {
        items.value[randomIndex].status = randomStatus
      }
    }
  }, 30000)
})
</script>

<style scoped>
.fast-track-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
}

.page-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
  overflow: hidden;
  position: relative;
}
/* 
.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgb(236, 216, 216) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
} */

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  color: white;
  position: relative;
  z-index: 2;
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
  gap: 12px;
}

/* .stats-section {
  margin-bottom: 24px;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(188, 245, 54, 0.15);
} */

.urgent-card {
  border-left: 5px solid #ff9800;
  animation: urgent-pulse 2s infinite;
}

@keyframes urgent-pulse {
  0%, 100% { 
    border-left-color: #ff9800; 
    box-shadow: 0 4px 20px rgba(255, 152, 0, 0.2);
  }
  50% { 
    border-left-color: #ff5722; 
    box-shadow: 0 4px 20px rgba(255, 87, 34, 0.4);
  }
}

.controls-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.main-table-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.scanner-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.scanner-container {
  text-align: center;
}

.scanner-preview {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
  border-radius: 16px;
  padding: 48px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.scanner-preview:hover {
  border-color: #1976d2;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* Enhanced table styling untuk override TabelData component */
.main-table-card :deep(.v-card-text) {
  padding: 0;
}

.main-table-card :deep(.v-data-table) {
  border-radius: 0;
}

.main-table-card :deep(.v-data-table .v-data-table__wrapper) {
  border-radius: 0;
}

.main-table-card :deep(.v-data-table th) {
  background: #fafbfc;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  height: 56px;
}

.main-table-card :deep(.v-data-table tbody tr) {
  transition: all 0.2s ease;
}

.main-table-card :deep(.v-data-table tbody tr:hover) {
  background: #f8fafc !important;
  /* transform: scale(1.001); */
  box-shadow: 0 2px 8px rgba(248, 34, 34, 0.08);
}

.main-table-card :deep(.v-data-table tbody td) {
  padding: 12px 16px;   
  border-bottom: 1px solid #f1f5f9;
}

/* Custom styling untuk status chips */
.main-table-card :deep(.v-chip.v-chip--size-small) {
  font-weight: 600;
  border-radius: 8px;
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
  .fast-track-container {
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
  
  /* Hide beberapa columns pada mobile */
  .main-table-card :deep(.v-data-table th:nth-child(5)),
  .main-table-card :deep(.v-data-table td:nth-child(5)),
  .main-table-card :deep(.v-data-table th:nth-child(6)),
  .main-table-card :deep(.v-data-table td:nth-child(6)),
  .main-table-card :deep(.v-data-table th:nth-child(8)),
  .main-table-card :deep(.v-data-table td:nth-child(8)),
  .main-table-card :deep(.v-data-table th:nth-child(10)),
  .main-table-card :deep(.v-data-table td:nth-child(10)) {
    display: none;
  }
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }
  
  /* Show only essential columns on very small screens */
  .main-table-card :deep(.v-data-table th:nth-child(4)),
  .main-table-card :deep(.v-data-table td:nth-child(4)),
  .main-table-card :deep(.v-data-table th:nth-child(9)),
  .main-table-card :deep(.v-data-table td:nth-child(9)) {
    display: none;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .fast-track-container {
    background: #ffffff;
  }
  
  .stat-card,
  .controls-card,
  .main-table-card {
    background: "grey-lighten-4";
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .main-table-card :deep(.v-data-table th) {
    background: "grey-lighten-4";
    color: #e0e0e0;
    border-color: rgba(197, 197, 197, 0.1);
  }
  
  .main-table-card :deep(.v-data-table tbody tr:hover) {
    background: "grey-lighten-4" !important;
  }
}

/* Loading animations */
.main-table-card :deep(.v-data-table .v-data-table__loading) {
  background: linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.1), transparent);
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Print styles */
@media print {
  .fast-track-container {
    background: white;
    padding: 0;
  }
  
  .page-header,
  .stats-section,
  .controls-card {
    display: none;
  }
  
  .main-table-card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .action-buttons {
    display: none;
  }
}
</style>