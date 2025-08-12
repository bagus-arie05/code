<template>
  <v-app id="inspire">
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

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <div class="d-flex align-center justify-space-between mb-4">
          <h1 class="text-h4">Klinik Admin</h1>
          <v-chip color="green" variant="elevated">
            <v-icon left>mdi-circle-small</v-icon>
            Max Quota Bangku 0
          </v-chip>
        </div>

        <!-- Loket Admin Table -->
        <v-card class="mb-5 pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            Loket Admin
            <div>
              <v-btn color="green" class="mr-2">1</v-btn>
              <v-btn color="blue" class="mr-2">5</v-btn>
              <v-btn color="orange" class="mr-2">10</v-btn>
              <v-btn color="red">20</v-btn>
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
              <tr>
                <td :colspan="loketHeaders.length" class="text-center">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-space-between align-center mt-3">
            <span>Showing 0 to 0 of 0 entries</span>
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
              <tr>
                <td :colspan="pengunjungHeaders.length" class="text-center">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-space-between align-center mt-3">
            <span>Showing 0 to 0 of 0 entries</span>
            <div>
              <v-btn size="small" variant="text" disabled>Previous</v-btn>
              <v-btn size="small" variant="text" disabled>Next</v-btn>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";

// Reactive data
const drawer = ref(true);
const rail = ref(false);
const search = ref("");
const lateSearch = ref("");
const clinicSearch = ref("");
const itemsPerPage = ref(10);
const lateItemsPerPage = ref(10);
const clinicItemsPerPage = ref(10);
const currentPage = ref("Loket Admin");

// Navigation items
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
  { title: "Klinik Admin", icon: "mdi-hospital-box", to : "/KlinikAdmin" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker" },
  { title: "Anjungan", icon: "mdi-account-box-multiple", to: "/anjungan" },
  { title: "Fast Track", icon: "mdi-clock-fast" },
  { title: "Data Pasien", icon: "mdi-account-multiple" },
  { title: "Screen", icon: "mdi-monitor" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted" },
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
</script>

<style scoped>
#inspire .v-navigation-drawer__content {
  background-color: #f5f5f5;
}

#inspire .v-app-bar {
  background-color: #fff;
}
</style>
