<!-- pages/LoketAdmin.vue -->
<template>
  <div class="loket-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-view-dashboard</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">Loket 12</h1>
            <p class="page-subtitle">Rabu, 13 Agustus 2025 - Pelayanan</p>
          </div>
        </div>
        <div class="header-right">
          <v-chip
            color="success"
            variant="flat"
            class="mr-2"
          >
            Total 2 Pasien
          </v-chip>
          <v-chip
            color="white"
            variant="flat"
            class="text-primary"
          >
            Max 150 Pasien
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Call Controls -->
    <v-card class="call-controls-card mb-4" elevation="2">
      <v-card-text class="py-4">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center flex-wrap gap-3">
              <span class="text-subtitle-1 font-weight-medium">Panggil Pasien:</span>
              <v-btn
                color="success"
                variant="flat"
                size="large"
                class="px-6"
                @click="callPatient(1)"
              >
                <span class="text-h6 font-weight-bold">1</span>
              </v-btn>
              <v-btn
                color="info"
                variant="flat"
                size="large"
                class="px-6"
                @click="callPatient(5)"
              >
                <span class="text-h6 font-weight-bold">5</span>
              </v-btn>
              <v-btn
                color="warning"
                variant="flat"
                size="large"
                class="px-6"
                @click="callPatient(10)"
              >
                <span class="text-h6 font-weight-bold">10</span>
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                size="large"
                class="px-6"
                @click="callPatient(20)"
              >
                <span class="text-h6 font-weight-bold">20</span>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-chip
              color="info"
              variant="flat"
              class="float-right"
            >
              Total Quota Terpakai: 5
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Next Patient Card -->
    <v-card class="next-patient-card mb-4" elevation="2">
      <v-card-text class="text-center pa-8">
        <v-chip color="success" variant="flat" class="mb-4" size="large">
          <v-icon start>mdi-account-arrow-right</v-icon>
          PASIEN SELANJUTNYA
        </v-chip>
        <div class="text-h3 font-weight-bold mb-2 text-success">
          UM1004
        </div>
        <div class="text-h6 mb-4 text-grey-darken-1">
          Klik tombol hijau untuk memanggil
        </div>
        <v-btn
          color="success"
          variant="flat"
          size="x-large"
          class="px-12"
          @click="callNext"
        >
          <v-icon start>mdi-microphone</v-icon>
          PANGGIL NEXT
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Main Patients Table -->
    <v-card class="main-table-card mb-4" elevation="2">
      <TabelData
        :headers="mainHeaders"
        :items="mainPatients"
        title="DATA PASIEN"
      >
        <template #actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn 
              size="small" 
              color="success" 
              variant="flat"
              @click="callPatient(item.no)"
            >
              Panggil
            </v-btn>
            <v-btn 
              size="small" 
              color="warning" 
              variant="flat"
              @click="cancelPatient(item)"
            >
              Cancel
            </v-btn>
            <v-btn 
              size="small" 
              color="primary" 
              variant="flat"
              @click="finishPatient(item)"
            >
              Selesai
            </v-btn>
          </div>
        </template>
        <template #item.jamPanggil="{ item }">
          <span :class="getRowClass(item)">{{ item.jamPanggil }}</span>
        </template>
      </TabelData>
    </v-card>

    <!-- Late Patients Table -->
    <v-card class="late-table-card mb-4" elevation="2" v-if="latePatients.length > 0">
      <TabelData
        :headers="lateHeaders"
        :items="latePatients"
        title="INFO PASIEN LAPOR TERLAMBAT"
        :show-search="false"
      />
    </v-card>

    <!-- Clinic Patients Table -->
    <v-card class="clinic-table-card mb-4" elevation="2" v-if="clinicPatients.length > 0">
      <TabelData
        :headers="clinicHeaders"
        :items="clinicPatients"
        title="INFO PASIEN MASUK KLINIK"
      />
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
import { ref } from "vue";
import TabelData from "../components/TabelData.vue";

// Reactive data
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Data and Headers
const mainHeaders = ref([
  { title: "No", value: "no", sortable: false, width: "60px" },
  { title: "Jam Panggil", value: "jamPanggil", sortable: true, width: "100px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Fast Track", value: "fastTrack", sortable: true, width: "100px" },
  { title: "Pembayaran", value: "pembayaran", sortable: true, width: "100px" },
  { title: "Status", value: "panggil", sortable: true, width: "80px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "200px" },
]);

const mainPatients = ref([
  {
    no: 1,
    jamPanggil: "12:49",
    barcode: "250811100163",
    noAntrian: "UM1001 | Online - 250811100163",
    shift: "Shift 1",
    klinik: "KANDUNGAN",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Aktif",
    status: "current",
  },
  {
    no: 2,
    jamPanggil: "10:52",
    barcode: "250811100155",
    noAntrian: "UM1002 | Online - 250811100155",
    shift: "Shift 1",
    klinik: "IPD",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Menunggu",
    status: "normal",
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    no: i + 3,
    jamPanggil: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    barcode: `25081110${String(i + 200).padStart(4, "0")}`,
    noAntrian: `UM100${i + 3} | Online - 25081110${String(i + 200).padStart(4, "0")}`,
    shift: "Shift 1",
    klinik: ["KANDUNGAN", "IPD", "THT", "SARAF"][Math.floor(Math.random() * 4)],
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Menunggu",
    status: "normal",
  })),
]);

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false, width: "60px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "100px" },
]);

const latePatients = ref([]);

const clinicHeaders = ref([
  { title: "#", value: "no", sortable: false, width: "60px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "No RM", value: "noRM", sortable: true, width: "100px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Fast Track", value: "fastTrack", sortable: true, width: "100px" },
  { title: "Pembayaran", value: "pembayaran", sortable: true, width: "100px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "100px" },
]);

const clinicPatients = ref([]);

// Methods
const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const callPatient = (number) => {
  showSnackbar(`Memanggil pasien nomor ${number}`, 'success')
}

const callNext = () => {
  showSnackbar('Memanggil pasien selanjutnya: UM1004', 'success')
}

const cancelPatient = (patient) => {
  showSnackbar(`Membatalkan pasien ${patient.noAntrian.split(' |')[0]}`, 'warning')
}

const finishPatient = (patient) => {
  showSnackbar(`Menyelesaikan pasien ${patient.noAntrian.split(' |')[0]}`, 'success')
}

const getRowClass = (item) => {
  if (item.status === "current") {
    return "text-success font-weight-bold";
  }
  return "";
};
</script>

<style scoped>
.loket-container {
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

.call-controls-card,
.next-patient-card,
.main-table-card,
.late-table-card,
.clinic-table-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.next-patient-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid rgba(76, 175, 80, 0.2);
}

/* Enhanced table styling */
.main-table-card :deep(.v-data-table th) {
  background: #fafbfc;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.main-table-card :deep(.v-data-table tbody tr:nth-child(1)) {
  background-color: #fff3cd !important;
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
}

.v-btn--size-small {
  height: 32px;
  padding: 0 12px;
}

/* Success text color */
.text-success {
  color: #4caf50 !important;
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
  .loket-container {
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

  .call-controls-card .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .call-controls-card .v-btn {
    min-width: 80px;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 20px;
  }

  .next-patient-card .text-h3 {
    font-size: 2rem !important;
  }
  
  .call-controls-card .d-flex.flex-wrap {
    justify-content: center;
  }
}
</style>