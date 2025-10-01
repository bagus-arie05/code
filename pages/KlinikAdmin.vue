<template>
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6">

      <!-- Colored Header with Quota Chip -->
      <v-card class="elevation-4 rounded-xl mb-6 header-banner d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon size="48" color="white" class="mr-4">mdi-account-group-outline</v-icon>
          <h1 class="text-h4 font-weight-bold text-white">Klinik Admin</h1>
        </div>
        <v-tooltip text="Jumlah Maksimal Bangku Tersedia" location="bottom">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              class="text-white px-4 py-2"
              color="green-lighten-1"
              variant="flat"
              rounded="xl"
            >
              <v-icon start>mdi-chair-rolling</v-icon>
              Max Quota Bangku 0
            </v-chip>
          </template>
        </v-tooltip>
      </v-card>

      <!-- Loket Admin Table -->
      <v-card class="mb-6 pa-6 rounded-xl elevation-2">
        <v-card-title class="d-flex justify-space-between align-center text-h5 font-weight-bold pa-0 mb-4">
          Loket Admin
          <div>
            <v-btn
              color="green-lighten-1"
              variant="flat"
              rounded="xl"
              class="text-white elevation-4 mr-2 btn-call-group"
              @click="handleCallClick(1)"
            >
              <v-icon start>mdi-numeric-1-box</v-icon>
              <span class="d-none d-md-inline">Panggil 1 Antrian</span>
            </v-btn>
            <v-btn
              color="blue-lighten-1"
              variant="flat"
              rounded="xl"
              class="text-white elevation-4 mr-2 btn-call-group"
              @click="handleCallClick(5)"
            >
              <v-icon start>mdi-numeric-5-box</v-icon>
              <span class="d-none d-md-inline">Panggil 5 Antrian</span>
            </v-btn>
            <v-btn
              color="orange-lighten-1"
              variant="flat"
              rounded="xl"
              class="text-white elevation-4 mr-2 btn-call-group"
              @click="handleCallClick(10)"
            >
              <v-icon start>mdi-numeric-10-box</v-icon>
              <span class="d-none d-md-inline">Panggil 10 Antrian</span>
            </v-btn>
            <v-btn
              color="red-lighten-1"
              variant="flat"
              rounded="xl"
              class="text-white elevation-4 btn-call-group"
              @click="handleCallClick(20)"
            >
              <v-icon start>mdi-numeric-20-box</v-icon>
              <span class="d-none d-md-inline">Panggil 20 Antrian</span>
            </v-btn>
          </div>
        </v-card-title>
        
        <!-- Pilihan Show Entries untuk Loket Admin -->
        <div class="d-flex justify-end mb-4">
          <div class="d-flex align-center">
            <span class="mr-2 text-subtitle-1">Show Entries:</span>
            <v-select
              :items="[10, 25, 50]"
              v-model="itemsPerPageLoket"
              variant="outlined"
              density="compact"
              hide-details
              class="show-entries-select"
            ></v-select>
          </div>
        </div>

        <v-table class="mt-3 custom-table rounded-lg elevation-0">
          <thead>
            <tr>
              <th v-for="header in loketHeaders" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedLoketData" :key="index">
              <td>{{ item.no }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.noRekamedik }}</td>
              <td>{{ item.noAntrian }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ item.ket }}</td>
              <td>{{ item.fastTrack }}</td>
              <td>{{ item.pembayaran }}</td>
              <td>
                <v-btn size="small" color="primary" class="text-white rounded-lg" @click="handlePanggil(item)">
                  <v-icon start>mdi-phone-incoming</v-icon>
                  Panggil
                </v-btn>
              </td>
              <td>
                <v-btn size="small" color="red-darken-1" class="text-white rounded-lg" @click="handleBatalkan(item)">
                  <v-icon start>mdi-close</v-icon>
                  Batalkan
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex justify-space-between align-center mt-3 pa-2">
          <span>
            Menampilkan {{ (currentPageLoket - 1) * itemsPerPageLoket + 1 }} hingga
            {{ Math.min(currentPageLoket * itemsPerPageLoket, loketData.length) }} dari
            {{ loketData.length }} entri
          </span>
          <div>
            <v-btn size="small" variant="flat" :disabled="currentPageLoket === 1" class="pagination-btn" @click="handlePageChangeLoket(currentPageLoket - 1)">Previous</v-btn>
            <v-btn size="small" variant="flat" :disabled="currentPageLoket >= totalPagesLoket" class="pagination-btn" @click="handlePageChangeLoket(currentPageLoket + 1)">Next</v-btn>
          </div>
        </div>
      </v-card>

      <!-- Data Pengunjung Table -->
      <v-card class="pa-6 rounded-xl elevation-2">
        <v-card-title class="text-h5 font-weight-bold pa-0 mb-4">
          Data Pengunjung: Loket
        </v-card-title>
        
        <!-- Pilihan Show Entries untuk Data Pengunjung -->
        <div class="d-flex justify-end mb-4">
          <div class="d-flex align-center">
            <span class="mr-2 text-subtitle-1">Show Entries:</span>
            <v-select
              :items="[10, 25, 50]"
              v-model="itemsPerPagePengunjung"
              variant="outlined"
              density="compact"
              hide-details
              class="show-entries-select"
            ></v-select>
          </div>
        </div>

        <v-table class="mt-3 custom-table rounded-lg elevation-0">
          <thead>
            <tr>
              <th v-for="header in pengunjungHeaders" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedPengunjungData" :key="index">
              <td>{{ item.no }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.noRekamedik }}</td>
              <td>{{ item.noAntrian }}</td>
              <td>{{ item.noAntrianKlinik }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ item.pembayaran }}</td>
              <td>
                <v-chip :color="item.status === 'Selesai' ? 'green' : 'orange'" size="small">
                  {{ item.status }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex justify-space-between align-center mt-3 pa-2">
          <span>
            Menampilkan {{ (currentPagePengunjung - 1) * itemsPerPagePengunjung + 1 }} hingga
            {{ Math.min(currentPagePengunjung * itemsPerPagePengunjung, pengunjungData.length) }} dari
            {{ pengunjungData.length }} entri
          </span>
          <div>
            <v-btn size="small" variant="flat" :disabled="currentPagePengunjung === 1" class="pagination-btn" @click="handlePageChangePengunjung(currentPagePengunjung - 1)">Previous</v-btn>
            <v-btn size="small" variant="flat" :disabled="currentPagePengunjung >= totalPagesPengunjung" class="pagination-btn" @click="handlePageChangePengunjung(currentPagePengunjung + 1)">Next</v-btn>
          </div>
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  middleware:['auth']
})

// Generate dummy data
const generateDummyData = (count) => {
  const data = [];
  const shiftOptions = ['Pagi', 'Siang', 'Sore'];
  const pembayaranOptions = ['BPJS', 'Umum', 'Asuransi'];
  const statusOptions = ['Menunggu', 'Selesai', 'Di-cancel'];

  for (let i = 1; i <= count; i++) {
    data.push({
      no: i,
      barcode: `B${1000 + i}`,
      noRekamedik: `RM${100 + i}`,
      noAntrian: `A${100 + i}`,
      noAntrianKlinik: `K${100 + i}`,
      shift: shiftOptions[Math.floor(Math.random() * shiftOptions.length)],
      ket: "Dummy Data",
      fastTrack: Math.random() > 0.5 ? "Ya" : "Tidak",
      pembayaran: pembayaranOptions[Math.floor(Math.random() * pembayaranOptions.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
    });
  }
  return data;
};

// State for Loket Admin table
const loketData = ref(generateDummyData(50));
const currentPageLoket = ref(1);
const itemsPerPageLoket = ref(10);

// State for Data Pengunjung table
const pengunjungData = ref(generateDummyData(50));
const currentPagePengunjung = ref(1);
const itemsPerPagePengunjung = ref(10);

// Computed properties for Loket Admin table
const paginatedLoketData = computed(() => {
  const start = (currentPageLoket.value - 1) * itemsPerPageLoket.value;
  const end = start + itemsPerPageLoket.value;
  return loketData.value.slice(start, end);
});

const totalPagesLoket = computed(() => {
  return Math.ceil(loketData.value.length / itemsPerPageLoket.value);
});

// Computed properties for Data Pengunjung table
const paginatedPengunjungData = computed(() => {
  const start = (currentPagePengunjung.value - 1) * itemsPerPagePengunjung.value;
  const end = start + itemsPerPagePengunjung.value;
  return pengunjungData.value.slice(start, end);
});

const totalPagesPengunjung = computed(() => {
  return Math.ceil(pengunjungData.value.length / itemsPerPagePengunjung.value);
});

// Method to handle page change for Loket Admin table
const handlePageChangeLoket = (page) => {
  if (page >= 1 && page <= totalPagesLoket.value) {
    currentPageLoket.value = page;
  }
};

// Method to handle page change for Data Pengunjung table
const handlePageChangePengunjung = (page) => {
  if (page >= 1 && page <= totalPagesPengunjung.value) {
    currentPagePengunjung.value = page;
  }
};

// Methods to handle button clicks (unchanged)
const loketHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'No Rekamedik' },
  { text: 'No Antrian' },
  { text: 'Shift' },
  { text: 'Ket' },
  { text: 'Fast Track' },
  { text: 'Pembayaran' },
  { text: 'Panggil' },
  { text: 'Aksi' },
];

const pengunjungHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'No Rekamedik' },
  { text: 'No Antrian' },
  { text: 'No Antrian Klinik' },
  { text: 'Shift' },
  { text: 'Pembayaran' },
  { text: 'Status' },
];

const handleCallClick = (value) => {
  console.log(`Panggil ${value} antrian diklik!`);
};

const handlePanggil = (item) => {
  console.log('Panggil pasien:', item);
};

const handleBatalkan = (item) => {
  console.log('Batalkan pasien:', item);
};
</script>

<style scoped>
/* Main container padding */
.v-container {
  max-width: 1400px;
}

.header-banner {
  background: linear-gradient(45deg, #1A237E, #283593); /* Deep blue gradient */
  color: white;
}

/* General card styling */
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Call buttons group */
.btn-call-group {
  min-width: 50px;
  height: 40px !important;
  font-weight: bold;
}

/* Table styling */
.custom-table {
  border: 1px solid #e0e0e0;
}

.custom-table :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
}

.custom-table :deep(tr:hover) {
  background-color: #e8eaf6 !important; /* Light blue on hover */
  cursor: pointer;
}

.custom-table :deep(tbody tr:nth-of-type(odd)) {
  background-color: #fafafa;
}

.pagination-btn {
  margin: 0 4px;
  background-color: #e0e0e0 !important;
}

/* Custom styling for status chip */
.v-chip.v-chip--size-small {
  padding: 4px 8px;
  font-size: 0.75rem;
}

.show-entries-select {
  max-width: 100px;
}
</style>
