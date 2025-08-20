<template>
  <!-- Root component for the entire Vuetify application -->
  <v-app>
    <!-- App bar di bagian atas layout -->
     <v-app-bar app color="green darken-1" dark>
        <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-2">Antrean RSSA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <span class="mr-2">Ragil Bayu Nogroho</span>
      </v-app-bar>

    <!-- Komponen sidebar (v-navigation-drawer) yang Anda berikan -->
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent app>
      <!-- Komponen untuk menampilkan item daftar menu -->
      <v-list density="compact" nav>
        <!-- Loop melalui setiap item di array 'items' -->
        <template v-for="item in items" :key="item.title">
          <!-- V-menu untuk item yang memiliki sub-menu (children) -->
          <v-menu
            v-if="item.children"
            open-on-hover
            location="end"
            :nudge-right="8"
          >
            <!-- Slot untuk mengaktifkan menu saat diklik/hover -->
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
                :value="item.title"
                :active="item.title === currentActiveMenu"
              >
              </v-list-item>
            </template>

            <!-- Konten menu (sub-menu) -->
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
                :active="child.to === currentRoute.path"
              >
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- V-list-item untuk item yang tidak memiliki sub-menu -->
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            :value="item.title"
            :active="item.to === currentRoute.path"
            link
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Area konten utama aplikasi -->
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Di sini, konten halaman akan di-render oleh Nuxt -->
        <slot></slot>
      </v-container>
    </v-main>
    <v-footer app padless class="bg-grey-lighten-4">
      <v-container fluid class="py-2">
        <v-row no-gutters align="center">
          <v-col cols="12" md="6">
            <span class="text-caption text-grey-darken-2">
              RSUD Dr. Saiful Anwar Malang | Jl. Jaksa Agung Suprapto No. 2 Malang | Telp : 0341- 362101 | Fax : 0341-369384
            </span>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <span class="text-caption text-grey-darken-2">
              ITIKom Antrian RSSA Ver. 0.2
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from 'vue-router';

// Data untuk item-item sidebar
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
  { title: "Loket Admin", icon: "mdi-account-supervisor", to: "/loket-admin" },
  { title: "Ranap Admin", icon: "mdi-bed", to: "/ranap-admin" },
  { title: "Klinik Admin", icon: "mdi-hospital-box", to: "/klinik-admin" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker", to: "/klinik-ruang-admin" },
  { title: "Anjungan", icon: "mdi-account-box-multiple", to: "/anjungan" },
  { title: "Fast Track", icon: "mdi-clock-fast", to: "/fast-track" },
  { title: "Data Pasien", icon: "mdi-account-multiple", to: "/data-pasien" },
  { title: "Screen", icon: "mdi-monitor", to: "/screen" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted", to: "/list-pasien" },
]);

// State untuk sidebar
const drawer = ref(true);
const rail = ref(false);

const currentRoute = useRoute();
const currentActiveMenu = computed(() => {
  const currentItem = items.value.find(item => item.to === currentRoute.path);
  if (currentItem) {
    return currentItem.title;
  }

  for (const item of items.value) {
    if (item.children) {
      const childItem = item.children.find(child => child.to === currentRoute.path);
      if (childItem) {
        return item.title;
      }
    }
  }
  return '';
});
</script>

<style scoped>
.v-list-item--active {
  background-color: var(--v-theme-primary);
  color: #fff !important;
}
</style>