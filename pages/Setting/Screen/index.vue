<template>
  <div class="screen-list">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>Screen</h2>
      <div class="d-flex gap-2">
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-eye">
          View
        </v-btn>
        <v-btn color="warning" prepend-icon="mdi-pencil">
          Edit
        </v-btn>
      </div>
    </div>

    <!-- Controls -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center gap-2">
        <span>Show</span>
        <v-select
          v-model="itemsPerPage"
          :items="[10, 25, 50, 100]"
          density="compact"
          variant="outlined"
          style="width: 80px;"
        ></v-select>
        <span>entries</span>
      </div>
      
      <div class="d-flex align-center gap-2">
        <span>Search:</span>
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          hide-details
          style="width: 200px;"
        ></v-text-field>
      </div>
    </div>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="screenItems"
      :items-per-page="itemsPerPage"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>
      
      <template v-slot:item.klinik="{ item }">
        <div class="klinik-tags">
          <v-chip
            v-for="klinik in item.klinik"
            :key="klinik"
            size="small"
            class="ma-1"
            color="red"
            text-color="white"
          >
            {{ klinik }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          color=#ff9248
          @click="editScreen(item)"
          style="color:white;"
        ></v-btn>
      </template>
    </v-data-table>

    <!-- Footer -->
    <div class="d-flex justify-space-between align-center mt-4">
      <div>
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalItems }} entries
      </div>
      
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Data
const search = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const headers = [
  { title: 'No', key: 'no', sortable: false, width: '60px' },
  { title: 'Nama Screen', key: 'nama_screen', sortable: true },
  { title: 'Klinik', key: 'klinik', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
];

const screenItems = ref([
  {
    id: 1,
    nama_screen: 'Layar Screen 1',
    klinik: ['ANAK', 'ANESTESI', 'BEDAH', 'GIGI DAN MULUT', 'GERIATRI', 'GIZI', 'IPD', 'JANTUNG']
  },
  {
    id: 2,
    nama_screen: 'Layar Screen 2',
    klinik: ['JIWA', 'KUL KEL', 'KOMPLEMENTER', 'MATA', 'SARAF', 'KANDUNGAN', 'ONKOLOGI', 'PARU']
  },
  {
    id: 3,
    nama_screen: 'Layar Screen 3',
    klinik: ['RADIOTERAPI', 'REHAB MEDIK', 'THT', 'MCU', 'KEMOTERAPI', 'R. TINDAKAN', 'HOM']
  }
]);

// Computed
const totalItems = computed(() => screenItems.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const currentPageStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const currentPageEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

// Methods
const editScreen = (item) => {
  navigateTo(`/setting/screen/edit/${item.id}`);
};
</script>

<style scoped>
.screen-list {
  padding: 20px;
}

.klinik-tags {
  max-width: 600px;
}

.gap-2 {
  gap: 8px;
}
</style>