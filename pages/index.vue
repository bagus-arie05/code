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
            <v-btn block color=#ff9248 style="color:white;">Pendaftaran Online</v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider :thickness="5" color="deep-orange-darken-4"></v-divider>

      <TabelData
        :headers="lateHeaders"
        :items="lateVisitors"
        title="DATA PENGUNJUNG TERLAMBAT"
      />

      <v-divider :thickness="5" color="deep-orange-darken-4"></v-divider>

      <TabelData
        :headers="mainHeaders"
        :items="mainPatients"
        title="DATA PENGUNJUNG"
      >
        <template v-slot:actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn small color=#ff9248 class="d-flex flex-row" variant="flat" style="color:white;">PASIEN</v-btn>
            <v-btn small color="grey-lighten-3" class="d-flex flex-row" variant="flat"
              >PENGANTAR</v-btn
            >
            <v-btn small color="info" class="d-flex flex-row" variant="flat">ByPass</v-btn>
          </div>
        </template>
      </TabelData>
      
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabelData from "../components/TabelData.vue"; // Pastikan path-nya benar

// Ini adalah data yang akan menjadi "single source of truth"
// untuk tabel Anda. Data ini dikirim sebagai props ke komponen anak.

const mainHeaders = ref([
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
    masuk: "TIDAK",
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
    masuk: "TIDAK",
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
    masuk: "TIDAK",
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
    masuk: "TIDAK",
    status: "current",
  },
]);

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false },
  // Tambahkan headers spesifik untuk tabel ini jika berbeda
]);

const lateVisitors = ref([
  // Tambahkan data spesifik untuk tabel ini jika ada
]);

// ... Sisa kode lainnya yang tidak terkait dengan tabel ...
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
</script>