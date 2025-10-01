<template>
  <v-app>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<style>
/* Pastikan v-main mengisi seluruh tinggi halaman untuk mengaktifkan centering */
.v-main {
  min-height: 100vh;
}
</style>
