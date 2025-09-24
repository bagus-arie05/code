<!-- pages/AntrianKlinik.vue -->
<template>
  <div class="antrian-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-clipboard-list</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">Antrian Klinik</h1>
            <p class="page-subtitle">Informasi Antrian Real-time</p>
          </div>
        </div>
        <div class="header-right">
          <div class="time-display">
            <v-chip color="white" variant="flat" size="large" class="time-chip">
              <v-icon start size="16">mdi-clock-outline</v-icon>
              {{ currentTime }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <v-card class="controls-card mb-4" elevation="2">
      <v-card-text class="py-3">
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="d-flex align-center flex-wrap gap-3">
              <v-select
                v-model="selectedClinic"
                :items="clinicOptions"
                label="Pilih Klinik"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                style="min-width: 200px;"
              />
              
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
                :color="autoRefresh ? 'success' : 'grey'"
                :variant="autoRefresh ? 'flat' : 'outlined'"
                prepend-icon="mdi-autorenew"
                @click="toggleAutoRefresh"
                size="small"
              >
                Auto Refresh
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Queue Display -->
    <v-card elevation="2" class="main-content-card">
      <v-card-title class="d-flex align-center pa-4 bg-grey-lighten-4">
        <v-icon class="mr-2">mdi-format-list-numbered</v-icon>
        <span>Antrian Aktif - {{ filteredQueues.length }} antrian</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row>
          <v-col
            v-for="queue in filteredQueues"
            :key="queue.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="pa-2"
          >
            <v-card   
              :class="{
                'queue-card': true,
                'queue-active': queue.status === 'active',
                'queue-waiting': queue.status === 'waiting',
                'queue-completed': queue.status === 'completed',
                'queue-called': queue.status === 'called'
              }"
              elevation="3"
            >
              <v-card-text class="text-center pa-4">
                <!-- Status Chip -->
                <div class="mb-3">
                  <v-chip
                    :color="getStatusColor(queue.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ getStatusText(queue.status) }}
                  </v-chip>
                </div>

                <!-- Queue Number -->
                <div class="queue-number-wrapper mb-3">
                  <div class="queue-number">
                    {{ queue.number }}
                  </div>
                </div>

                <!-- Clinic Info -->
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ queue.clinicName }}
                </h3>

                <!-- Patient Info -->
                <div class="patient-info mb-3">
                  <p class="text-body-2 mb-1">
                    <strong>Pasien:</strong> {{ queue.patientName }}
                  </p>
                  <p class="text-caption text-grey-darken-1 mb-1">
                    <strong>Dokter:</strong> {{ queue.doctorName }}
                  </p>
                  <p class="text-caption text-grey-darken-1">
                    <strong>Estimasi:</strong> {{ queue.estimatedTime }}
                  </p>
                </div>

                <!-- Waiting Info -->
                <div v-if="queue.status === 'waiting'" class="waiting-info">
                  <v-chip
                    size="small"
                    color="orange"
                    variant="outlined"
                    class="mb-2"
                  >
                    Sisa {{ queue.remainingQueue }} antrian
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-if="filteredQueues.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-clipboard-list-outline</v-icon>
          <h3 class="text-h6 mt-4 text-grey-darken-1">Tidak ada antrian yang sesuai filter</h3>
          <p class="text-body-2 text-grey-darken-1">Coba ubah filter pencarian Anda</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Current Queue Display -->
    <v-card class="current-queue-card mt-4" elevation="4" v-if="currentQueue">
      <div class="current-queue-header">
        <v-icon size="24" class="mr-2">mdi-account-voice</v-icon>
        <span class="text-h6">Sedang Dipanggil</span>
      </div>
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <div class="current-number-display mr-4">
                {{ currentQueue.number }}
              </div>
              <div>
                <h3 class="text-h5 font-weight-bold mb-1">{{ currentQueue.patientName }}</h3>
                <p class="text-body-1 mb-1">{{ currentQueue.clinicName }}</p>
                <p class="text-body-2 text-grey-darken-1">Dr. {{ currentQueue.doctorName }}</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
            <v-chip color="success" size="large" variant="flat">
              <v-icon start>mdi-microphone</v-icon>
              DIPANGGIL
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Statistics Card -->
    <v-card class="stats-card mt-4" elevation="2">
      <v-card-title class="d-flex align-center pa-4 bg-info text-white">
        <v-icon class="mr-2">mdi-chart-line</v-icon>
        Statistik Antrian Hari Ini
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="8" md="4" class="text-center">
            <div class="stat-item">
              <div class="stat-number text-primary">{{ statistics.total }}</div>
              <div class="stat-label">Total Antrian</div>
            </div>
          </v-col>
          <v-col cols="8" md="4" class="text-center">
            <div class="stat-item">
              <div class="stat-number text-success">{{ statistics.completed }}</div>
              <div class="stat-label">Selesai</div>
            </div>
          </v-col>
          <v-col cols="8" md="4" class="text-center">
            <div class="stat-item">
              <div class="stat-number text-warning">{{ statistics.waiting }}</div>
              <div class="stat-label">Menunggu</div>
            </div>
          </v-col>
          <!-- <v-col cols="6" md="3" class="text-center">
            <div class="stat-item">
              <div class="stat-number text-error">{{ statistics.avgWaitTime }}</div>
              <div class="stat-label">Rata-rata Tunggu (menit)</div>
            </div>
          </v-col> -->
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: false,
});

// Reactive data
const loading = ref(false)
const selectedClinic = ref(null)
const selectedStatus = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const currentTime = ref('')
const autoRefresh = ref(false)
let autoRefreshInterval = null
let timeInterval = null

// Options - removed all filter options

// Queue data
const queues = ref([
  {
    id: 1,
    number: '026',
    clinicName: 'ANAK',
    patientName: 'Ahmad Fauzi',
    doctorName: 'Dr. Sarah Putri',
    status: 'waiting',
    estimatedTime: '10:30',
    remainingQueue: 3
  },
  {
    id: 2,
    number: '018',
    clinicName: 'JANTUNG',
    patientName: 'Siti Aminah',
    doctorName: 'Dr. Budi Santoso',
    status: 'called',
    estimatedTime: '10:15',
    remainingQueue: 0
  },
  {
    id: 3,
    number: '019',
    clinicName: 'MATA',
    patientName: 'Rudi Hartono',
    doctorName: 'Dr. Maya Sari',
    status: 'active',
    estimatedTime: '10:20',
    remainingQueue: 0
  },
  {
    id: 4,
    number: '020',
    clinicName: 'GIGI DAN MULUT',
    patientName: 'Dewi Lestari',
    doctorName: 'Dr. Agus Wijaya',
    status: 'waiting',
    estimatedTime: '10:40',
    remainingQueue: 5
  },
  {
    id: 5,
    number: '021',
    clinicName: 'IPD',
    patientName: 'Bambang Susilo',
    doctorName: 'Dr. Rina Handayani',
    status: 'waiting',
    estimatedTime: '10:50',
    remainingQueue: 7
  },
  {
    id: 6,
    number: '022',
    clinicName: 'THT',
    patientName: 'Lisa Permata',
    doctorName: 'Dr. Hendra Gunawan',
    status: 'waiting',
    estimatedTime: '11:00',
    remainingQueue: 2
  },
  {
    id: 7,
    number: '015',
    clinicName: 'BEDAH',
    patientName: 'Eko Prasetyo',
    doctorName: 'Dr. Diana Sari',
    status: 'completed',
    estimatedTime: '09:30',
    remainingQueue: 0
  }
])

// Current queue (being called)
const currentQueue = ref({
  number: '018',
  clinicName: 'JANTUNG',
  patientName: 'Siti Aminah',
  doctorName: 'Budi Santoso'
})

// Statistics
const statistics = ref({
  total: 45,
  completed: 18,
  waiting: 22,
  avgWaitTime: 25
})

// Computed properties
const filteredQueues = computed(() => {
  let filtered = queues.value

  if (selectedClinic.value) {
    filtered = filtered.filter(queue => queue.clinicName === selectedClinic.value)
  }

  if (selectedStatus.value) {
    const statusMap = {
      'Menunggu': 'waiting',
      'Dipanggil': 'called',
      'Aktif': 'active',
      'Selesai': 'completed'
    }
    const statusFilter = statusMap[selectedStatus.value]
    filtered = filtered.filter(queue => queue.status === statusFilter)
  }

  return filtered
})

// Methods
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const getStatusColor = (status) => {
  const colors = {
    'waiting': 'orange',
    'called': 'info',
    'active': 'success',
    'completed': 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    'waiting': 'MENUNGGU',
    'called': 'DIPANGGIL',
    'active': 'AKTIF',
    'completed': 'SELESAI'
  }
  return texts[status] || 'UNKNOWN'
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSnackbar('Data antrian berhasil diperbarui', 'success')
  }, 1000)
}

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  
  if (autoRefresh.value) {
    autoRefreshInterval = setInterval(() => {
      refreshData()
    }, 30000) // Refresh every 30 seconds
    showSnackbar('Auto refresh diaktifkan (30 detik)', 'info')
  } else {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
      autoRefreshInterval = null
    }
    showSnackbar('Auto refresh dinonaktifkan', 'warning')
  }
}

// Lifecycle
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  refreshData()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }
})
</script>

<style scoped>
.antrian-container {
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

.time-chip {
  font-weight: 600;
  color: #1976d2 !important;
}

.controls-card,
.main-content-card,
.current-queue-card,
.stats-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.queue-card {
  border-radius: 16px !important;
  height: 280px;
  background: white;
  transition: all 0.3s ease;
}

.queue-waiting {
  border-left: 6px solid #FF9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.queue-called {
  border-left: 6px solid #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  animation: pulse 2s infinite;
}

.queue-active {
  border-left: 6px solid #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.queue-completed {
  border-left: 6px solid #9E9E9E;
  opacity: 0.8;
}

.queue-number-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16px;
}

.queue-number {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.4);
}

.patient-info {
  text-align: left;
}

.current-queue-card {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.current-queue-header {
  background: rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  color: white;
  font-weight: 600;
}

.current-number-display {
  background: white;
  color: #4CAF50;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.stats-card .stat-item {
  padding: 16px 0;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  50% {
    box-shadow: 0 8px 20px rgba(33, 150, 243, 0.6);
  }
  100% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
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
  .antrian-container {
    padding: 16px;
  }
  
  .header-content {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .queue-card {
    height: 260px;
  }

  .queue-number {
    width: 70px;
    height: 70px;
    font-size: 20px;
  }

  .current-number-display {
    width: 80px;
    height: 80px;
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .queue-card {
    height: 300px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 24px;
  }

  .queue-number {
    width: 90px;
    height: 90px;
    font-size: 24px;
  }

  .current-number-display {
    width: 100px;
    height: 100px;
    font-size: 32px;
  }
}
</style>