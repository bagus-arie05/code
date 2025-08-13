<template>
  <v-app>
    <v-layout>
      <!-- App Bar Header -->
      <v-app-bar app color="green darken-1" dark>
        <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-2">Antrian RSSA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <span class="mr-2">Rajal Bayu Nogroho</span>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent app>
        <v-list density="compact" nav>
          <template v-for="item in items" :key="item.title">
            <v-menu
              v-if="item.children"
              open-on-hover
              location="end"
              :nudge-right="3"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :value="item.title"
                  :class="{ 'v-list-item--active': item.title === currentPage }"
                >
                </v-list-item>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item
                  v-for="child in item.children"
                  :key="child.title"
                  :to="child.to"
                  link
                >
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-list-item
              v-else
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              :value="item.title"
              :class="{ 'v-list-item--active': item.title === currentPage }"
              link
            ></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>    

      <v-main>
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

          <v-divider class="my-5"></v-divider>

          <v-card>
            <v-toolbar flat color="transparent" dense>
              <v-toolbar-title
                class="text-subtitle-1 font-weight-bold red--text"
                >DATA PENGUNJUNG</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
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
                :headers="headers"
                :items="visitors"
                :search="search"
                no-data-text="No data available in table"
                class="elevation-1"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50, 100],
                  'show-current-page': true,
                }"
              >
                <template v-slot:item.aksi="{ item }">
                  <div class="d-flex flex-column">
                    <v-btn small color="success" class="my-1">Tiket</v-btn>
                    <v-btn small color="primary" class="my-1"
                      >Tiket Pengantar</v-btn
                    >
                    <v-btn small color="warning" class="my-1">ByPass</v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(true); // Nilai awal true agar sidebar terlihat
const rail = ref(true); // Nilai awal true agar sidebar dimulai dalam mode rail
const search = ref("");
const lateSearch = ref("");
const clinicSearch = ref("");
const itemsPerPage = ref(10);
const lateItemsPerPage = ref(10);
const clinicItemsPerPage = ref(10);
const currentPage = ref("Admin Anjungan");


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
  { title: "Loket Admin", icon: "mdi-account-supervisor", to : "/LoketAdmin" },
  { title: "Ranap Admin", icon: "mdi-bed" },
  { title: "Klinik Admin", icon: "mdi-hospital-box", to : "/KlinikAdmin" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker", to: "/KlinikRuangAdmin" },
  { title: "Anjungan", icon: "mdi-account-box-multiple", to: "/anjungan" },
  { title: "Fast Track", icon: "mdi-clock-fast" },
  { title: "Data Pasien", icon: "mdi-account-multiple" },
  { title: "Screen", icon: "mdi-monitor" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted" },
]);
</script>
