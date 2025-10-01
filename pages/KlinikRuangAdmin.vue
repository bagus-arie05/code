<template>
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6">

      <!-- Colored Header Banner -->
      <v-card class="elevation-4 rounded-xl mb-6 header-banner d-flex align-center pa-4">
        <v-icon size="48" color="white" class="mr-4">mdi-clipboard-list-outline</v-icon>
        <h1 class="text-h4 font-weight-bold text-white">Klinik Ruang Admin</h1>
      </v-card>

      <!-- Main Content Area -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6 rounded-xl elevation-2 mb-4">
            <v-card-title class="text-h5 font-weight-bold pa-0 mb-4">
              GENERATE TIKET
            </v-card-title>
            <div class="d-flex align-center">
              <v-text-field
                label="Masukkan Barcode"
                variant="solo"
                density="compact"
                hide-details
                flat
                class="mr-4 barcode-input"
                v-model="barcodeInput"
                @keyup.enter="generateTicket"
              ></v-text-field>
              <v-chip color="#B71C1C" class="text-caption font-weight-bold text-white chip-warning">
                Tekan Enter: (Apabila barcode depan nomor ada huruf lain, ex: J008730180085 "hiraukan huruf 'J' nya")
              </v-chip>
            </div>
          </v-card>

          <v-card class="pa-6 rounded-xl elevation-2">
            <v-card-title class="text-h5 font-weight-bold pa-0 mb-4">
              Pasien Klinik Ruang Admin
            </v-card-title>
            
            <div class="d-flex justify-space-between align-center my-3">
              <div class="d-flex align-center">
                <span>Show</span>
                <v-select
                  density="compact"
                  variant="solo"
                  flat
                  :items="[10, 25, 50, 100]"
                  class="mx-2 select-items"
                  hide-details
                  v-model="itemsPerPage"
                ></v-select>
                <span>entries</span>
              </div>
              <v-text-field
                label="Search"
                variant="solo"
                density="compact"
                flat
                hide-details
                append-inner-icon="mdi-magnify"
                style="max-width: 200px"
                v-model="searchQuery"
              ></v-text-field>
            </div>

            <v-table class="mt-3 custom-table">
              <thead>
                <tr>
                  <th v-for="header in klinikRuangAdminHeaders" :key="header.text">
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedItems.length === 0">
                  <td :colspan="klinikRuangAdminHeaders.length" class="text-center text-grey">
                    Tidak ada data yang tersedia
                  </td>
                </tr>
                <tr v-for="(item, index) in paginatedItems" :key="item.no">
                  <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td>{{ item.barcode }}</td>
                  <td>{{ item.noRekamedik }}</td>
                  <td>{{ item.noAntrian }}</td>
                  <td>{{ item.noAntrianKlinik }}</td>
                  <td>{{ item.noAntrianRuang }}</td>
                  <td>{{ item.shift }}</td>
                  <td>{{ item.pembayaran }}</td>
                  <td>
                    <v-btn color="success" size="small" class="text-white">Action</v-btn>
                  </td>
                  <td>{{ item.status }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="d-flex justify-space-between align-center mt-3 pa-2">
              <span>Showing {{ showingFrom }} to {{ showingTo }} of {{ filteredItems.length }} entries</span>
              <div class="d-flex">
                <v-btn size="small" variant="flat" :disabled="currentPage === 1" @click="prevPage" class="pagination-btn">Previous</v-btn>
                <v-btn size="small" variant="flat" :disabled="currentPage === totalPages" @click="nextPage" class="pagination-btn ml-2">Next</v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  middleware:['auth']
})

// === Data Dummy untuk Tabel ===
const klinikRuangAdminHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'No Rekamedik' },
  { text: 'No Antrian' },
  { text: 'No Antrian Klinik' },
  { text: 'No Antrian Ruang' },
  { text: 'Shift' },
  { text: 'Pembayaran' },
  { text: 'Action' },
  { text: 'Status' },
];

const allItems = ref([
  { no: 1, barcode: '008730180085', noRekamedik: 'RM001', noAntrian: 'A001', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'Tunai', status: 'Selesai' },
  { no: 2, barcode: '008730180086', noRekamedik: 'RM002', noAntrian: 'A002', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'BPJS', status: 'Proses' },
  { no: 3, barcode: '008730180087', noRekamedik: 'RM003', noAntrian: 'A003', noAntrianKlinik: 'K2', noAntrianRuang: 'R2', shift: 'Siang', pembayaran: 'Tunai', status: 'Menunggu' },
  { no: 4, barcode: '008730180088', noRekamedik: 'RM004', noAntrian: 'A004', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'Tunai', status: 'Selesai' },
  { no: 5, barcode: '008730180089', noRekamedik: 'RM005', noAntrian: 'A005', noAntrianKlinik: 'K2', noAntrianRuang: 'R2', shift: 'Siang', pembayaran: 'BPJS', status: 'Proses' },
  { no: 6, barcode: '008730180090', noRekamedik: 'RM006', noAntrian: 'A006', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'Tunai', status: 'Menunggu' },
  { no: 7, barcode: '008730180091', noRekamedik: 'RM007', noAntrian: 'A007', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'BPJS', status: 'Selesai' },
  { no: 8, barcode: '008730180092', noRekamedik: 'RM008', noAntrian: 'A008', noAntrianKlinik: 'K2', noAntrianRuang: 'R2', shift: 'Siang', pembayaran: 'Tunai', status: 'Proses' },
  { no: 9, barcode: '008730180093', noRekamedik: 'RM009', noAntrian: 'A009', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'Tunai', status: 'Menunggu' },
  { no: 10, barcode: '008730180094', noRekamedik: 'RM010', noAntrian: 'A010', noAntrianKlinik: 'K2', noAntrianRuang: 'R2', shift: 'Siang', pembayaran: 'BPJS', status: 'Selesai' },
  { no: 11, barcode: '008730180095', noRekamedik: 'RM011', noAntrian: 'A011', noAntrianKlinik: 'K1', noAntrianRuang: 'R1', shift: 'Pagi', pembayaran: 'Tunai', status: 'Proses' },
]);

// === State untuk Paginasi dan Pencarian ===
const itemsPerPage = ref(10);
const currentPage = ref(1);
const searchQuery = ref('');
const barcodeInput = ref('');

// === Computed Properties untuk Filter dan Paginasi ===
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return allItems.value;
  }
  const searchLower = searchQuery.value.toLowerCase();
  return allItems.value.filter(item => {
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchLower)
    );
  });
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

const showingFrom = computed(() => {
  if (filteredItems.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const showingTo = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredItems.value.length);
});

// === Fungsi untuk Paginasi dan Pencarian ===
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const generateTicket = () => {
  // Logika untuk menambahkan data ke tabel
  if (barcodeInput.value) {
    // Hapus karakter non-digit jika ada
    const cleanedBarcode = barcodeInput.value.replace(/\D/g, '');
    const newNo = allItems.value.length + 1;
    const newItem = {
      no: newNo,
      barcode: cleanedBarcode,
      noRekamedik: `RM${String(newNo).padStart(3, '0')}`,
      noAntrian: `A${String(newNo).padStart(3, '0')}`,
      noAntrianKlinik: 'K1',
      noAntrianRuang: 'R1',
      shift: 'Pagi',
      pembayaran: 'Tunai',
      status: 'Menunggu'
    };
    allItems.value.unshift(newItem); // Tambahkan item baru di paling depan
    barcodeInput.value = ''; // Reset input
    currentPage.value = 1; // Kembali ke halaman pertama setelah menambahkan data
  }
};

// === Watcher untuk mereset halaman saat filter atau items per page berubah ===
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Scoped styles to make the page more lively */
.v-container {
  max-width: 1400px;
}

/* .header-banner {
  background: linear-gradient(45deg, #42a5f5, #1565c0); /* Blue gradient */
  /* color: white;
  padding: 24px;
} */ 

  .header-banner {
  background: linear-gradient(45deg,  #1A237E, #283593); /* Dark Blue gradient */
  color: white;
  padding: 24px;
} 


.barcode-input .v-field--variant-solo {
  background-color: #e0e0e0;
}

.chip-warning {
  border-radius: 8px;
  padding: 8px 12px;
}

.select-items {
  max-width: 80px;
}

.select-items .v-field--variant-solo {
  background-color: #e0e0e0;
}

.custom-table :deep(th) {
  background-color: #e0e0e0;
  font-weight: bold;
}

.custom-table :deep(tr) {
  background-color: #f8f8f8;
}

.custom-table :deep(tbody tr:nth-of-type(odd)) {
  background-color: #f1f1f1;
}

.pagination-btn {
  margin: 0 4px;
  background-color: #ffb38a !important;
}

.next-queue-card {
  background: linear-gradient(135deg, #00A896, #00796B); /* Teal gradient */
}

.current-queue-number {
  background-color: white;
  border: 4px solid #00A896;
}

.text-primary {
  color: #00A896 !important;
}
</style>
