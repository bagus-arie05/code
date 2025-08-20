<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom"
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        class="ml-auto"
      >
        <v-icon size="40" color="#000000">mdi-account</v-icon>
      </v-btn>
    </template>

    <v-card class="mx-auto" color="#FFA000" dark width="250">
      <v-list-item three-line class="py-4">
        <v-list-item-title class="text-h6 text-center font-weight-bold">
          <v-avatar color="#fff" size="60">
            <v-icon size="40" color="#4CAF50">mdi-account</v-icon>
          </v-avatar>
        </v-list-item-title>
        <v-list-item-subtitle class="text-center mt-2 text-black">
          <span class="d-block font-weight-bold">Rajal Bayu Nogroho</span>
          <span class="d-block">Super Admin</span>
        </v-list-item-subtitle>
      </v-list-item>

      <v-card-actions class="d-flex justify-center pa-2">
        <v-btn 
          color="black" 
          variant="text" 
          class="font-weight-bold"
          @click="signOut"
        >
          Sign out
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue';

const menu = ref(false);

const signOut = () => {
  console.log("Sign out button clicked!");
  menu.value = false;
  // Implementasi logika logout di sini
};
</script>

<style scoped>
/* No specific scoped styles needed for this component as Vuetify classes handle styling */
</style>
