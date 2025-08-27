<template>
  <div class="data-pasien">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>Data Pasien</h2>
      <div class="d-flex gap-2">
        <v-btn color="primary" prepend-icon="mdi-plus">
          Add Patient
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
      :items="pasienItems"
      :items-per-page="itemsPerPage"
      :search="search"
      class="elevation-1"
      item-value="id"
    >
      <template v-slot:item.no="{ index }">
        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
      </template>
      
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          text-color="white"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.keterangan="{ item }">
        <span v-if="item.keterangan" class="text-red font-weight-bold">
          {{ item.keterangan }}
        </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.aksi="{ item }">
        <div class="d-flex gap-1">
          <v-btn
            icon="mdi-eye"
            size="small"
            color="primary"
            @click="viewPasien(item)"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            color="warning"
            @click="editPasien(item)"
          ></v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Footer Pagination -->
    <div class="d-flex justify-space-between align-center mt-4">
      <div>
        Showing {{ currentPageStart }} to {{ currentPageEnd }} of {{ totalItems }} entries
      </div>
      
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
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
  { title: 'Tgl Daftar', key: 'tgl_daftar', sortable: true, width: '140px' },
  { title: 'No Barcode', key: 'no_barcode', sortable: true, width: '120px' },
  { title: 'No Antrian', key: 'no_antrian', sortable: true, width: '100px' },
  { title: 'No Klinik', key: 'no_klinik', sortable: true, width: '100px' },
  { title: 'RM', key: 'rm', sortable: true, width: '100px' },
  { title: 'Klinik', key: 'klinik', sortable: true, width: '120px' },
  { title: 'Shift', key: 'shift', sortable: true, width: '80px' },
  { title: 'Ket', key: 'keterangan', sortable: false, width: '150px' },
  { title: 'Pembayaran', key: 'pembayaran', sortable: true, width: '100px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
];

const pasienItems = ref([
  {
    id: 1,
    tgl_daftar: '2025-07-15 13:47:33',
    no_barcode: '25027100001',
    no_antrian: 'HO1001',
    no_klinik: '',
    rm: '',
    klinik: 'HOM',
    shift: 'Shift 1',
    keterangan: '',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 2,
    tgl_daftar: '2025-07-24 13:50:01',
    no_barcode: '25027100002',
    no_antrian: 'OB1001',
    no_klinik: '',
    rm: '',
    klinik: 'KANDUNGAN',
    shift: 'Shift 1',
    keterangan: '',
    pembayaran: 'JKN',
    status: 'Barcode',
    aksi: ''
  },
  {
    id: 3,
    tgl_daftar: '2025-07-24 13:50:37',
    no_barcode: '25027100003',
    no_antrian: 'OB1002',
    no_klinik: '',
    rm: '',
    klinik: 'KANDUNGAN',
    shift: 'Shift 1',
    keterangan: '',
    pembayaran: 'JKN',
    status: 'Barcode',
    aksi: ''
  },
  {
    id: 4,
    tgl_daftar: '2025-07-28 08:18:20',
    no_barcode: '25027100004',
    no_antrian: 'AN1001',
    no_klinik: '',
    rm: '',
    klinik: 'ANAK',
    shift: 'Shift 1',
    keterangan: '',
    pembayaran: 'JKN',
    status: 'Barcode',
    aksi: ''
  },
  {
    id: 5,
    tgl_daftar: '2025-08-13 00:00:02',
    no_barcode: '25027100005',
    no_antrian: 'HO1002',
    no_klinik: '',
    rm: '11412684',
    klinik: 'HOM',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100005',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 6,
    tgl_daftar: '2025-08-13 00:00:03',
    no_barcode: '25027100006',
    no_antrian: 'HO1003',
    no_klinik: '',
    rm: '',
    klinik: 'HOM',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100006',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 7,
    tgl_daftar: '2025-08-13 00:00:03',
    no_barcode: '25027100007',
    no_antrian: 'IP1001',
    no_klinik: '',
    rm: '11555500',
    klinik: 'IPD',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100007',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 8,
    tgl_daftar: '2025-08-13 00:00:04',
    no_barcode: '25027100008',
    no_antrian: 'IP1001',
    no_klinik: '',
    rm: '11333855',
    klinik: 'IPD',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100008',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 9,
    tgl_daftar: '2025-08-13 00:00:04',
    no_barcode: '25027100009',
    no_antrian: 'IP1001',
    no_klinik: '',
    rm: '11565554',
    klinik: 'IPD',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100009',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  },
  {
    id: 10,
    tgl_daftar: '2025-08-13 00:00:04',
    no_barcode: '25027100010',
    no_antrian: 'IP1001',
    no_klinik: '',
    rm: '11627608',
    klinik: 'IPD',
    shift: 'Shift 1',
    keterangan: 'Online 25#27100010',
    pembayaran: 'JKN',
    status: 'Tunggu Daftar',
    aksi: ''
  }
]);

// Computed
const totalItems = computed(() => pasienItems.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const currentPageStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const currentPageEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

// Methods
const getStatusColor = (status) => {
  switch (status) {
    case 'Tunggu Daftar':
      return 'orange';
    case 'Barcode':
      return 'blue';
    default:
      return 'grey';
  }
};

const viewPasien = (item) => {
  // Implement view functionality
  console.log('View pasien:', item);
};

const editPasien = (item) => {
  navigateTo(`/data-pasien/edit/${item.id}`);
};
</script>

<style scoped>
.data-pasien {
  padding: 20px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.text-red {
  color: #d32f2f;
}
</style>