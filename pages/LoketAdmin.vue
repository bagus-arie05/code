<template>
  <v-app>
    <v-layout>
      <!-- App Bar Header -->
      <v-app-bar app color="green darken-1" dark>
        <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-2">Antrean RSSA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <span class="mr-2">Rajal Bayu Nogroho</span>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent app>
        <v-list density="compact" nav>
          <template v-for="item in items" :key="item.title">
            <v-menu
              v-if="item.children"
              open-on-hover
              location="end"
              :nudge-right="8"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :value="item.title"
                  :class="{ 'v-list-item--active': item.title === currentPage }"
                >
                </v-list-item>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item
                  v-for="child in item.children"
                  :key="child.title"
                  :to="child.to"
                  link
                >
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-list-item
              v-else
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              :value="item.title"
              :class="{ 'v-list-item--active': item.title === currentPage }"
              link
            ></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="pa-4">
          <!-- Header Stats -->
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="d-flex align-center">
              <span class="text-h6 mr-4">Total 0</span>
              <span class="text-body-2">Max 150 Pasien</span>
            </div>
            <div class="d-flex align-center">
              <span class="mr-4">Dashboard</span>
              <span class="mr-4">Loket 24 | Senin, 11 Agustus 2025</span>
              <span class="mr-4">11 Agustus 2025 - Pelayanan</span>
            </div>
          </div>

          <!-- Status Cards -->
          <v-card class="pa-5 mb-5" color="white" flat></v-card>
          <v-row align="center">
            <v-col cols="1
            2" md="1">
              <v-card color="green" dark class="text-center">
                <v-card-text>
                  <div class="text-h4">1</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="1">
              <v-card color="blue" dark class="text-center">
                <v-card-text>
                  <div class="text-h4">1</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="1">
              <v-card color="orange" dark class="text-center">
                <v-card-text>
                  <div class="text-h4">4</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="1">
              <v-card color="red" dark class="text-center">
                <v-card-text>
                  <div class="text-h4">30</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        

          <!-- Next Patient Card -->
          <v-col cols="12" md="4">
            <v-card color="green" dark class="mb-4">
              <v-card-text class="text-center">
                <div class="text-h4 mb-2">NEXT</div>
                <div class="text-h6 mb-1">Pasien : UM1001</div>
                <div class="text-body-2">
                  Klik untuk memanggil pasien selanjutnya
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Main Data Table -->
          <v-card class="mb-4">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Data Pasien</span>
              <div class="d-flex align-center">
                <span class="mr-2">Show</span>
                <v-select
                  v-model="itemsPerPage"
                  :items="[10, 25, 50, 100]"
                  density="compact"
                  variant="outlined"
                  style="max-width: 80px"
                  class="mr-4"
                ></v-select>
                <span class="mr-2">entries</span>
                <span class="mr-4">Search:</span>
                <v-text-field
                  v-model="search"
                  density="compact"
                  variant="outlined"
                  style="max-width: 200px"
                  hide-details
                ></v-text-field>
              </div>
            </v-card-title>
            <v-data-table
              :headers="mainHeaders"
              :items="mainPatients"
              :search="search"
              :items-per-page="itemsPerPage"
              class="elevation-1"
            >
              <template v-slot:item.aksi="{ item }">
                <div class="d-flex ga-1">
                  <v-btn size="small" color="success" variant="flat"
                    >Panggil</v-btn
                  >
                  <v-btn size="small" color="info" variant="flat">Cancel</v-btn>
                  <v-btn size="small" color="primary" variant="flat"
                    >Selesai</v-btn
                  >
                </div>
              </template>
              <template v-slot:item.jamPanggil="{ item }">
                <span :class="getRowClass(item)">{{ item.jamPanggil }}</span>
              </template>
            </v-data-table>
          </v-card>

          <!-- Total Quota Used -->
          <v-card color="cyan" dark class="mb-4">
            <v-card-text class="text-center">
              <div class="text-h6">Total Quota Terpakai 5</div>
            </v-card-text>
          </v-card>

          <!-- Late Patients Table -->
          <v-card class="mb-4">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Info Pasien Lapor Terlambat</span>
              <div class="d-flex align-center">
                <span class="mr-2 text-caption text-orange"
                  >KETERANGAN: PASIEN MASUK PADA TANGGAL</span
                >
                <span class="mr-2">Show</span>
                <v-select
                  v-model="lateItemsPerPage"
                  :items="[10, 25, 50, 100]"
                  density="compact"
                  variant="outlined"
                  style="max-width: 80px"
                  class="mr-4"
                ></v-select>
                <span class="mr-2">entries</span>
                <span class="mr-4">Search:</span>
                <v-text-field
                  v-model="lateSearch"
                  density="compact"
                  variant="outlined"
                  style="max-width: 200px"
                  hide-details
                ></v-text-field>
              </div>
            </v-card-title>
            <v-data-table
              :headers="lateHeaders"
              :items="latePatients"
              :search="lateSearch"
              :items-per-page="lateItemsPerPage"
              class="elevation-1"
            >
              <template v-slot:no-data>
                <div class="text-center pa-4">No data available in table</div>
              </template>
            </v-data-table>
          </v-card>

          <!-- Clinic Entry Patients Table -->
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Info Pasien Masuk Klinik</span>
              <div class="d-flex align-center">
                <span class="mr-2">Show</span>
                <v-select
                  v-model="clinicItemsPerPage"
                  :items="[10, 25, 50, 100]"
                  density="compact"
                  variant="outlined"
                  style="max-width: 80px"
                  class="mr-4"
                ></v-select>
                <span class="mr-2">entries</span>
                <span class="mr-4">Search:</span>
                <v-text-field
                  v-model="clinicSearch"
                  density="compact"
                  variant="outlined"
                  style="max-width: 200px"
                  hide-details
                ></v-text-field>
              </div>
            </v-card-title>
            <v-data-table
              :headers="clinicHeaders"
              :items="clinicPatients"
              :search="clinicSearch"
              :items-per-page="clinicItemsPerPage"
              class="elevation-1"
            >
              <template v-slot:no-data>
                <div class="text-center pa-4">No data available in table</div>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";

// Reactive data
const drawer = ref(true);
const rail = ref(false);
const search = ref("");
const lateSearch = ref("");
const clinicSearch = ref("");
const itemsPerPage = ref(10);
const lateItemsPerPage = ref(10);
const clinicItemsPerPage = ref(10);
const currentPage = ref("Loket Admin");

// Navigation items
const items = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
  {
    title: "Setting",
    icon: "mdi-cog",
    children: [
      { title: "Hak Akses", to: "/setting/hak-akses" },
      { title: "User Login", to: "/setting/user-login" },
      { title: "Master Loket", to: "/setting/master-loket" },
      { title: "Master Klinik", to: "/setting/master-klinik" },
      { title: "Master Klinik Ruang", to: "/setting/master-klinik-ruang" },
      { title: "Screen", to: "/setting/screen" },
    ],
  },
  { title: "Loket Admin", icon: "mdi-account-supervisor" },
  { title: "Ranap Admin", icon: "mdi-bed" },
  { title: "Klinik Admin", icon: "mdi-hospital-box", to : "/KlinikAdmin" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker" },
  { title: "Anjungan", icon: "mdi-account-box-multiple", to: "/anjungan" },
  { title: "Fast Track", icon: "mdi-clock-fast" },
  { title: "Data Pasien", icon: "mdi-account-multiple" },
  { title: "Screen", icon: "mdi-monitor" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted" },
]);

// Table headers
const mainHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Jam Panggil", value: "jamPanggil" },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Fast Track", value: "fastTrack" },
  { title: "Pembayaran", value: "pembayaran" },
  { title: "Panggil", value: "panggil" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const clinicHeaders = ref([
  { title: "#", value: "no", sortable: false },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "No RM", value: "noRM" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Fast Track", value: "fastTrack" },
  { title: "Pembayaran", value: "pembayaran" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

// Sample data
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
  {
    no: 3,
    jamPanggil: "07:35",
    barcode: "250811100355",
    noAntrian: "UM1005 | Online - 250811100355",
    shift: "Shift 1",
    klinik: "THT",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Panggil",
    status: "normal",
  },
  {
    no: 4,
    jamPanggil: "08:05",
    barcode: "250811100355",
    noAntrian: "UM1006 | Online - 250811100355",
    shift: "Shift 1",
    klinik: "THT",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Panggil",
    status: "normal",
  },
  {
    no: 5,
    jamPanggil: "12:43",
    barcode: "250811100402",
    noAntrian: "UM1004 | Online - 250811100402",
    shift: "Shift 1",
    klinik: "SARAF",
    fastTrack: "UMUM",
    pembayaran: "UMUM",
    panggil: "Panggil",
    status: "normal",
  },
]);

const latePatients = ref([]);

const clinicPatients = ref([]);

// Methods
const getRowClass = (item) => {
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

/* Custom scrollbar */
:deep(.v-data-table) {
  font-size: 14px;
}

:deep(.v-data-table__wrapper) {
  max-height: 400px;
  overflow-y: auto;
}

/* Row highlighting */
:deep(.v-data-table tbody tr:nth-child(1)) {
  background-color: #fff3cd !important;
}
</style>
