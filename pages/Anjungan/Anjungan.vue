<!-- pages/Anjungan.vue -->
<template>
  <div class="anjungan-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-hospital-building</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">Anjungan RSSA</h1>
            <p class="page-subtitle">Pilih Klinik untuk Pendaftaran</p>
          </div>
        </div>
        <div class="header-right">
          <v-chip color="white" variant="flat" class="instruction-chip">
            <v-icon start size="16">mdi-information</v-icon>
            Hijau: Tersedia | Merah: Tutup/Penuh
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <!-- <v-card class="controls-card mb-4" elevation="2">
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
              
              <v-text-field
                v-model="searchQuery"
                label="Cari Klinik"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                hide-details
                clearable
                style="min-width: 200px;"
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
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card> -->

    <!-- Clinic Cards -->
    <v-card elevation="2" class="main-content-card">
      <!-- <v-card-title class="d-flex align-center pa-4 bg-grey-lighten-4">
        <v-icon class="mr-2">mdi-hospital-marker</v-icon>
        <span>Daftar Klinik - {{ filteredClinics.length }} dari {{ totalClinics }} klinik</span>
      </v-card-title> -->

      <v-card-text class="pa-6">
        <v-row>
          <v-col
            v-for="clinic in filteredClinics"
            :key="clinic.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="pa-2"
          >
            <v-card   
              :class="{
                'clinic-card': true,
                'clinic-available': clinic.available,
                'clinic-closed': !clinic.available
              }"
              :disabled="!clinic.available"
              @click="selectClinic(clinic)"
              elevation="2"
            >
              <v-card-text class="text-center pa-4">
                <!-- Status Chip -->
                <div class="mb-3">
                  <v-chip
                    :color="clinic.available ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                  >
                    {{ clinic.available ? 'TERSEDIA' : 'TUTUP' }}
                  </v-chip>
                </div>

                <!-- Icon -->
                <div class="clinic-icon-wrapper mb-3">
                  <v-icon
                    :icon="clinic.icon"
                    size="40"
                    :color="clinic.available ? 'success' : 'error'"
                  ></v-icon>
                </div>

                <!-- Clinic Name -->
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ clinic.name }}
                </h3>

                <!-- Subtitle -->
                <p v-if="clinic.subtitle" class="text-caption text-grey-darken-1 mb-2">
                  {{ clinic.subtitle }}
                </p>

                <!-- Shift Info -->
                <div class="shift-info">
                  <v-chip
                    size="small"
                    :color="clinic.available ? 'info' : 'error'"
                    variant="outlined"
                    class="mb-2"
                  >
                    {{ clinic.shift }}
                  </v-chip>
                  <br>
                  <span v-if="clinic.schedule" class="text-caption text-grey-darken-1">
                    {{ clinic.schedule }}
                  </span>
                </div>

                <!-- Action Button -->
                <div class="mt-3">
                  <v-btn
                    v-if="clinic.available"
                    color="success"
                    variant="flat"
                    size="small"
                    block
                  >
                    Pilih Klinik
                  </v-btn>
                  <v-btn
                    v-else
                    color="error"
                    variant="outlined"
                    size="small"
                    disabled
                    block
                  >
                    Tidak Tersedia
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-if="filteredClinics.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-hospital-marker-outline</v-icon>
          <h3 class="text-h6 mt-4 text-grey-darken-1">Tidak ada klinik yang sesuai filter</h3>
          <p class="text-body-2 text-grey-darken-1">Coba ubah filter pencarian Anda</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Selection Dialog -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Konfirmasi Pilihan
        </v-card-title>
        
        <v-card-text class="pa-6" v-if="selectedClinic">
          <div class="text-center">
            <div class="mb-3">
              <v-icon :icon="selectedClinic.icon" size="48" color="primary"></v-icon>
            </div>
            <h3 class="text-h5 font-weight-bold mb-2">{{ selectedClinic.name }}</h3>
            <p v-if="selectedClinic.subtitle" class="text-body-1 text-grey-darken-1 mb-3">
              {{ selectedClinic.subtitle }}
            </p>
            
            <v-divider class="my-4"></v-divider>
            
            <div class="text-left">
              <p><strong>Shift:</strong> {{ selectedClinic.shift }}</p>
              <p v-if="selectedClinic.schedule"><strong>Jadwal:</strong> {{ selectedClinic.schedule }}</p>
              <p><strong>Status:</strong> <span class="text-success">Tersedia</span></p>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="showDialog = false" variant="text">
            Batal
          </v-btn>
          <v-btn 
            color="primary" 
            @click="proceedToRegistration"
            variant="flat"
          >
            Lanjutkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from 'vue'
definePageMeta({
      layout: false, // Disables the layout for this specific page
    });

// Reactive data
const loading = ref(false)
const selectedStatus = ref(null)
const searchQuery = ref('')
const showDialog = ref(false)
const selectedClinic = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Options
const statusOptions = ['Tersedia', 'Tutup']

// Clinic data
const clinics = ref([
  {
    id: 1,
    name: 'ANAK',
    subtitle: '',
    icon: 'mdi-baby-face',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 2,
    name: 'ANESTESI',
    subtitle: '',
    icon: 'mdi-sleep',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 3,
    name: 'BEDAH',
    subtitle: '',
    icon: 'mdi-medical-bag',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 4,
    name: 'GERIATRI',
    subtitle: '',
    icon: 'mdi-account-supervisor',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 5,
    name: 'GIGI DAN MULUT',
    subtitle: 'GIGI DAN MULUT',
    icon: 'mdi-tooth',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 6,
    name: 'GIZI',
    subtitle: '',
    icon: 'mdi-food-apple',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 7,
    name: 'HOM',
    subtitle: 'HEMATO ONKOLOGI MEDIS',
    icon: 'mdi-water',
    shift: 'TUTUP',
    schedule: '',
    available: false,
  },
  {
    id: 8,
    name: 'IPD',
    subtitle: 'PENYAKIT DALAM',
    icon: 'mdi-hospital',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 9,
    name: 'JANTUNG',
    subtitle: 'CARDIOLOGI',
    icon: 'mdi-heart-pulse',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 10,
    name: 'JIWA',
    subtitle: '',
    icon: 'mdi-brain',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 11,
    name: 'KANDUNGAN',
    subtitle: '',
    icon: 'mdi-human-pregnant',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 12,
    name: 'KEMOTERAPI',
    subtitle: '',
    icon: 'mdi-needle',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 13,
    name: 'KOMPLEMENTER',
    subtitle: 'NYERI',
    icon: 'mdi-leaf',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 14,
    name: 'KUL KEL',
    subtitle: 'KULIT KELAMIN',
    icon: 'mdi-hand-back-right',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 15,
    name: 'MATA',
    subtitle: '',
    icon: 'mdi-eye',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 16,
    name: 'MCU',
    subtitle: '',
    icon: 'mdi-clipboard-check',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 17,
    name: 'ONKOLOGI',
    subtitle: '',
    icon: 'mdi-ribbon',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 18,
    name: 'PARU',
    subtitle: '',
    icon: 'mdi-lungs',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 19,
    name: 'R. TINDAKAN',
    subtitle: 'EMG, ECG, DLL',
    icon: 'mdi-monitor-heart-rate',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 20,
    name: 'RADIOTERAPI',
    subtitle: '',
    icon: 'mdi-radioactive',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 21,
    name: 'REHAB MEDIK',
    subtitle: '',
    icon: 'mdi-human-cane',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  },
  {
    id: 22,
    name: 'SARAF',
    subtitle: 'NEUROLOGI',
    icon: 'mdi-head-cog',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: false,
  },
  {
    id: 23,
    name: 'THT',
    subtitle: '',
    icon: 'mdi-ear-hearing',
    shift: 'SHIFT 1',
    schedule: 'Mulai Pukul 07:00',
    available: true,
  }
])

// Computed properties
const filteredClinics = computed(() => {
  let filtered = clinics.value

  if (selectedStatus.value) {
    const isAvailable = selectedStatus.value === 'Tersedia'
    filtered = filtered.filter(clinic => clinic.available === isAvailable)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(clinic => 
      clinic.name.toLowerCase().includes(query) ||
      clinic.subtitle.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalClinics = computed(() => clinics.value.length)

// Methods
const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const selectClinic = (clinic) => {
  if (clinic.available) {
    selectedClinic.value = clinic
    showDialog.value = true
  }
}

const proceedToRegistration = () => {
  showSnackbar(`Mengarahkan ke pendaftaran ${selectedClinic.value.name}...`, 'success')
  console.log('Proceeding to registration for:', selectedClinic.value.name)
  showDialog.value = false
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSnackbar('Status klinik berhasil diperbarui', 'success')
  }, 1000)
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.anjungan-container {
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

.instruction-chip {
  font-weight: 500;
  color: #1976d2 !important;
}

.controls-card,
.main-content-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.clinic-card {
  cursor: pointer;
  border-radius: 16px !important;
  height: 280px;
  background: white;
}

.clinic-available {
  border-left: 6px solid #4CAF50;
}

.clinic-closed {
  opacity: 0.7;
  cursor: not-allowed;
  border-left: 6px solid #F44336;
  background: #fafafa;
}

.clinic-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  margin: 0 auto;
}

.clinic-closed .clinic-icon-wrapper {
  background: rgba(244, 67, 54, 0.1);
}

.shift-info {
  margin-top: 8px;
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
  .anjungan-container {
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

  .clinic-card {
    height: 260px;
  }

  .clinic-icon-wrapper {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 600px) {
  .clinic-card {
    height: 240px;
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>