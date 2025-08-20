<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-app>
    <v-app-bar>
      <v-container fluid class="pa-4">
        <v-row align="center" no-gutters class="fill-height">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <!-- Total 2 with dark background -->
              <div
                class="bg-grey-darken-4 px-3 py-1 mr-2"
                style="border-radius: 3px"
              >
                <span class="text-body-1 font-weight-bold text-white"
                  >Total 2</span
                >
              </div>
              <!-- Max 150 Pasien with lighter background -->
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

    <!-- Cyan Divider -->
    <div class="bg-cyan" style="height: 3px" />

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Date and Service Info -->
        <v-row class="mb-6">
          <v-col>
            <div class="text-h6 text-grey-darken-2 font-weight-medium">
              Loket 12 | Rabu, 13 Agustus 2025 - Pelayanan :
            </div>
          </v-col>
          <v-spacer />
          <!-- Queue Number Buttons on the right -->
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

        <!-- Next Patient Card -->
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

        <!-- Main Data Table -->
        <v-card class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            DATA PASIEN
          </v-card-title>

          <div class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <span>Show</span>
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 50]"
                label="Entries"
                density="compact"
                hide-details
                class="mx-2"
                style="width: 80px"
              />
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
              />
            </div>
          </div>

          <v-data-table
            :headers="mainHeaders"
            :items="paginatedMainPatients"
            :search="search"
            hide-default-footer
            class="elevation-1"
          >
            <template #item.aksi="{ item }">
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
            <template #item.jamPanggil="{ item }">
              <span :class="getRowClass(item)">{{ item.jamPanggil }}</span>
            </template>
          </v-data-table>

          <!-- Custom Pagination for Main Table -->
          <v-row align="center" class="pa-4">
            <v-col cols="auto">
              <span class="text-body-2 text-grey-darken-1">
                Showing {{ getStartEntry(mainCurrentPage, itemsPerPage) }} to
                {{
                  getEndEntry(
                    mainCurrentPage,
                    itemsPerPage,
                    filteredMainPatients.length
                  )
                }}
                of {{ filteredMainPatients.length }} entries
              </span>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <div class="d-flex align-center">
                <v-btn
                  :disabled="mainCurrentPage === 1"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 mr-2"
                  @click="goToMainPage(mainCurrentPage - 1)"
                >
                  Previous
                </v-btn>

                <v-btn
                  v-for="page in getVisiblePages(
                    mainCurrentPage,
                    getMainTotalPages
                  )"
                  :key="page"
                  :variant="page === mainCurrentPage ? 'flat' : 'text'"
                  :color="
                    page === mainCurrentPage ? 'primary' : 'grey-lighten-1'
                  "
                  size="small"
                  class="mx-1"
                  min-width="35"
                  @click="goToMainPage(page)"
                >
                  {{ page }}
                </v-btn>

                <v-btn
                  :disabled="mainCurrentPage === getMainTotalPages"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 ml-2"
                  @click="goToMainPage(mainCurrentPage + 1)"
                >
                  Next
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Total Quota Used -->
        <v-card color="cyan" dark class="mb-4">
          <v-card-text class="text-center">
            <div class="text-h6">Total Quota Terpakai 5</div>
          </v-card-text>
        </v-card>

        <!-- Late Patients Table -->
        <v-card class="mb-4">
          <v-card-title
            class="text-subtitle-1 font-weight-bold bg-red-lighten-3"
          >
            INFO PASIEN LAPOR TERLAMBAT
          </v-card-title>

          <div class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <span>Show</span>
              <v-select
                v-model="lateItemsPerPage"
                :items="[10, 25, 50]"
                label="Entries"
                density="compact"
                hide-details
                class="mx-2"
                style="width: 80px"
              />
              <span>entries</span>
            </div>

            <div class="d-flex align-center">
              <span class="mr-2">Search:</span>
              <v-text-field
                v-model="lateSearch"
                label="Search"
                hide-details
                density="compact"
                style="min-width: 200px"
              />
            </div>
          </div>

          <v-data-table
            :headers="lateHeaders"
            :items="paginatedLatePatients"
            :search="lateSearch"
            hide-default-footer
            class="elevation-1"
          >
            <template #no-data>
              <div class="text-center pa-4">No data available in table</div>
            </template>
          </v-data-table>

          <!-- Custom Pagination for Late Patients -->
          <v-row
            v-if="filteredLatePatients.length > 0"
            align="center"
            class="pa-4"
          >
            <v-col cols="auto">
              <span class="text-body-2 text-grey-darken-1">
                Showing
                {{ getStartEntry(lateCurrentPage, lateItemsPerPage) }} to
                {{
                  getEndEntry(
                    lateCurrentPage,
                    lateItemsPerPage,
                    filteredLatePatients.length
                  )
                }}
                of {{ filteredLatePatients.length }} entries
              </span>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <div class="d-flex align-center">
                <v-btn
                  :disabled="lateCurrentPage === 1"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 mr-2"
                  @click="goToLatePage(lateCurrentPage - 1)"
                >
                  Previous
                </v-btn>

                <v-btn
                  v-for="page in getVisiblePages(
                    lateCurrentPage,
                    getLateTotalPages
                  )"
                  :key="page"
                  :variant="page === lateCurrentPage ? 'flat' : 'text'"
                  :color="
                    page === lateCurrentPage ? 'primary' : 'grey-lighten-1'
                  "
                  size="small"
                  class="mx-1"
                  min-width="35"
                  @click="goToLatePage(page)"
                >
                  {{ page }}
                </v-btn>

                <v-btn
                  :disabled="lateCurrentPage === getLateTotalPages"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 ml-2"
                  @click="goToLatePage(lateCurrentPage + 1)"
                >
                  Next
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Clinic Entry Patients Table -->
        <v-card class="mb-4">
          <v-card-title
            class="text-subtitle-1 font-weight-bold bg-red-lighten-3"
          >
            INFO PASIEN MASUK KLINIK
          </v-card-title>

          <div class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <span>Show</span>
              <v-select
                v-model="clinicItemsPerPage"
                :items="[10, 25, 50]"
                label="Entries"
                density="compact"
                hide-details
                class="mx-2"
                style="width: 80px"
              />
              <span>entries</span>
            </div>

            <div class="d-flex align-center">
              <span class="mr-2">Search:</span>
              <v-text-field
                v-model="clinicSearch"
                label="Search"
                hide-details
                density="compact"
                style="min-width: 200px"
              />
            </div>
          </div>

          <v-data-table
            :headers="clinicHeaders"
            :items="paginatedClinicPatients"
            :search="clinicSearch"
            hide-default-footer
            class="elevation-1"
          >
            <template #no-data>
              <div class="text-center pa-4">No data available in table</div>
            </template>
          </v-data-table>

          <!-- Custom Pagination for Clinic Patients -->
          <v-row
            v-if="filteredClinicPatients.length > 0"
            align="center"
            class="pa-4"
          >
            <v-col cols="auto">
              <span class="text-body-2 text-grey-darken-1">
                Showing
                {{ getStartEntry(clinicCurrentPage, clinicItemsPerPage) }} to
                {{
                  getEndEntry(
                    clinicCurrentPage,
                    clinicItemsPerPage,
                    filteredClinicPatients.length
                  )
                }}
                of {{ filteredClinicPatients.length }} entries
              </span>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <div class="d-flex align-center">
                <v-btn
                  :disabled="clinicCurrentPage === 1"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 mr-2"
                  @click="goToClinicPage(clinicCurrentPage - 1)"
                >
                  Previous
                </v-btn>

                <v-btn
                  v-for="page in getVisiblePages(
                    clinicCurrentPage,
                    getClinicTotalPages
                  )"
                  :key="page"
                  :variant="page === clinicCurrentPage ? 'flat' : 'text'"
                  :color="
                    page === clinicCurrentPage ? 'primary' : 'grey-lighten-1'
                  "
                  size="small"
                  class="mx-1"
                  min-width="35"
                  @click="goToClinicPage(page)"
                >
                  {{ page }}
                </v-btn>

                <v-btn
                  :disabled="clinicCurrentPage === getClinicTotalPages"
                  variant="text"
                  size="small"
                  class="text-grey-darken-1 ml-2"
                  @click="goToClinicPage(clinicCurrentPage + 1)"
                >
                  Next
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Define interfaces for type safety
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

// Reactive data
const search = ref<string>("");
const lateSearch = ref<string>("");
const clinicSearch = ref<string>("");
const itemsPerPage = ref<number>(10);
const lateItemsPerPage = ref<number>(10);
const clinicItemsPerPage = ref<number>(10);

// Pagination current pages
const mainCurrentPage = ref<number>(1);
const lateCurrentPage = ref<number>(1);
const clinicCurrentPage = ref<number>(1);

// Table headers
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

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Barcode", value: "barcode", sortable: true },
  { title: "No Antrian", value: "noAntrian", sortable: true },
  { title: "Shift", value: "shift", sortable: true},
  { title: "Klinik", value: "klinik", sortable: true },
  { title: "Aksi", value: "aksi", sortable: false },
]);

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

// Sample data - Extended for pagination demo
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
  // Add more sample data for pagination demo
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

const latePatients = ref<LatePatient[]>([]);
const clinicPatients = ref<ClinicPatient[]>([]);

// Computed properties for filtering
const filteredMainPatients = computed(() => {
  if (!search.value) return mainPatients.value;
  return mainPatients.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const filteredLatePatients = computed(() => {
  if (!lateSearch.value) return latePatients.value;
  return latePatients.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(lateSearch.value.toLowerCase())
    )
  );
});

const filteredClinicPatients = computed(() => {
  if (!clinicSearch.value) return clinicPatients.value;
  return clinicPatients.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(clinicSearch.value.toLowerCase())
    )
  );
});

// Computed properties for pagination
const getMainTotalPages = computed(() => {
  return Math.ceil(filteredMainPatients.value.length / itemsPerPage.value);
});

const getLateTotalPages = computed(() => {
  return Math.ceil(filteredLatePatients.value.length / lateItemsPerPage.value);
});

const getClinicTotalPages = computed(() => {
  return Math.ceil(
    filteredClinicPatients.value.length / clinicItemsPerPage.value
  );
});

const paginatedMainPatients = computed(() => {
  const start = (mainCurrentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMainPatients.value.slice(start, end);
});

const paginatedLatePatients = computed(() => {
  const start = (lateCurrentPage.value - 1) * lateItemsPerPage.value;
  const end = start + lateItemsPerPage.value;
  return filteredLatePatients.value.slice(start, end);
});

const paginatedClinicPatients = computed(() => {
  const start = (clinicCurrentPage.value - 1) * clinicItemsPerPage.value;
  const end = start + clinicItemsPerPage.value;
  return filteredClinicPatients.value.slice(start, end);
});

// Methods
const getRowClass = (item: Patient): string => {
  if (item.status === "current") {
    return "text-green font-weight-bold";
  }
  return "";
};

const getStartEntry = (currentPage: number, itemsPerPage: number): number => {
  return (currentPage - 1) * itemsPerPage + 1;
};

const getEndEntry = (currentPage: number, itemsPerPage: number, totalItems: number): number => {
  const end = currentPage * itemsPerPage;
  return Math.min(end, totalItems);
};

const getVisiblePages = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const total = totalPages;
  const current = currentPage;

  if (total <= 0) return pages;

  // Always show first page
  pages.push(1);

  // Show pages around current page
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  // Add ellipsis if needed
  if (start > 2) pages.push("...");

  // Add middle pages
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i);
    }
  }

  // Add ellipsis if needed
  if (end < total - 1) pages.push("...");

  // Always show last page if more than 1 page
  if (total > 1) pages.push(total);

  return pages;
};

const goToMainPage = (page: number): void => {
  if (
    page >= 1 &&
    page <= getMainTotalPages.value &&
    typeof page === "number"
  ) {
    mainCurrentPage.value = page;
  }
};

const goToLatePage = (page: number): void => {
  if (
    page >= 1 &&
    page <= getLateTotalPages.value &&
    typeof page === "number"
  ) {
    lateCurrentPage.value = page;
  }
};

const goToClinicPage = (page: number): void => {
  if (
    page >= 1 &&
    page <= getClinicTotalPages.value &&
    typeof page === "number"
  ) {
    clinicCurrentPage.value = page;
  }
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

/* Custom scrollbar */
:deep(.v-data-table) {
  font-size: 14px;
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