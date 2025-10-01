<!-- layouts/default.vue -->
<template>
  <v-app id="inspire">
    <AppBar @toggle-rail="rail = !rail" />
    <SideBar :items="navItemsStore.navItems" v-model:drawer="drawer" :rail="rail" />

    <v-main app>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AppBar from "../components/AppBar.vue";
import SideBar from "../components/SideBar.vue";
import { useNavItemsStore } from '@/stores/navItems'; // Import the new store

definePageMeta({
  middleware: 'auth'
})

const drawer = ref(true);
const rail = ref(true);

const navItemsStore = useNavItemsStore();

// Your logic to check user access and filter the menu can go here
// For example:
// const filteredItems = computed(() => {
//   return navItemsStore.navItems.filter(item => userHasAccess(item.path));
// });
</script>

<style scoped>
/* Global styles for layout */
</style>