<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <!-- Fast Track Content -->
      <div class="d-flex align-center justify-space-between mb-4">
        <h1 class="text-h4">Fast Track</h1>
        <div class="d-flex">
          <v-btn
            prepend-icon="mdi-view-dashboard"
            variant="text"
            class="text-capitalize"
          >
            Dashboard
          </v-btn>
          <v-btn
            prepend-icon="mdi-fast-forward"
            variant="text"
            class="text-capitalize"
          >
            Fast Track
          </v-btn>
        </div>
      </div>

      <!-- Fast Track Table -->
      <v-card class="pa-4">
        <div class="d-flex justify-space-between align-center my-3">
          <div class="d-flex align-center">
            <span>Show</span>
            <v-select
              density="compact"
              variant="outlined"
              :items="[10, 25, 50, 100]"
              class="mx-2"
              style="width: 90px"
            ></v-select>
            <span>entries</span>
          </div>
          <v-text-field
            label="Search"
            variant="outlined"
            density="compact"
            style="max-width: 200px"
          ></v-text-field>
        </div>

        <v-table class="mt-3">
          <thead>
            <tr>
              <th
                v-for="header in fastTrackHeaders"
                :key="header.text"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in fastTrackData" :key="index">
              <td>{{ item.no }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.noAntrian }}</td>
              <td>{{ item.rm }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ item.klinik }}</td>
              <td>{{ item.pj }}</td>
              <td>{{ item.keterangan }}</td>
              <td>{{ item.pembayaran }}</td>
              <td>{{ item.status }}</td>
              <td>
                <v-btn color="blue">Fast Track</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="d-flex justify-space-between align-center mt-3">
          <span>Showing 1 to 10 of 1,434 entries</span>
          <v-pagination
            v-model="page"
            :length="144"
            :total-visible="5"
          ></v-pagination>
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue";

// Reactive data
const search = ref("");
const itemsPerPage = ref(10);
const page = ref(1);

// Table headers
const fastTrackHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'Tanggal / Jam Daftar' },
  { text: 'No Antrian' },
  { text: 'RM' },
  { text: 'Shift' },
  { text: 'Klinik' },
  { text: 'PJ' },
  { text: 'Keterangan' },
  { text: 'Pembayaran' },
  { text: 'Status' },
  { text: 'Aksi' },
];

// Mock data
const fastTrackData = [
  { no: 1, barcode: '250813100928', tanggal: '13-08-2025 / 07:17', noAntrian: 'ON1045', rm: '', shift: 'Shift 1', klinik: 'ONKOLOGI', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 2, barcode: '250813100930', tanggal: '13-08-2025 / 07:19', noAntrian: 'GI1018', rm: '', shift: 'Shift 1', klinik: 'GIGI DAN MULUT', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 3, barcode: '250813100937', tanggal: '13-08-2025 / 07:19', noAntrian: 'MT1073', rm: '', shift: 'Shift 1', klinik: 'MATA', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 4, barcode: '250813100936', tanggal: '13-08-2025 / 07:19', noAntrian: 'ON1047', rm: '', shift: 'Shift 1', klinik: 'ONKOLOGI', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 5, barcode: '250813100935', tanggal: '13-08-2025 / 07:18', noAntrian: 'ON1046', rm: '', shift: 'Shift 1', klinik: 'ONKOLOGI', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 6, barcode: '250813100934', tanggal: '13-08-2025 / 07:18', noAntrian: 'IP1101', rm: '', shift: 'Shift 1', klinik: 'IPD', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Tunggu Daftar' },
  { no: 7, barcode: '250813100933', tanggal: '13-08-2025 / 07:18', noAntrian: 'UM1031', rm: '', shift: 'Shift 1', klinik: 'IPD', pj: '', keterangan: '', pembayaran: 'UMUM', status: 'Proses Barcode' },
  { no: 8, barcode: '250813100932', tanggal: '13-08-2025 / 07:17', noAntrian: 'AN1122', rm: '', shift: 'Shift 1', klinik: 'ANAK', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Proses Barcode' },
  { no: 9, barcode: '250813100931', tanggal: '13-08-2025 / 07:17', noAntrian: 'PR1033', rm: '', shift: 'Shift 1', klinik: 'PARU', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Anjungan' },
  { no: 10, barcode: '250813100930', tanggal: '13-08-2025 / 07:17', noAntrian: 'TH1035', rm: '', shift: 'Shift 1', klinik: 'THT', pj: '', keterangan: '', pembayaran: 'JKN', status: 'Anjungan' },
];
</script>
