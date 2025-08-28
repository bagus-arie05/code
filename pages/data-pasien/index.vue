<!-- pages/data-pasien.vue -->
<template>
  <div class="data-pasien">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2>Data Pasien</h2>
      <div class="d-flex gap-2">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="addPatient">
          Add Patient
        </v-btn>
      </div>
    </div>

    <!-- Menggunakan komponen TabelData -->
    <TabelData
      :headers="headers"
      :items="pasienItems"
      title="Daftar Data Pasien"
      :show-search="true"
    >
      <template #actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn
    
            size="small"
            color="primary"
            variant="flat"
            @click="viewPasien(item)"
          >VIEW</v-btn>
          <v-btn
     
            size="small"
            color="warning"
            variant="flat"
            @click="editPasien(item)"
          >EDIT</v-btn>
        </div>
      </template>
    </TabelData>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TabelData from '@/components/TabelData.vue';

// Headers untuk tabel
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

// Data pasien dengan informasi lengkap untuk edit
const pasienItems = ref([
  {
    id: 1,
    no: 1,
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
    // Data tambahan untuk form edit
    editData: {
      tanggal_daftar: '2025-07-15 13:47:33',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100001',
      no_antrian: 'HO1001',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '',
      klinik: 'HOM',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: '',
      pembayaran: 'JKN'
    }
  },
  {
    id: 2,
    no: 2,
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
    editData: {
      tanggal_daftar: '2025-07-24 13:50:01',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100002',
      no_antrian: 'OB1001',
      no_klinik: '',
      no_rekammedik: '',
      klinik: 'KANDUNGAN',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: '',
      pembayaran: 'JKN'
    }
  },
  {
    id: 3,
    no: 3,
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
    editData: {
      tanggal_daftar: '2025-07-24 13:50:37',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100003',
      no_antrian: 'OB1002',
      no_klinik: '',
      no_rekammedik: '',
      klinik: 'KANDUNGAN',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: '',
      pembayaran: 'JKN'
    }
  },
  {
    id: 4,
    no: 4,
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
    editData: {
      tanggal_daftar: '2025-07-28 08:18:20',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100004',
      no_antrian: 'AN1001',
      no_klinik: '',
      no_rekammedik: '',
      klinik: 'ANAK',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: '',
      pembayaran: 'JKN'
    }
  },
  {
    id: 5,
    no: 5,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:02',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100005',
      no_antrian: 'HO1002',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '11412684',
      klinik: 'HOM',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'Online 25#27100005',
      pembayaran: 'JKN'
    }
  },
  {
    id: 6,
    no: 6,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:03',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100006',
      no_antrian: 'HO1003',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '',
      klinik: 'HOM',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'Online 25#27100006',
      pembayaran: 'JKN'
    }
  },
  {
    id: 7,
    no: 7,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:03',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100007',
      no_antrian: 'IP1001',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '11555500',
      klinik: 'IPD',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'FINGATMANA ONLINE',
      pembayaran: 'JKN'
    }
  },
  {
    id: 8,
    no: 8,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:04',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100008',
      no_antrian: 'IP1001',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '11333855',
      klinik: 'IPD',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'Online 25#27100008',
      pembayaran: 'JKN'
    }
  },
  {
    id: 9,
    no: 9,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:04',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100009',
      no_antrian: 'IP1001',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '11565554',
      klinik: 'IPD',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'Online 25#27100009',
      pembayaran: 'JKN'
    }
  },
  {
    id: 10,
    no: 10,
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
    editData: {
      tanggal_daftar: '2025-08-13 00:00:04',
      tanggal_periksa: '2025-08-27',
      no_barcode: '25027100010',
      no_antrian: 'IP1001',
      no_klinik: 'Belum Mendapatkan Antrian Klinik',
      no_rekammedik: '11627608',
      klinik: 'IPD',
      shift: 'Shift 1 = Mulai Pukul 07:00',
      keterangan: 'Online 25#27100010',
      pembayaran: 'JKN'
    }
  }
]);

// Methods
const addPatient = () => {
  // Navigate to add patient page
  navigateTo('/data-pasien/add');
};

const viewPasien = (item) => {
  // Implement view functionality
  console.log('View pasien:', item);
  // You can navigate to a view page or open a modal
  // navigateTo(`/data-pasien/view/${item.id}`);
};

const editPasien = (item) => {
  // Navigate to edit page
  navigateTo(`/data-pasien/edit/${item.id}`);
};

// Provide data globally untuk diakses oleh halaman edit
provide('pasienData', pasienItems);
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
</style>