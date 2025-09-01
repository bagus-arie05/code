<template>
  <div class="clinic-selection-page">
    <!-- Header -->
    <v-app-bar color=#fafbfc elevation="2">
      <v-toolbar-title class="text-h5 font-weight-bold">
        Anjungan RSSA
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip color="white" >
        Pilih Klinik Tekan Tombol Hijau, Tombol Merah Penuh / Klinik Tutup
      </v-chip>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid class="pa-8 mt-4">
      <v-row class="ma-4">
        <!-- Clinic Cards -->
        <v-col
          v-for="clinic in clinics"
          :key="clinic.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="pa-3"
        >
          <v-card   
            :class="{
              'clinic-card': true,
              'clinic-available': clinic.available,
              'clinic-closed': !clinic.available
            }"
            :disabled="!clinic.available"
            @click="selectClinic(clinic)"
            elevation="3"
            hover
          >
            <v-card-text class="text-center pa-4">
              <!-- Icon -->
              <div class="clinic-icon-wrapper mb-3">
                <v-icon
                  :icon="clinic.icon"
                  size="48"
                  :color="clinic.available ? 'success' : 'error'"
                  class="clinic-icon"
                ></v-icon>
              </div>

              <!-- Clinic Name -->
              <h3 class="text-h6 font-weight-bold mb-2" :class="clinic.available ? 'text-success' : 'text-error'">
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
                  :color="clinic.available ? 'success' : 'error'"
                  variant="outlined"
                  class="mb-1"
                >
                  {{ clinic.shift }}
                </v-chip>
                <br>
                <span class="text-caption text-grey-darken-1">
                  {{ clinic.schedule }}
                </span>
              </div>

              <!-- Status -->
              <div v-if="!clinic.available" class="mt-2">
                <v-chip
                  size="small"
                  color="error"
                  variant="flat"
                  prepend-icon="mdi-clock-alert"
                >
                  {{ clinic.status }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Selection Dialog -->
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Konfirmasi Pilihan
        </v-card-title>
        <v-card-text>
          Anda telah memilih klinik <strong>{{ selectedClinic?.name }}</strong>.
          Lanjutkan untuk mendaftar?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDialog = false">
            Batal
          </v-btn>
          <v-btn color="primary" @click="proceedToRegistration">
            Lanjutkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive data
const showDialog = ref(false)
const selectedClinic = ref(null)

// Clinic data with medical icons
const clinics = ref([
  {
    id: 1,
    name: 'ANAK',
    subtitle: '',
    icon: 'mdi-baby-face',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 2,
    name: 'ANESTESI',
    subtitle: '',
    icon: 'mdi-sleep',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 3,
    name: 'BEDAH',
    subtitle: '',
    icon: 'mdi-medical-bag',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 4,
    name: 'GERIATRI',
    subtitle: '',
    icon: 'mdi-account-supervisor',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 5,
    name: 'GIGI DAN MULUT',
    subtitle: 'GIGI DAN MULUT',
    icon: 'mdi-tooth',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 6,
    name: 'GIZI',
    subtitle: '',
    icon: 'mdi-food-apple',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 7,
    name: 'HOM',
    subtitle: 'HEMATO ONKOLOGI MEDIS',
    icon: 'mdi-water',
    shift: 'TUTUP',
    schedule: '',
    available: false,
    status: ''
  },
  {
    id: 8,
    name: 'IPD',
    subtitle: 'PENYAKIT DALAM',
    icon: 'mdi-hospital',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 9,
    name: 'JANTUNG',
    subtitle: 'CARDIOLOGI',
    icon: 'mdi-heart-pulse',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 10,
    name: 'JIWA',
    subtitle: '',
    icon: 'mdi-brain',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 11,
    name: 'KANDUNGAN',
    subtitle: '',
    icon: 'mdi-human-pregnant',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 12,
    name: 'KEMOTERAPI',
    subtitle: '',
    icon: 'mdi-needle',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 13,
    name: 'KOMPLEMENTER',
    subtitle: 'NYERI',
    icon: 'mdi-leaf',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 14,
    name: 'KUL KEL',
    subtitle: 'KULIT KELAMIN',
    icon: 'mdi-hand-back-right',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 15,
    name: 'MATA',
    subtitle: '',
    icon: 'mdi-eye',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 16,
    name: 'MCU',
    subtitle: '',
    icon: 'mdi-clipboard-check',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 17,
    name: 'ONKOLOGI',
    subtitle: '',
    icon: 'mdi-ribbon',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 18,
    name: 'PARU',
    subtitle: '',
    icon: 'mdi-lungs',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 19,
    name: 'R. TINDAKAN',
    subtitle: 'EMG, ECG, DLL',
    icon: 'mdi-monitor-heart-rate',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 20,
    name: 'RADIOTERAPI',
    subtitle: '',
    icon: 'mdi-radioactive',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 21,
    name: 'REHAB MEDIK',
    subtitle: '',
    icon: 'mdi-human-cane',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  },
  {
    id: 22,
    name: 'SARAF',
    subtitle: 'NEUROLOGI',
    icon: 'mdi-head-cog',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: false,
    status: ''
  },
  {
    id: 23,
    name: 'THT',
    subtitle: '',
    icon: 'mdi-ear-hearing',
    shift: 'SHIFT 1',
    schedule: 'Mulai + Pukul 07:00',
    available: true,
    status: ''
  }
])

// Methods
const selectClinic = (clinic) => {
  if (clinic.available) {
    selectedClinic.value = clinic
    showDialog.value = true
  }
}

const proceedToRegistration = () => {
  // Navigate to registration page or emit event
  console.log('Proceeding to registration for:', selectedClinic.value.name)
  showDialog.value = false
  // You can add navigation logic here
  // await navigateTo(`/registration/${selectedClinic.value.id}`)
}

definePageMeta({
  layout: false,
});


</script>

<style scoped>
.clinic-selection-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fafbfc 0%, #c3cfe2 100%);
}

.clinic-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px !important;
  height: 220px;
  display: flex;
  align-items: center;
  background: white;
}

.clinic-available {
  border-left: 6px solid #4CAF50;
}

.clinic-available:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2) !important;
  border-left: 6px solid #2E7D32;
}

.clinic-closed {
  opacity: 0.7;
  cursor: not-allowed;
  border-left: 6px solid #F44336;
}

.clinic-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  margin: 0 auto;
}

.clinic-closed .clinic-icon-wrapper {
  background: rgba(244, 67, 54, 0.1);
}
*
.clinic-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.shift-info {
  margin-top: 8px;
}

/* Custom Vuetify theme colors */
.v-theme--light {
  --v-theme-primary: #2E7D32;
  --v-theme-secondary: #FF7043;
  --v-theme-success: #4CAF50;
  --v-theme-error: #F44336;
}
</style>