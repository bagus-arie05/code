<template>
  <v-divider class="my-8"></v-divider>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <!-- Klinik Ruang Admin Content -->
      <h1 class="text-h4 mb-4 mt-10">Klinik Ruang Admin</h1>
      <v-card class="pa-4 mb-4">
        <v-card-title>GENERATE TIKET</v-card-title>
        <div class="d-flex align-center">
          <v-text-field
            label="Masukkan Barcode"
            variant="outlined"
            density="compact"
            class="mr-4"
          ></v-text-field>
          <v-col cols="12 " md="6">
            <v-chip color="#B71C1C" class="text-caption">
              Tekan Enter: (Apabila barcode depan nomor ada huruf lain, ex: J008730180085 "hiraukan huruf 'J' nya")
            </v-chip>
          </v-col>
        </div>
      </v-card>

      <v-card class="pa-4">
        <v-card-title>Pasien Klinik Ruang Admin</v-card-title>
        <div class="d-flex justify-space-between align-center my-3">
          <div class="d-flex align-center">
            <span>Show</span>
            <v-select
              density="compact"
              variant="outlined"
              :items="[10, 25, 50, 100]"
              class="mx-2"
              style="width: 80px"
            ></v-select>
            <span>entries</span>
          </div>
          <v-text-field
            label="Search"
            variant="outlined"
            density="compact"
            style="max-width: 200px"
          ></v-text-field>
        </div>

        <v-table class="mt-3">
          <thead>
            <tr>
              <th
                v-for="header in klinikRuangAdminHeaders"
                :key="header.text"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :colspan="klinikRuangAdminHeaders.length" class="text-center">
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
</template>

<script setup>
import { ref } from "vue";

const klinikRuangAdminHeaders = [
  { text: 'No' },
  { text: 'Barcode' },
  { text: 'No Rekamedik' },
  { text: 'No Antrian' },
  { text: 'No Antrian Klinik' },
  { text: 'No Antrian Ruang' },
  { text: 'Shift' },
  { text: 'Pembayaran' },
  { text: 'Action' },
  { text: 'Status' },
]
</script>

<style scoped>
/* Scoped styles can be added here if needed for this specific component */
</style>
