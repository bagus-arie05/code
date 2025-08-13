<template>
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

          <v-divider
            class="my-5"
            color="deep-orange-darken-4"
            thickness="8"
          ></v-divider>

          <v-card class="mb-5">
            <v-toolbar flat color="transparent" dense>
              <v-toolbar-title
                class="text-subtitle-1 font-weight-bold red--text"
                >DATA PENGUNJUNG TERLAMBAT</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchLate"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                dense
                class="mr-2"
              ></v-text-field>
              <v-select
                :items="[10, 25, 50, 100]"
                label="Show"
                dense
                single-line
                hide-details
                class="shrink"
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

          <v-divider
            class="my-5"
            color="blue-darken-4"
            thickness="8"
          ></v-divider>

          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-bold bg-red-lighten-3">
            DATA PENGUNJUNG
            </v-card-title>
          </v-card>
            <div class="d-flex justify-space-between align-center ps-4">
              <div class="d-flex align-center">
                <span>Show</span>
                <v-select
                  :items="[10, 25, 50]"
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
                  label="Search"
                  hide-details
                  density="compact"
                  style="min-width: 200px"
                ></v-text-field>
              </div>
            </div>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="mainPatients"
                :search="search"
                no-data-text="No data available in table"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50, 100],
                  'show-current-page': true,
                }"
              >
                <template v-slot:item.aksi="{ item }">
                  <div class="d-flex ga-1">
                    <v-btn small color="success" class="d-flex flex-row" variant="flat">Tiket</v-btn>
                    <v-btn small color="success" class="d-flex flex-row" variant="flat"
                      >Tiket Pengantar</v-btn
                    >
                    <v-btn small color="info"class="d-flex flex-row" variant="flat">ByPass</v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>

</template>

<script setup lang="ts">
import { ref } from "vue";

// const drawer = ref(true); // Nilai awal true agar sidebar terlihat
// const rail = ref(true); // Nilai awal true agar sidebar dimulai dalam mode rail

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
// const searchLate = ref('');
// const page = ref(1);
// const lateVisitors = ref('');
// // const lateHeaders = ref ('');
// definePageMeta({
//   layout: 'MainL'
// });
</script>
