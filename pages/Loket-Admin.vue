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
            <h1 class="page-title">Loket Admin</h1>
            <p class="page-subtitle">Rabu, 13 Agustus 2025 - Pelayanan</p>
          </div>
        </div>
        <div class="header-right">
          <v-chip color="success" variant="flat" class="mr-2">
            Total {{ totalPasien }} Pasien
          </v-chip>
          <v-chip color="white" variant="flat" class="text-primary">
            Max 150 Pasien
          </v-chip>
        </div>
      </div>
    </div>
    <div>
      <v-card class="next-patient-card mb-4" elevation="2">
        <v-card-text class="text-center pa-6">
          <v-chip color="success" variant="flat" class="mb-3" size="large">
            <v-icon start>mdi-account-arrow-right</v-icon>
            PASIEN SELANJUTNYA
          </v-chip>
          <div class="text-h4 font-weight-bold mb-2 text-success">
            {{ nextPatient ? nextPatient.noAntrian.split(" |")[0] : "UM1004" }}
          </div>
          <div class="text-body-1 mb-4 text-grey-darken-1">
            Klik tombol hijau untuk memanggil
          </div>
          <v-btn
            color="success"
            variant="flat"
            size="large"
            class="px-8"
            @click="callNext"
            :disabled="!nextPatient"
          >
            <v-icon start>mdi-microphone</v-icon>
            PANGGIL NEXT
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
    <!-- Combined Control Section -->
    <v-row class="mb-4">
      <!-- Left Side: Call Controls and Current Processing -->
      <v-col cols="12" lg="6">
        <!-- Current Patient Processing Card -->
        <v-card
          v-if="currentProcessingPatient"
          class="current-processing-card"
          elevation="2"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="patient-info">
                <v-chip color="primary" variant="flat" class="mb-2">
                  <v-icon start>mdi-account-clock</v-icon>
                  SEDANG DIPROSES
                </v-chip>
                <div class="text-h5 font-weight-bold mb-1">
                  {{ currentProcessingPatient.noAntrian.split(" |")[0] }}
                </div>
                <div class="text-subtitle-1 text-grey-darken-1">
                  {{ currentProcessingPatient.barcode }} |
                  {{ currentProcessingPatient.klinik }}
                </div>
              </div>
              <div class="action-buttons">
                <v-btn
                  color="success"
                  variant="flat"
                  class="mr-2"
                  @click="processPatient(currentProcessingPatient, 'check-in')"
                >
                  <v-icon start>mdi-check-circle</v-icon>
                  Check In
                </v-btn>
                <v-btn
                  color="warning"
                  variant="flat"
                  class="mr-2"
                  @click="processPatient(currentProcessingPatient, 'terlambat')"
                >
                  <v-icon start>mdi-clock-alert</v-icon>
                  Terlambat
                </v-btn>
                <v-btn
                  color="error"
                  variant="flat"
                  @click="processPatient(currentProcessingPatient, 'pending')"
                >
                  <v-icon start>mdi-pause-circle</v-icon>
                  Pending
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Side: Patient Queue Info -->
      <v-col cols="12" lg="6">
        <!-- Next Patient Card -->
        <!-- Quota Info Card -->
        <v-card class="quota-info-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="text-center">
              <div class="text-h6 font-weight-medium mb-3">
                Panggil Antrean Anjungan
              </div>
              <v-row class="mb-3">
                <v-col cols="6" class="text-center">
                  <div class="text-caption text-grey-darken-1">Kuota</div>
                  <div class="text-h4 font-weight-bold">150</div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="text-caption text-grey-darken-1">Tersedia</div>
                  <div class="text-h4 font-weight-bold text-success">
                    {{ 150 - quotaUsed }}
                  </div>
                </v-col>
              </v-row>
              <div class="text-body-2 text-grey-darken-1 mb-2">
                Total Quota Terpakai: {{ quotaUsed }}
              </div>
              <v-progress-linear
                :model-value="(quotaUsed / 150) * 100"
                color="success"
                height="8"
                rounded
              ></v-progress-linear>
              <v-card-text class="call-controls-card align-center py-4">
                <div> <span class="text-subtitle-1 font-weight-medium"
                    >Panggil Pasien:</span> </div>
                <div class="d-flex align-center flex-wrap mb-3">
                  <v-btn
                    color="success"
                    variant="flat"
                    size="large"
                    class="px-6 ma-4"
                    @click="callMultiplePatients(1)"
                  >
                    <span class="text-h6 font-weight-bold">1</span>
                  </v-btn>
                  <v-btn
                    color="info"
                    variant="flat"
                    size="large"
                    class="px-6 ma-4"
                    @click="callMultiplePatients(5)"
                  >
                    <span class="text-h6 font-weight-bold">5</span>
                  </v-btn>
                  <v-btn
                    color="warning"
                    variant="flat"
                    size="large"
                    class="px-6 ma-4"
                    @click="callMultiplePatients(10)"
                  >
                    <span class="text-h6 font-weight-bold">10</span>
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="flat"
                    size="large"
                    class="px-6 ma-4"
                    @click="callMultiplePatients(20)"
                  >
                    <span class="text-h6 font-weight-bold">20</span>
                  </v-btn>
                </div>
              </v-card-text>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Di Loket Patients Table -->
    <v-card class="main-table-card mb-4" elevation="2">
      <TabelData
        :headers="diLoketHeaders"
        :items="diLoketPatients"
        title="DATA PASIEN - DI LOKET"
      >
        <template #actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              size="small"
              color="info"
              variant="flat"
              @click="processPatient(item, 'aktifkan')"
            >
              Aktifkan
            </v-btn>
            <v-btn
              size="small"
              color="success"
              variant="flat"
              @click="processPatient(item, 'proses')"
            >
              Proses
            </v-btn>
          </div>
        </template>
        <template #item.jamPanggil="{ item }">
          <span :class="getRowClass(item)">{{ item.jamPanggil }}</span>
        </template>
      </TabelData>
    </v-card>

    <!-- Terlambat Patients Table -->
    <v-card
      class="late-table-card mb-4"
      elevation="2"
      v-if="terlambatPatients.length > 0"
    >
      <TabelData
        :headers="terlambatHeaders"
        :items="terlambatPatients"
        title="INFO PASIEN LAPOR TERLAMBAT"
      >
        <template #actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              size="small"
              color="success"
              variant="flat"
              @click="processPatient(item, 'aktifkan')"
            >
              Aktifkan
            </v-btn>
          </div>
        </template>
      </TabelData>
    </v-card>

    <!-- Pending Patients Table -->
    <v-card
      class="pending-table-card mb-4"
      elevation="2"
      v-if="pendingPatients.length > 0"
    >
      <TabelData
        :headers="pendingHeaders"
        :items="pendingPatients"
        title="INFO PASIEN PENDING"
      >
        <template #actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              size="small"
              color="success"
              variant="flat"
              @click="processPatient(item, 'proses')"
            >
              Proses
            </v-btn>
          </div>
        </template>
      </TabelData>
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
import { ref, computed } from "vue";
import TabelData from "../components/TabelData.vue";

// Reactive data
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const quotaUsed = ref(5);
const currentProcessingPatient = ref(null);

// Base patient data - semua pasien yang belum dipanggil
const allPatients = ref([
  {
    no: 1,
    jamPanggil: "12:49",
    barcode: "250811100163",
    noAntrian: "UM1001 | Online - 250811100163",
    shift: "Shift 1",
    klinik: "KANDUNGAN",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    status: "waiting", // waiting, di-loket, terlambat, pending, processed
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
    status: "waiting",
  },
  {
    no: 3,
    jamPanggil: "09:30",
    barcode: "250811100200",
    noAntrian: "UM1003 | Online - 250811100200",
    shift: "Shift 1",
    klinik: "SARAF",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    status: "waiting",
  },
  {
    no: 4,
    jamPanggil: "14:15",
    barcode: "250811100210",
    noAntrian: "UM1004 | Online - 250811100210",
    shift: "Shift 1",
    klinik: "THT",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    status: "waiting",
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    no: i + 5,
    jamPanggil: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    barcode: `25081110${String(i + 300).padStart(4, "0")}`,
    noAntrian: `UM100${i + 5} | Online - 25081110${String(i + 300).padStart(4, "0")}`,
    shift: "Shift 1",
    klinik: ["KANDUNGAN", "IPD", "THT", "SARAF"][Math.floor(Math.random() * 4)],
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    status: "waiting",
  })),
]);

// Computed properties for different status tables
const diLoketPatients = computed(() =>
  allPatients.value.filter((patient) => patient.status === "di-loket")
);

const terlambatPatients = computed(() =>
  allPatients.value.filter((patient) => patient.status === "terlambat")
);

const pendingPatients = computed(() =>
  allPatients.value.filter((patient) => patient.status === "pending")
);

const nextPatient = computed(() => {
  return allPatients.value.find((patient) => patient.status === "waiting");
});

const totalPasien = computed(() => allPatients.value.length);

// Headers for different tables
const diLoketHeaders = ref([
  { title: "No", value: "no", sortable: false, width: "60px" },
  { title: "Jam Panggil", value: "jamPanggil", sortable: true, width: "100px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Fast Track", value: "fastTrack", sortable: true, width: "100px" },
  { title: "Pembayaran", value: "pembayaran", sortable: true, width: "100px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "200px" },
]);

const terlambatHeaders = ref([
  { title: "No", value: "no", sortable: false, width: "60px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "100px" },
]);

const pendingHeaders = ref([
  { title: "#", value: "no", sortable: false, width: "60px" },
  { title: "Barcode", value: "barcode", sortable: true, width: "140px" },
  { title: "No Antrian", value: "noAntrian", sortable: true, width: "200px" },
  { title: "Shift", value: "shift", sortable: true, width: "80px" },
  { title: "Klinik", value: "klinik", sortable: true, width: "120px" },
  { title: "Fast Track", value: "fastTrack", sortable: true, width: "100px" },
  { title: "Pembayaran", value: "pembayaran", sortable: true, width: "100px" },
  { title: "Aksi", value: "aksi", sortable: false, width: "100px" },
]);

// Methods
const showSnackbar = (text, color = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const callMultiplePatients = (count) => {
  const waitingPatients = allPatients.value.filter(
    (patient) => patient.status === "waiting"
  );
  const patientsToCall = waitingPatients.slice(0, count);

  if (patientsToCall.length === 0) {
    showSnackbar("Tidak ada pasien yang menunggu", "warning");
    return;
  }

  // Check quota
  if (quotaUsed.value + patientsToCall.length > 150) {
    showSnackbar("Quota tidak mencukupi", "error");
    return;
  }

  // Move patients to "di-loket" status
  patientsToCall.forEach((patient) => {
    patient.status = "di-loket";
  });

  quotaUsed.value += patientsToCall.length;
  showSnackbar(`Memanggil ${patientsToCall.length} pasien ke loket`, "success");
};

const callNext = () => {
  if (!nextPatient.value) {
    showSnackbar("Tidak ada pasien selanjutnya", "warning");
    return;
  }

  if (quotaUsed.value >= 150) {
    showSnackbar("Quota sudah penuh", "error");
    return;
  }

  // Move next patient to processing
  nextPatient.value.status = "di-loket";
  currentProcessingPatient.value = nextPatient.value;
  quotaUsed.value++;

  showSnackbar(
    `Memanggil pasien ${nextPatient.value.noAntrian.split(" |")[0]}`,
    "success"
  );
};

const processPatient = (patient, action) => {
  const patientCode = patient.noAntrian.split(" |")[0];

  switch (action) {
    case "check-in":
      patient.status = "processed";
      if (currentProcessingPatient.value?.no === patient.no) {
        currentProcessingPatient.value = null;
      }
      showSnackbar(`Pasien ${patientCode} berhasil check in`, "success");
      break;

    case "terlambat":
      patient.status = "terlambat";
      if (currentProcessingPatient.value?.no === patient.no) {
        currentProcessingPatient.value = null;
      }
      showSnackbar(`Pasien ${patientCode} ditandai terlambat`, "warning");
      break;

    case "pending":
      patient.status = "pending";
      if (currentProcessingPatient.value?.no === patient.no) {
        currentProcessingPatient.value = null;
      }
      showSnackbar(`Pasien ${patientCode} di-pending`, "info");
      break;

    case "aktifkan":
      if (patient.status === "terlambat") {
        patient.status = "di-loket";
        showSnackbar(`Pasien ${patientCode} diaktifkan kembali`, "success");
      }
      break;

    case "proses":
      currentProcessingPatient.value = patient;
      showSnackbar(`Memproses pasien ${patientCode}`, "info");
      break;
  }
};

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
.current-processing-card,
.quota-info-card,
.main-table-card,
.late-table-card,
.pending-table-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.next-patient-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid rgba(76, 175, 80, 0.2);
}

.current-processing-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px solid rgba(255, 152, 0, 0.2);
}

.quota-info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid rgba(33, 150, 243, 0.2);
}

.patient-info .text-h5 {
  color: #1976d2;
}

.action-buttons {
  display: flex;
  align-items: center;
}

/* Enhanced table styling */
.main-table-card :deep(.v-data-table th),
.late-table-card :deep(.v-data-table th),
.pending-table-card :deep(.v-data-table th) {
  background: #fafbfc;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.main-table-card :deep(.v-data-table tbody tr:hover),
.late-table-card :deep(.v-data-table tbody tr:hover),
.pending-table-card :deep(.v-data-table tbody tr:hover) {
  background: #f8fafc !important;
}

.main-table-card :deep(.v-data-table tbody td),
.late-table-card :deep(.v-data-table tbody td),
.pending-table-card :deep(.v-data-table tbody td) {
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

  .current-processing-card .d-flex {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }

  .action-buttons .v-btn {
    flex: 1;
    min-width: 120px;
  }

  /* Stack layout vertically on medium screens */
  .call-controls-card .d-flex {
    justify-content: center;
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
    align-items: center;
    gap: 16px;
  }

  .call-controls-card .v-btn {
    min-width: 80px;
  }

  /* Stack all control buttons vertically on mobile */
  .call-controls-card .d-flex.flex-wrap {
    flex-direction: column;
    align-items: stretch;
  }

  .call-controls-card .v-btn {
    width: 100%;
    margin: 4px 0;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .v-btn {
    width: 100%;
    margin: 4px 0;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 20px;
  }

  .next-patient-card .text-h4 {
    font-size: 1.75rem !important;
  }

  .current-processing-card .patient-info .text-h5 {
    font-size: 1.25rem !important;
  }

  .quota-info-card .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>
