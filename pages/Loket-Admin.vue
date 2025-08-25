<template>
  <v-app>
    <v-app-bar>
      <v-container fluid class="pa-4">
        <v-row align="center" no-gutters class="fill-height">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <div
                class="bg-grey-darken-4 px-3 py-1 mr-2"
                style="border-radius: 3px"
              >
                <span class="text-body-1 font-weight-bold text-white"
                  >Total 2</span
                >
              </div>
              <div
                class="bg-grey-darken-2 px-3 py-1"
                style="border-radius: 3px"
              >
                <span class="text-body-1 text-white">Max 150 Pasien</span>
              </div>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <div class="d-flex align-center text-body-2">
              <v-icon size="small" class="mr-2">mdi-view-dashboard</v-icon>
              <span class="mr-6">Dashboard</span>
              <span>Loket 12 | Rabu, 13 Agustus 2025 - Pelayanan</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <div class="bg-cyan" style="height: 3px" />

    <v-main>
      <v-container fluid class="pa-6">
        <v-row class="mb-6">
          <v-col>
            <div class="text-h6 text-grey-darken-2 font-weight-medium">
              Loket 12 | Rabu, 13 Agustus 2025 - Pelayanan :
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <div class="d-flex align-center">
              <v-btn
                color="success"
                dark
                size="large"
                class="mr-4 px-8"
                style="min-width: 120px; height: 40px"
              >
                <span class="text-h6 font-weight-bold">1</span>
              </v-btn>
              <v-btn
                color="info"
                dark
                size="large"
                class="mr-4 px-4"
                style="min-width: 120px; height: 40px"
              >
                <span class="text-h6 font-weight-bold">5</span>
              </v-btn>
              <v-btn
                color="warning"
                dark
                size="large"
                class="mr-4 px-4"
                style="min-width: 120px; height: 40px"
              >
                <span class="text-h6 font-weight-bold">10</span>
              </v-btn>
              <v-btn
                color="error"
                dark
                size="large"
                class="px-4"
                style="min-width: 120px; height: 40px"
              >
                <span class="text-h6 font-weight-bold">20</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row justify="center" class="pa-12">
          <v-col cols="12" md="10" lg="8">
            <v-card
              color="success"
              dark
              flat
              class="text-center"
              style="min-height: 160px; border-radius: 8px"
            >
              <v-card-text class="pa-8">
                <div
                  class="text-h2 font-weight-bold mb-2"
                  style="letter-spacing: 4px"
                >
                  NEXT
                </div>
                <div class="text-h6 mb-4 font-weight-normal">
                  Pasien - UM1004
                </div>
                <div
                  class="text-body-1 font-weight-normal"
                  style="opacity: 0.9"
                >
                  Klik untuk memanggil pasien selanjutnya
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="mb-4">
          <TabelData
            :headers="mainHeaders"
            :items="mainPatients"
            title="DATA PASIEN"
          >
            <template #actions="{ item }">
              <div class="d-flex ga-1">
                <v-btn size="small" color="success" variant="flat">Panggil</v-btn>
                <v-btn size="small" color="info" variant="flat">Cancel</v-btn>
                <v-btn size="small" color="primary" variant="flat">Selesai</v-btn>
              </div>
            </template>
            <template #item.jamPanggil="{ item }">
              <span :class="getRowClass(item)">{{ item.jamPanggil }}</span>
            </template>
          </TabelData>
        </v-card>

        <v-card color="cyan" dark class="mb-4">
          <v-card-text class="text-center">
            <div class="text-h6">Total Quota Terpakai 5</div>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <TabelData
            :headers="lateHeaders"
            :items="latePatients"
            title="INFO PASIEN LAPOR TERLAMBAT"
            :show-search="false"
          >
            </TabelData>
        </v-card>

        <v-card class="mb-4">
          <TabelData
            :headers="clinicHeaders"
            :items="clinicPatients"
            title="INFO PASIEN MASUK KLINIK"
          >
            </TabelData>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabelData from "../components/TabelData.vue";

// Define interfaces
interface Patient {
  no: number;
  jamPanggil: string;
  barcode: string;
  noAntrian: string;
  shift: string;
  klinik: string;
  fastTrack: string;
  pembayaran: string;
  panggil: string;
  status: string;
}

interface LatePatient {
  no: number;
  barcode: string;
  noAntrian: string;
  shift: string;
  klinik: string;
  aksi: string;
}

interface ClinicPatient {
  no: number;
  barcode: string;
  noAntrian: string;
  noRM: string;
  shift: string;
  klinik: string;
  fastTrack: string;
  pembayaran: string;
  aksi: string;
}

// Data and Headers
const mainHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Jam Panggil", value: "jamPanggil", sortable: true },
  { title: "Barcode", value: "barcode", sortable: true },
  { title: "No Antrian", value: "noAntrian", sortable: true },
  { title: "Shift", value: "shift", sortable: true },
  { title: "Klinik", value: "klinik", sortable: true },
  { title: "Fast Track", value: "fastTrack", sortable: true },
  { title: "Pembayaran", value: "pembayaran", sortable: true },
  { title: "Panggil", value: "panggil", sortable: true },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const mainPatients = ref<Patient[]>([
  {
    no: 1,
    jamPanggil: "12:49",
    barcode: "250811100163",
    noAntrian: "UM1001 | Online - 250811100163",
    shift: "Shift 1",
    klinik: "KANDUNGAN",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Panggil",
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
    panggil: "Cancel",
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
    panggil: "Panggil",
    status: "normal",
  })),
]);

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Barcode", value: "barcode", sortable: true },
  { title: "No Antrian", value: "noAntrian", sortable: true },
  { title: "Shift", value: "shift", sortable: true },
  { title: "Klinik", value: "klinik", sortable: true },
  { title: "Aksi", value: "aksi", sortable: false },
]);
const latePatients = ref<LatePatient[]>([]);

const clinicHeaders = ref([
  { title: "#", value: "no", sortable: false },
  { title: "Barcode", value: "barcode", sortable: true },
  { title: "No Antrian", value: "noAntrian", sortable: true },
  { title: "No RM", value: "noRM", sortable: true },
  { title: "Shift", value: "shift", sortable: true },
  { title: "Klinik", value: "klinik", sortable: true },
  { title: "Fast Track", value: "fastTrack", sortable: true },
  { title: "Pembayaran", value: "pembayaran", sortable: true },
  { title: "Aksi", value: "aksi", sortable: false },
]);
const clinicPatients = ref<ClinicPatient[]>([]);

// Method yang tetap di halaman induk (seperti getRowClass)
const getRowClass = (item: Patient): string => {
  if (item.status === "current") {
    return "text-green font-weight-bold";
  }
  return "";
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.12);
  color: #1976d2;
}

.text-green {
  color: #4caf50 !important;
}

.bg-cyan {
  background-color: #00bcd4 !important;
}

/* Row highlighting */
:deep(.v-data-table tbody tr:nth-child(1)) {
  background-color: #fff3cd !important;
}

.v-btn {
  text-transform: none !important;
}

.v-btn--size-small {
  height: 32px;
  padding: 0 8px;
}
</style>