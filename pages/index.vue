<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-container fluid class="bg-grey-lighten-4 pa-4">
    <p class="mb-4">Admin Anjungan</p>
    <v-card flat>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              label="Barcode"
              placeholder="Masukkan Barcode"
              outlined
              dense
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-chip color="#B71C1C" class="text-caption" text-color="white">
              Tekan Enter. (Barcode depan nomor selalu ada huruf lain, Ex:
              J20073010005 "Hiraukan huruf 'J' nya")
            </v-chip>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn block color="info">Pendaftaran Online</v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider :thickness="5" color="deep-orange-darken-4"></v-divider>

      <v-card-text>
        <v-toolbar flat color="transparent" dense>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold red--text">
            DATA PENGUNJUNG TERLAMBAT
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <span>Show</span>
            <v-select
              :items="[10, 25, 50, 100]"
              label="entries"
              dense
              single-line
              hide-details
              class="shrink mx-2"
              style="width: 80px"
            ></v-select>
            <span>entries</span>
          </div>
        </v-toolbar>
        <v-data-table
          :headers="lateHeaders"
          :items="lateVisitors"
          :search="searchLate"
          no-data-text="No data available in table"
          hide-default-footer
          class="elevation-1"
        >
        </v-data-table>
        <!-- Custom Pagination for Late Visitors -->
        <div class="d-flex justify-space-between align-center pt-4">
          <div class="text-body-2 text-grey-darken-1">
            Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalLateEntries }} entries
          </div>
          <div class="d-flex align-center">
            <v-btn
              :disabled="currentPage === 1"
              @click="previousPage"
              variant="text"
              size="small"
              class="text-body-2"
            >
              Previous
            </v-btn>
            <template v-for="page in visiblePages" :key="page">
              <v-btn
                v-if="page !== '...'"
                :color="page === currentPage ? 'primary' : ''"
                :variant="page === currentPage ? 'flat' : 'text'"
                @click="goToPage(page)"
                size="small"
                class="mx-1"
                min-width="40"
              >
                {{ page }}
              </v-btn>
              <span v-else class="mx-1">...</span>
            </template>
            <v-btn
              :disabled="currentPage === totalPages"
              @click="nextPage"
              variant="text"
              size="small"
              class="text-body-2"
            >
              Next
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <v-divider :thickness="5" color="deep-orange-darken-4"></v-divider>

      <v-card-text>
        <v-toolbar flat color="transparent" dense>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            DATA PENGUNJUNG
          </v-toolbar-title>
        </v-toolbar>
        <div class="d-flex justify-space-between align-center px-4">
          <div class="d-flex align-center">
            <span>Show</span>
            <v-select
              :items="[10, 25, 50]"
              v-model="itemsPerPage"
              label="Entries"
              density="compact"
              hide-details
              class="mx-2"
              style="width: 80px"
            ></v-select>
            <span>entries</span>
          </div>
          <div class="d-flex align-center">
            <span class="mr-2">Search:</span>
            <v-text-field
              v-model="search"
              label="Search"
              hide-details
              density="compact"
              style="min-width: 200px"
            ></v-text-field>
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="paginatedMainPatients"
          :search="search"
          no-data-text="No data available in table"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex ga-1">
              <v-btn small color="success" class="d-flex flex-row" variant="flat">Tiket</v-btn>
              <v-btn small color="success" class="d-flex flex-row" variant="flat"
                >Tiket Pengantar</v-btn
              >
              <v-btn small color="info" class="d-flex flex-row" variant="flat">ByPass</v-btn>
            </div>
          </template>
        </v-data-table>
        <!-- Custom Pagination for Main Patients -->
        <div class="d-flex justify-space-between align-center pt-4">
          <div class="text-body-2 text-grey-darken-1">
            Showing {{ mainCurrentPageStart }} to {{ mainCurrentPageEnd }} of {{ totalMainEntries }} entries
          </div>
          <div class="d-flex align-center">
            <v-btn
              :disabled="mainCurrentPage === 1"
              @click="mainPreviousPage"
              variant="text"
              size="small"
              class="text-body-2"
            >
              Previous
            </v-btn>
            <template v-for="page in mainVisiblePages" :key="page">
              <v-btn
                v-if="page !== '...'"
                :color="page === mainCurrentPage ? 'primary' : ''"
                :variant="page === mainCurrentPage ? 'flat' : 'text'"
                @click="mainGoToPage(page)"
                size="small"
                class="mx-1"
                min-width="40"
              >
                {{ page }}
              </v-btn>
              <span v-else class="mx-1">...</span>
            </template>
            <v-btn
              :disabled="mainCurrentPage === mainTotalPages"
              @click="mainNextPage"
              variant="text"
              size="small"
              class="text-body-2"
            >
              Next
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Struktur data yang memisahkan menu dengan dan tanpa submenu
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
  { title: "Klinik Admin", icon: "mdi-hospital-box" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker" },
  { title: "Anjungan", icon: "mdi-account-box-multiple", to: "/anjungan" },
  { title: "Fast Track", icon: "mdi-clock-fast" },
  { title: "Data Pasien", icon: "mdi-account-multiple" },
  { title: "Screen", icon: "mdi-monitor" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted" },
]);

const headers = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Tgl Daftar", value: "tglDaftar", sortable: true },
  { title: "RM", value: "rm", sortable: true },
  { title: "Barcode", value: "barcode", sortable: true },
  { title: "No Antrian", value: "noAntrian", sortable: true },
  { title: "No Klinik", value: "noKlinik", sortable: true },
  { title: "Shift", value: "shift", sortable: true },
  { title: "Klinik", value: "klinik", sortable: true },
  { title: "Pembayaran", value: "pembayaran", sortable: true },
  { title: "Masuk", value: "masuk", sortable: true },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const mainPatients = ref([
  {
    no: 1,
    tglDaftar: "12:49",
    rm: "250811100163",
    noAntrian: "UM1001 | Online - 250811100163",
    noKlinik: "THT",
    barcode: "2321232",
    shift: "Shift 1",
    klinik: "KANDUNGAN",
    pembayaran: "UMUM",
    masuk : "TIDAK",
    status: "current",
  },
  {
    no: 2,
    tglDaftar: "18:23",
    rm: "42081123200199",
    noAntrian: "UM1001 | Online - 250811100163",
    noKlinik: "THT",
    barcode: "2321985",
    shift: "Shift 1",
    klinik: "DALAM",
    pembayaran: "UMUM",
    masuk : "TIDAK",
    status: "current",
  },
  {
    no: 3,
    tglDaftar: "02:19",
    rm: "15092710084",
    noAntrian: "UM1001 | Online - 250811100163",
    noKlinik: "THT",
    barcode: "2321777",
    shift: "Shift 1",
    klinik: "ANAK",
    pembayaran: "UMUM",
    masuk : "TIDAK",
    status: "current",
  },
  {
    no: 4,
    tglDaftar: "10:09",
    rm: "250254310011",
    noAntrian: "UM1001 | Online - 250811100163",
    noKlinik: "THT",
    barcode: "2321298",
    shift: "Shift 1",
    klinik: "JANTUNG",
    pembayaran: "UMUM",
    masuk : "TIDAK",
    status: "current",
  },
]);

const search = ref("");
const itemsPerPage = ref(10);

// Pagination for Late Visitors
const searchLate = ref('');
const lateHeaders = ref([]);
const lateVisitors = ref([]);
const currentPage = ref(1);
const totalLateEntries = computed(() => lateVisitors.value.length);
const totalPages = computed(() => Math.ceil(totalLateEntries.value / itemsPerPage.value));
const currentPageStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const currentPageEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalLateEntries.value));

// Pagination for Main Patients
const mainCurrentPage = ref(1);
const totalMainEntries = computed(() => mainPatients.value.length);
const mainTotalPages = computed(() => Math.ceil(totalMainEntries.value / itemsPerPage.value));
const mainCurrentPageStart = computed(() => (mainCurrentPage.value - 1) * itemsPerPage.value + 1);
const mainCurrentPageEnd = computed(() => Math.min(mainCurrentPage.value * itemsPerPage.value, totalMainEntries.value));

// Paginated data for main patients
const paginatedMainPatients = computed(() => {
  const start = (mainCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return mainPatients.value.slice(start, end);
});

// Visible pages calculation for Late Visitors
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  return pages;
});

// Visible pages calculation for Main Patients
const mainVisiblePages = computed(() => {
  const pages = [];
  const total = mainTotalPages.value;
  const current = mainCurrentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  return pages;
});

// Pagination methods for Late Visitors
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

// Pagination methods for Main Patients
const mainPreviousPage = () => {
  if (mainCurrentPage.value > 1) {
    mainCurrentPage.value--;
  }
};

const mainNextPage = () => {
  if (mainCurrentPage.value < mainTotalPages.value) {
    mainCurrentPage.value++;
  }
};

const mainGoToPage = (page: number) => {
  mainCurrentPage.value = page;
};
</script>