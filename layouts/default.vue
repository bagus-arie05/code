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
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Header Sidebar -->
      <div class="pa-4 d-flex align-center" style="height: 64px">
        <v-icon color="#ff9248" size="32">mdi-hospital-building</v-icon>
        <v-toolbar-title v-show="!rail" class="ml-3 text-h6">
          Antrean RSSA
        </v-toolbar-title>
      </div>

      <v-divider></v-divider>

      <!-- Menu Items -->
      <v-list density="default" nav class="py-2">
        <v-list-item
          prepend-icon="mdi-magnify"
          :title="!rail ? 'Search' : ''"
          rounded="lg"
          class="mx-2 my-1"
        >
        </v-list-item>

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
            <v-list class="py-2" style="min-width: 200px">
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
              <v-chip size="x-small" color="error" variant="flat">{{
                item.badge
              }}</v-chip>
            </template>
          </v-list-item>
        </template>

        <v-divider class="my-4 mx-2"></v-divider>
      </v-list>

      <v-spacer></v-spacer>

      <template v-slot:append>
        <!-- User Profile with Menu -->
        <div class="pa-3">
          <v-menu location="top end" offset="8">
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                class="d-flex align-center cursor-pointer pa-2 rounded-lg hover-bg"
              >
                <v-avatar size="40">
                  <v-img src="https://i.pravatar.cc/150?img=33"></v-img>
                  <v-badge
                    dot
                    color="orange"
                    location="bottom right"
                    offset-x="2"
                    offset-y="2"
                  ></v-badge>
                </v-avatar>
                <div v-show="!rail" class="ml-3 flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold">
                    Adam Sulfat
                  </div>
                  <div class="text-caption text-grey">adam@rssa.com</div>
                </div>
                <v-btn v-show="!rail" icon size="small" variant="text">
                  <v-icon size="20">mdi-dots-vertical</v-icon>
                </v-btn>
              </div>
            </template>

            <!-- User Menu Card -->
            <v-card width="300" elevation="8" rounded="lg">
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-4">
                  <v-avatar size="48">
                    <v-img src="https://i.pravatar.cc/150?img=33"></v-img>
                  </v-avatar>
                  <div class="ml-3">
                    <div class="text-subtitle-1 font-weight-bold">
                      Adam Sulfat
                    </div>
                    <div class="text-caption text-grey">adam@rssa.com</div>
                  </div>
                </div>

                <v-list density="compact" class="pa-0">
                  <v-list-item
                    prepend-icon="mdi-cog-outline"
                    class="px-2 rounded-lg"
                  >
                    <v-list-item-title class="text-body-2"
                      >Setting</v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item
                    prepend-icon="mdi-help-circle-outline"
                    class="px-2 rounded-lg"
                  >
                    <v-list-item-title class="text-body-2"
                      >Bantuan</v-list-item-title
                    >
                  </v-list-item>

                  <v-divider class="my-2"></v-divider>

                  <v-list-item
                    prepend-icon="mdi-logout"
                    class="px-2 rounded-lg"
                    @click="handleLogout"
                  >
                    <v-list-item-title class="text-body-2"
                      >Log out</v-list-item-title
                    >
                  </v-list-item>
                </v-list>

                <div class="text-caption text-grey mt-3 text-center">
                  v2.5.18 · Terms & Conditions
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="bg-grey-lighten-4 pa-6">
        <slot></slot>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-grey-lighten-4">
      <v-container fluid class="py-2">
        <v-row no-gutters align="center">
          <v-col cols="12" md="6">
            <span class="text-caption text-grey-darken-2">
              RSUD Dr. Saiful Anwar Malang | Jl. Jaksa Agung Suprapto No. 2
              Malang | Telp: 0341-362101
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
import { useRoute } from "vue-router";

// State
const drawer = ref(true);
const rail = ref(true); // Default rail mode = true (collapsed)
const hoverTimeout = ref(null);

// Menu Items
const items = ref([
  { title: "Dashboard", icon: "mdi-home-outline", to: "/dashboard" },
  {
    title: "Notifications",
    icon: "mdi-bell-outline",
    to: "/notifications",
    badge: "3",
  },
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
  {
    title: "Loket Admin",
    icon: "mdi-account-supervisor-outline",
    to: "/loket-admin",
  },
  { title: "Ranap Admin", icon: "mdi-bed-outline", to: "/ranap-admin" },
  {
    title: "Anjungan",
    icon: "mdi-account-box-multiple-outline",
    children: [
      { title: "Anjungan", to: "/anjungan/anjungan" },
      { title: "Klinik Ruang", to: "/anjungan/AntrianKlinik" },
    ],
  },
  {
    title: "Data Pasien",
    icon: "mdi-account-multiple-outline",
    to: "/data-pasien",
  },
]);

const currentRoute = useRoute();
const currentActiveMenu = computed(() => {
  const currentItem = items.value.find((item) => item.to === currentRoute.path);
  if (currentItem) {
    return currentItem.title;
  }

  for (const item of items.value) {
    if (item.children) {
      const childItem = item.children.find(
        (child) => child.to === currentRoute.path
      );
      if (childItem) {
        return item.title;
      }
    }
  }
  return "";
});

// Hover handlers
const handleMouseEnter = () => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
  hoverTimeout.value = setTimeout(() => {
    rail.value = false;
  }, 100); // Delay 100ms sebelum expand
};

const handleMouseLeave = () => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
  hoverTimeout.value = setTimeout(() => {
    rail.value = true;
  }, 200); // Delay 200ms sebelum collapse
};

const handleLogout = () => {
  console.log("Logging out...");
  // Add logout logic here
};
</script>

<style scoped>
.v-list-item--active {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
}

.v-list-item--active :deep(.v-list-item__prepend) {
  color: #1976d2 !important;
}

.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

.v-navigation-drawer {
  border-right: 1px solid #e0e0e0 !important;
  transition: width 0.2s ease-in-out !important;
}

.hover-bg:hover {
  background-color: #f5f5f5;
}

.cursor-pointer {
  cursor: pointer;
}

/* Custom scrollbar */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  width: 6px;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

:deep(.v-navigation-drawer__content)::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>