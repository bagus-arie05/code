<template>
  <v-app>
    <v-layout>
      <!-- App Bar Header -->
      <v-app-bar app color="#FFA000" dark>
        <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-2">Antrian RSSA</v-toolbar-title>
        <v-spacer></v-spacer>
          <!-- Profile Popup Component -->
        <ProfilePopup />
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

            <v-tooltip
              v-else
              :disabled="!rail"
              open-on-hover
              location="end"
              :text="item.title"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :to="item.to"
                  :value="item.title"
                  :class="{ 'v-list-item--active': item.title === currentPage }"
                  link
                ></v-list-item>
              </template>
            </v-tooltip>
          </template>
        </v-list>
      </v-navigation-drawer>

      <!-- Page content will be rendered here -->
      <slot />

    </v-layout>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

// Reactive data
const drawer = ref(true); 
const rail = ref(true); 
const currentPage = ref("Klinik Admin");

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
  { title: "Loket Admin", icon: "mdi-account-supervisor", to: "/LoketAdmin" },
  { title: "Ranap Admin", icon: "mdi-bed" },
  { title: "Klinik Admin", icon: "mdi-hospital-box", to: "/KlinikAdmin" },
  { title: "Klinik Ruang Admin", icon: "mdi-hospital-marker", to: "/KlinikRuangAdmin" },
  { 
    title: "Anjungan", 
    icon: "mdi-account-box-multiple", 
    children: [
      { title: "Anjungan", to: "/Anjungan/Anjungan" },
      { title: "Admin Anjungan", to: "/Anjungan/AdminAnjungan" },
    ],
  },
  { title: "Fast Track", icon: "mdi-clock-fast", to: "/FastTrack" },
  { title: "Data Pasien", icon: "mdi-account-multiple" },
  { title: "Screen", icon: "mdi-monitor" },
  { title: "List Pasien", icon: "mdi-format-list-bulleted" },
]);
</script>

<style scoped>
#inspire .v-navigation-drawer__content {
  background-color: #f5f5f5;
}

#inspire .v-app-bar {
  background-color: #fff;
}
</style>
