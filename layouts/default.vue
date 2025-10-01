<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      :rail="rail" 
      permanent 
      app
      color="white"
      width="280"
      rail-width="72"
    >
      <!-- Header Sidebar -->
      <div class="pa-4 d-flex align-center" style="height: 64px;">
        <v-icon color="#ff9248" size="32">mdi-hospital-building</v-icon>
        <v-toolbar-title v-show="!rail" class="ml-3 text-h6">
          Antrean RSSA
        </v-toolbar-title>
      </div>

      <v-divider></v-divider>

      <!-- Menu Items -->
      <v-list density="default" nav class="py-2">
        <v-list-subheader v-show="!rail" class="text-caption text-grey">
          OVERVIEW
        </v-list-subheader>

        <template v-for="item in items" :key="item.title">
          <!-- Item dengan Children -->
          <v-menu
            v-if="item.children"
            open-on-hover
            location="end"
            :disabled="!rail"
          >
            <template v-slot:activator="{ props }">
              <v-list-group v-if="!rail" :value="item.title">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    :active="item.title === currentActiveMenu"
                    rounded="lg"
                    class="mx-2 my-1"
                  >
                  </v-list-item>
                </template>
                <v-list-item
                  v-for="child in item.children"
                  :key="child.title"
                  :to="child.to"
                  :title="child.title"
                  :active="child.to === currentRoute.path"
                  rounded="lg"
                  class="mx-2 my-1 pl-12"
                >
                </v-list-item>
              </v-list-group>

              <!-- Rail mode menu -->
              <v-list-item
                v-else
                v-bind="props"
                :prepend-icon="item.icon"
                :active="item.title === currentActiveMenu"
                rounded="lg"
                class="mx-2 my-1"
              >
              </v-list-item>
            </template>

            <!-- Submenu untuk rail mode -->
            <v-list class="py-2" style="min-width: 200px;">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
              <v-divider class="my-2"></v-divider>
              <v-list-item
                v-for="child in item.children"
                :key="child.title"
                :to="child.to"
                :title="child.title"
                :active="child.to === currentRoute.path"
                rounded="lg"
                class="mx-2"
              >
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Item tanpa Children -->
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="!rail ? item.title : ''"
            :to="item.to"
            :active="item.to === currentRoute.path"
            rounded="lg"
            class="mx-2 my-1"
          >
            <template v-slot:append v-if="item.badge && !rail">
              <v-chip size="x-small" color="primary">{{ item.badge }}</v-chip>
            </template>
          </v-list-item>
        </template>

        <v-divider class="my-4"></v-divider>

        <v-list-subheader v-show="!rail" class="text-caption text-grey">
          ACCOUNT
        </v-list-subheader>

        <v-list-item
          prepend-icon="mdi-cog-outline"
          :title="!rail ? 'Settings' : ''"
          to="/settings"
          rounded="lg"
          class="mx-2 my-1"
        >
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-logout"
          :title="!rail ? 'Log out' : ''"
          rounded="lg"
          class="mx-2 my-1"
        >
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <!-- Theme Toggle -->
        <div class="pa-4 d-flex justify-center align-center">
          <v-icon color="primary" size="20">mdi-white-balance-sunny</v-icon>
          <v-switch
            v-show="!rail"
            v-model="darkMode"
            hide-details
            density="compact"
            color="primary"
            class="mx-2"
          ></v-switch>
          <v-icon v-show="!rail" size="20">mdi-moon-waning-crescent</v-icon>
        </div>

        <v-divider></v-divider>

        <!-- User Profile -->
        <div class="pa-4">
          <div class="d-flex align-center">
            <v-avatar color="#ff9248" size="40">
              <span class="text-white">AS</span>
            </v-avatar>
            <div v-show="!rail" class="ml-3 flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold">Adam Sulfat</div>
              <div class="text-caption text-grey">adam@rssa.com</div>
            </div>
            <v-btn
              v-show="!rail"
              icon
              size="small"
              variant="text"
            >
              <v-icon size="20">mdi-dots-vertical</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <!-- Top Bar untuk Toggle -->
      <v-app-bar flat color="transparent" height="64">
        <v-btn
          icon
          @click="rail = !rail"
          class="ml-2"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-app-bar>

      <v-container fluid class="pa-6">
        <slot></slot>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-grey-lighten-4">
      <v-container fluid class="py-2">
        <v-row no-gutters align="center">
          <v-col cols="12" md="6">
            <span class="text-caption text-grey-darken-2">
              RSUD Dr. Saiful Anwar Malang | Jl. Jaksa Agung Suprapto No. 2 Malang | Telp: 0341-362101
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

// State
const drawer = ref(true);
const rail = ref(false);
const darkMode = ref(false);

// Menu Items
const items = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard-outline", to: "/dashboard" },
  // { title: "Marketplace", icon: "mdi-storefront-outline", to: "/marketplace" },
  // { title: "My Properties", icon: "mdi-home-outline", to: "/properties" },
  // { title: "Auctions", icon: "mdi-gavel", to: "/auctions" },
  // { title: "Wallet", icon: "mdi-wallet-outline", to: "/wallet" },
  // { title: "Favorites", icon: "mdi-heart-outline", to: "/favorites" },
  { 
    title: "Setting", 
    icon: "mdi-cog-outline",
    children: [
      { title: "Hak Akses", to: "/setting/hak-akses" },
      { title: "User Login", to: "/setting/user-login" },
      { title: "Master Loket", to: "/setting/master-loket" },
      { title: "Master Klinik", to: "/setting/master-klinik" },
      { title: "Master Klinik Ruang", to: "/setting/master-klinik-ruang" },
      { title: "Screen", to: "/setting/screen" },
    ],
  },
  { title: "Loket Admin", icon: "mdi-account-supervisor-outline", to: "/loket-admin" },
  { title: "Ranap Admin", icon: "mdi-bed-outline", to: "/ranap-admin" },
  { 
    title: "Anjungan", 
    icon: "mdi-account-box-multiple-outline",
    children: [
      { title: "Anjungan", to: "/anjungan/anjungan" },
      { title: "Klinik Ruang", to: "/anjungan/AntrianKlinik"},
    ],
  },
  { title: "Data Pasien", icon: "mdi-account-multiple-outline", to: "/data-pasien" },
]);

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
  background-color: #e8f5e9 !important;
  color: #2e7d32 !important;
}

.v-list-item--active :deep(.v-list-item__prepend) {
  color: #2e7d32 !important;
}

.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

.v-navigation-drawer {
  border-right: 1px solid #e0e0e0 !important;
}
</style>