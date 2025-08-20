<template>
  <v-main class="bg-grey-lighten-3">
    <!-- Konten utama dibungkus dalam div yang menyesuaikan padding kiri -->
    <div :style="contentStyle">
      <v-container fluid>
        <p>Admin Anjungan</p>
        <v-card class="pa-5 mb-5" color="white" flat>
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
              <v-chip color="#B71C1C" class="text-caption">
                Tekan Enter. (Barcode depan nomor selalu ada huruf lain, Ex:
                J20073010005 "Hiraukan huruf 'J' nya")
              </v-chip>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn block color="info">Pendaftaran Online</v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-divider class="my-5"></v-divider>

        <v-card class="mb-5">
          <v-toolbar flat color="transparent" dense>
            <v-toolbar-title class="text-subtitle-1 font-weight-bold red--text">
              DATA PENGUNJUNG TERLAMBAT
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchLate"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              dense
              class="mr-2"
              variant="outlined"
            ></v-text-field>
            <v-select
              :items="[10, 25, 50, 100]"
              label="Show"
              dense
              single-line
              hide-details
              class="shrink"
              variant="outlined"
            ></v-select>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :headers="lateHeaders"
              :items="lateVisitors"
              :search="searchLate"
              no-data-text="No data available in table"
              hide-default-footer
              class="elevation-1"
            ></v-data-table>
            <div class="d-flex justify-end pt-2">
              <v-pagination
                v-model="page"
                :length="10"
                :total-visible="5"
              ></v-pagination>
            </div>
          </v-card-text>
        </v-card>

        <v-divider class="my-5"></v-divider>

        <v-card>
          <v-toolbar flat color="transparent" dense>
            <v-toolbar-title class="text-subtitle-1 font-weight-bold red--text">
              DATA PENGUNJUNG
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              dense
              class="mr-2"
              variant="outlined"
            ></v-text-field>
            <v-select
              :items="[10, 25, 50, 100]"
              label="Show"
              dense
              single-line
              hide-details
              class="shrink"
              variant="outlined"
            ></v-select>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="visitors"
              :search="search"
              no-data-text="No data available in table"
              class="elevation-1"
            >
              <template v-slot:item.aksi="{ item }">
                <div class="d-flex flex-column">
                  <v-btn small color="success" class="my-1">Tiket</v-btn>
                  <v-btn small color="primary" class="my-1">Tiket Pengantar</v-btn>
                  <v-btn small color="warning" class="my-1">ByPass</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </v-main>
</template>

<script setup>
import { ref, computed } from "vue";

// Definisikan props untuk menerima status 'rail' dari layout induk
const props = defineProps({
  rail: Boolean,
});

// Reactive data
const search = ref("");
const searchLate = ref("");
const page = ref(1);

// Gaya komputasi untuk menyesuaikan padding
const contentStyle = computed(() => {
  return {
    paddingLeft: props.rail ? '56px' : '256px',
    transition: 'padding-left 0.3s ease-in-out',
  };
});

// Table headers for late visitors
const lateHeaders = [
  { text: 'No', value: 'no' },
  { text: 'Barcode', value: 'barcode' },
  { text: 'No Rekamedik', value: 'noRekamedik' },
  { text: 'No Antrian', value: 'noAntrian' },
  { text: 'No Antrian Klinik', value: 'noAntrianKlinik' },
  { text: 'Shift', value: 'shift' },
  { text: 'Pembayaran', value: 'pembayaran' },
  { text: 'Status', value: 'status' },
];

// Table headers for all visitors
const headers = [
  { text: 'No', value: 'no' },
  { text: 'Barcode', value: 'barcode' },
  { text: 'No Rekamedik', value: 'noRekamedik' },
  { text: 'No Antrian', value: 'noAntrian' },
  { text: 'Shift', value: 'shift' },
  { text: 'Ket', value: 'ket' },
  { text: 'Fast Track', value: 'fastTrack' },
  { text: 'Pembayaran', value: 'pembayaran' },
  { text: 'Panggil', value: 'panggil' },
  { text: 'Aksi', value: 'aksi' },
];

// Mock data for late visitors
const lateVisitors = ref([
  { no: 1, barcode: '250813100928', noRekamedik: 'RM001', noAntrian: 'ON1045', noAntrianKlinik: 'K1', shift: 'Shift 1', pembayaran: 'JKN', status: 'Terlambat' },
  { no: 2, barcode: '250813100930', noRekamedik: 'RM002', noAntrian: 'GI1018', noAntrianKlinik: 'K2', shift: 'Shift 1', pembayaran: 'JKN', status: 'Terlambat' },
  { no: 3, barcode: '250813100937', noRekamedik: 'RM003', noAntrian: 'MT1073', noAntrianKlinik: 'K3', shift: 'Shift 1', pembayaran: 'JKN', status: 'Terlambat' },
]);

// Mock data for all visitors
const visitors = ref([
  { no: 1, barcode: '250813100928', noRekamedik: 'RM001', noAntrian: 'ON1045', shift: 'Shift 1', ket: '', fastTrack: 'Ya', pembayaran: 'JKN', panggil: 'Ya' },
  { no: 2, barcode: '250813100930', noRekamedik: 'RM002', noAntrian: 'GI1018', shift: 'Shift 1', ket: '', fastTrack: 'Tidak', pembayaran: 'JKN', panggil: 'Tidak' },
  { no: 3, barcode: '250813100937', noRekamedik: 'RM003', noAntrian: 'MT1073', shift: 'Shift 1', ket: '', fastTrack: 'Tidak', pembayaran: 'JKN', panggil: 'Tidak' },
]);
</script>
