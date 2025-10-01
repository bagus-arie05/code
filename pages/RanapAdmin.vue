<template>
  <v-main class="ranap-admin-page">
    <v-container fluid class="pa-6">
      <!-- Modern Header -->
      <v-card class="elevation-4 rounded-xl mb-6 header-banner d-flex align-center pa-4">
        <v-icon size="48" color="white" class="mr-4">mdi-hospital-box-outline</v-icon>
        <h1 class="text-h4 font-weight-bold text-white">Ranap Admin</h1>
      </v-card>

      <v-card class="elevation-2 rounded-xl pa-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="d-flex align-center">
            <span class="text-caption mr-2">Show</span>
            <v-select
              v-model="itemsPerPage"
              :items="[10, 25, 50, 100]"
              density="compact"
              hide-details
              variant="solo"
              flat
              class="pagination-select"
              :menu-props="{ attach: true }"
            ></v-select>
            <span class="text-caption ml-2">entries</span>
          </div>
          <v-text-field
            v-model="search"
            label="Search"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            density="compact"
            variant="solo"
            flat
            class="search-field"
          ></v-text-field>
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :items-per-page="itemsPerPage"
          class="elevation-0"
          item-key="noAntrean"
        >
          <template v-slot:item.aksi="{ item }">
            <v-btn small color="success" class="text-white" @click="selectItem(item)">
              Selesai
            </v-btn>
          </template>
          <template v-slot:bottom>
            <div class="d-flex justify-space-between align-center pa-2">
              <span class="text-caption">Showing {{ (page - 1) * itemsPerPage + 1 }} to {{ Math.min(page * itemsPerPage, filteredItems.length) }} of {{ filteredItems.length }} entries</span>
              <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="5"
                rounded="circle"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <v-row class="mt-6">
        <v-col cols="12" md="4" class="pr-md-2">
          <v-card class="elevation-2 rounded-xl next-card pa-4 d-flex flex-column align-center text-center">
            <h2 class="text-h3 font-weight-bold next-title">NEXT</h2>
            <span class="text-h4 font-weight-medium my-4 next-content">{{ nextAntrean || 'Kosong' }}</span>
            <p class="text-caption">Klik untuk memanggil pasien selanjutnya</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  middleware:['auth']
})

const headers = [
  { title: 'No', align: 'start', sortable: false, key: 'no' },
  { title: 'No. Antrean', key: 'noAntrean' },
  { title: 'Daftar', key: 'daftar' },
  { title: 'Pelayanan', key: 'pelayanan' },
  { title: 'Aksi', key: 'aksi' },
];

const items = ref([
  { no: 1, noAntrean: '001', daftar: '26 Aug 2025 07:10:31', pelayanan: 'Belum Dilayani' },
  { no: 2, noAntrean: '002', daftar: '26 Aug 2025 07:10:35', pelayanan: 'Belum Dilayani' },
  { no: 3, noAntrean: '003', daftar: '26 Aug 2025 07:10:44', pelayanan: 'Belum Dilayani' },
  { no: 4, noAntrean: '004', daftar: '26 Aug 2025 07:10:46', pelayanan: 'Belum Dilayani' },
  { no: 5, noAntrean: '005', daftar: '26 Aug 2025 07:10:47', pelayanan: 'Belum Dilayani' },
  { no: 6, noAntrean: '006', daftar: '26 Aug 2025 07:10:49', pelayanan: 'Belum Dilayani' },
  { no: 7, noAntrean: '007', daftar: '26 Aug 2025 07:10:51', pelayanan: 'Belum Dilayani' },
  { no: 8, noAntrean: '008', daftar: '26 Aug 2025 07:10:53', pelayanan: 'Belum Dilayani' },
  { no: 9, noAntrean: '009', daftar: '26 Aug 2025 07:10:54', pelayanan: 'Belum Dilayani' },
  { no: 10, noAntrean: '010', daftar: '26 Aug 2025 07:10:55', pelayanan: 'Belum Dilayani' },
]);

const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);

const nextAntrean = ref('001');

const filteredItems = computed(() => {
  if (!search.value) {
    return items.value;
  }
  return items.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const pageCount = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

const selectItem = (item) => {
  console.log('Item selected:', item);
  // Di sini Anda bisa menambahkan logika untuk mengubah status pasien menjadi "Dilayani" atau memindahkannya ke antrean berikutnya.
};

</script>

<style scoped>
.ranap-admin-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-banner {
  background: linear-gradient(45deg, #1A237E, #283593); /* Deep blue gradient */
  color: white;
  padding: 24px;
}

.search-field, .pagination-select {
  max-width: 250px;
}

.v-data-table :deep(table) {
  border-collapse: separate;
  border-spacing: 0 10px;
}

.v-data-table :deep(tbody tr) {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.next-card {
  background-color: #00A896;
  color: white;
  height: 200px;
}

.next-title {
  font-size: 3.5rem;
}

.next-content {
  font-size: 3rem;
  line-height: 1;
}
</style>
