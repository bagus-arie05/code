<template>
  <v-divider class="my-8"></v-divider>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <div class="d-flex align-center justify-space-between mb-4 mt-10">
        <h1 class="text-h4">Klinik Admin</h1>
        <v-tooltip text="Jumlah Maksimal Bangku Tersedia">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              class="text-white"
              color="green-darken-1"
            >
              <v-icon left>mdi-circle-small</v-icon>
              Max Quota Bangku 0
            </v-chip>
          </template>
        </v-tooltip>
      </div>

      <!-- Loket Admin Table -->
      <v-card class="mb-5 pa-4">
        <v-card-title class="d-flex justify-space-between align-center">
          Loket Admin
          <div>
            <v-tooltip text="Panggil 1 Antrian">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="green"
                  class="mr-2 clickable-btn"
                  @click="handleCallClick(1)"
                  >1</v-btn
                >
              </template>
            </v-tooltip>
            <v-tooltip text="Panggil 5 Antrian">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="blue"
                  class="mr-2 clickable-btn"
                  @click="handleCallClick(5)"
                  >5</v-btn
                >
              </template>
            </v-tooltip>
            <v-tooltip text="Panggil 10 Antrian">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="orange"
                  class="mr-2 clickable-btn"
                  @click="handleCallClick(10)"
                  >10</v-btn
                >
              </template>
            </v-tooltip>
            <v-tooltip text="Panggil 20 Antrian">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="red"
                  class="clickable-btn"
                  @click="handleCallClick(20)"
                  >20</v-btn
                >
              </template>
            </v-tooltip>
          </div>
        </v-card-title>
        <v-table class="mt-3">
          <thead>
            <tr>
              <th v-for="header in loketHeaders" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in loketData" :key="index">
              <td>{{ item.no }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.noRekamedik }}</td>
              <td>{{ item.noAntrian }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ item.ket }}</td>
              <td>{{ item.fastTrack }}</td>
              <td>{{ item.pembayaran }}</td>
              <td><v-btn size="x-small" color="primary">Panggil</v-btn></td>
              <td>
                <v-btn size="x-small" color="red">Batalkan</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex justify-space-between align-center mt-3">
          <span>Showing {{ loketData.length > 0 ? 1 : 0 }} to {{ loketData.length }} of {{ loketData.length }} entries</span>
          <div>
            <v-btn size="small" variant="text" disabled>Previous</v-btn>
            <v-btn size="small" variant="text" disabled>Next</v-btn>
          </div>
        </div>
      </v-card>

      <!-- Data Pengunjung Table -->
      <v-card class="pa-4">
        <v-card-title>Data Pengunjung: Loket</v-card-title>
        <v-table class="mt-3">
          <thead>
            <tr>
              <th v-for="header in pengunjungHeaders" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pengunjungData" :key="index">
              <td>{{ item.no }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.noRekamedik }}</td>
              <td>{{ item.noAntrian }}</td>
              <td>{{ item.noAntrianKlinik }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ item.pembayaran }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex justify-space-between align-center mt-3">
          <span>Showing {{ pengunjungData.length > 0 ? 1 : 0 }} to {{ pengunjungData.length }} of {{ pengunjungData.length }} entries</span>
          <div>
            <v-btn size="small" variant="text" disabled>Previous</v-btn>
            <v-btn size="small" variant="text" disabled>Next</v-btn>
          </div>
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue";

// Sample data for the tables
const loketData = ref([
  {
    no: 1,
    barcode: "1234567890",
    noRekamedik: "RM001",
    noAntrian: "A001",
    shift: "Pagi",
    ket: "Normal",
    fastTrack: "Tidak",
    pembayaran: "BPJS"
  },
  {
    no: 2,
    barcode: "0987654321",
    noRekamedik: "RM002",
    noAntrian: "A002",
    shift: "Pagi",
    ket: "Normal",
    fastTrack: "Ya",
    pembayaran: "Umum"
  }
]);

const pengunjungData = ref([
  {
    no: 1,
    barcode: "1234567890",
    noRekamedik: "RM001",
    noAntrian: "A001",
    noAntrianKlinik: "K001",
    shift: "Pagi",
    pembayaran: "BPJS",
    status: "Menunggu"
  },
  {
    no: 2,
    barcode: "0987654321",
    noRekamedik: "RM002",
    noAntrian: "A002",
    noAntrianKlinik: "K002",
    shift: "Pagi",
    pembayaran: "Umum",
    status: "Selesai"
  }
]);

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
]

const pengunjungHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'No Rekamedik' },
  { text: 'No Antrian' },
  { text: 'No Antrian Klinik' },
  { text: 'Shift' },
  { text: 'Pembayaran' },
  { text: 'Status' },
]

// Methods to handle clicks
const handleCallClick = (value) => {
  console.log(`Panggil ${value} antrian diklik!`);
  // Tambahkan logika untuk memanggil antrian di sini
};
</script>

<style scoped>
.clickable-btn {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.clickable-btn:hover {
  transform: translateY(-2px);
}
</style>
