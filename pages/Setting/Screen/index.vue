<template>
  <div class="screen-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-monitor</v-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">Screen</h1>
            <p class="page-subtitle">Rabu, 13 Agustus 2025 - Pelayanan</p>
          </div>
        </div>
        <div class="header-right">
          <!-- <v-chip color="success" variant="flat" class="mr-2">
            Total {{ totalPasien }} Pasien
          </v-chip> -->
          <v-chip color="white" variant="flat" class="text-primary" to="/Setting/screen/edit/1">
            Edit Screen
          </v-chip>
        </div>
      </div>
    </div>
    <!-- <div class="d-flex justify-space-between align-center mb-4">
      <h2>Screen</h2>
      <div class="d-flex gap-2">
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-eye">
          View
        </v-btn>
        <v-btn color="warning" prepend-icon="mdi-pencil">
          Edit
        </v-btn>
      </div>
    </div> -->

    <!-- Controls -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center gap-2">
        <span>Show</span>
        <v-select
          v-model="itemsPerPage"
          :items="[10, 25, 50, 100]"
          density="compact"
          variant="outlined"
          style="width: 80px"
        ></v-select>
        <span>entries</span>
      </div>

      <div class="d-flex align-center gap-2">
        <span>Search:</span>
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          hide-details
          style="width: 200px"
        ></v-text-field>
      </div>
    </div>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="screenItems"
      :items-per-page="itemsPerPage"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.klinik="{ item }">
        <div class="klinik-tags">
          <v-chip
            v-for="klinik in item.klinik"
            :key="klinik"
            size="small"
            class="ma-1"
            color="red"
            text-color="white"
          >
            {{ klinik }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          color="#ff9248"
          @click="editScreen(item)"
          style="color: white"
        ></v-btn>
      </template>
    </v-data-table>

    <!-- Footer -->
    <div class="d-flex justify-space-between align-center mt-4">
      <div>
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of
        {{ totalItems }} entries
      </div>

      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Data
const search = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama Screen", key: "nama_screen", sortable: true },
  { title: "Klinik", key: "klinik", sortable: false },
  { title: "Actions", key: "actions", sortable: false, width: "100px" },
];

const screenItems = ref([
  {
    id: 1,
    nama_screen: "Layar Screen 1",
    klinik: [
      "ANAK",
      "ANESTESI",
      "BEDAH",
      "GIGI DAN MULUT",
      "GERIATRI",
      "GIZI",
      "IPD",
      "JANTUNG",
    ],
  },
  {
    id: 2,
    nama_screen: "Layar Screen 2",
    klinik: [
      "JIWA",
      "KUL KEL",
      "KOMPLEMENTER",
      "MATA",
      "SARAF",
      "KANDUNGAN",
      "ONKOLOGI",
      "PARU",
    ],
  },
  {
    id: 3,
    nama_screen: "Layar Screen 3",
    klinik: [
      "RADIOTERAPI",
      "REHAB MEDIK",
      "THT",
      "MCU",
      "KEMOTERAPI",
      "R. TINDAKAN",
      "HOM",
    ],
  },
]);

// Computed
const totalItems = computed(() => screenItems.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);
const currentPageStart = computed(
  () => (currentPage.value - 1) * itemsPerPage.value + 1
);
const currentPageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
);

// Methods
const editScreen = (item) => {
  navigateTo(`/setting/screen/edit/${item.id}`);
};
</script>

<style scoped>
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


.screen-list {
  padding: 20px;
}

.klinik-tags {
  max-width: 600px;
}

.gap-2 {
  gap: 8px;
}
</style>
