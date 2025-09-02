<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Master Loket</span>
        <v-btn color=#ff9248 @click="tambahLoket" style="color:white;">Tambah Baru</v-btn>
      </v-card-title>
      <TabelData
        :headers="loketHeaders"
        :items="loketData"
        title="Master Loket"
      >
        <template #actions="{ item }">
          <v-btn small color=#ff9248 @click="editLoket(item)" class="mr-2" style="color:white;">Edit</v-btn>
          <v-btn small color="grey-lighten-4" @click="deleteLoket(item)">Delete</v-btn>
        </template>
      </TabelData>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import TabelData from '../../components/TabelData.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loketHeaders = ref([
  { title: 'No', value: 'no' },
  { title: 'Nama Loket', value: 'namaLoket' },
  { title: 'Kuota', value: 'kuota' },
  { title: 'Pelayanan', value: 'pelayanan' },
  { title: 'Pembayaran', value: 'pembayaran' },
  { title: 'Keterangan', value: 'keterangan' },
  { title: 'Aksi', value: 'aksi', sortable: false }, // 'value' harus 'actions'
]);

// Master-Loket.vue
const loketData = ref([
  { id: 1, no: 1, namaLoket: 'Loket 1', kuota: 500, pelayanan: ['RADIOTERAPI', 'REHAB MEDIK', 'TINDAKAN'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 2, no: 2, namaLoket: 'Loket 2', kuota: 666, pelayanan: ['JIWA', 'SARAF'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 3, no: 3, namaLoket: 'Loket 3', kuota: 666, pelayanan: ['ANESTESI', 'JANTUNG'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 4, no: 4, namaLoket: 'Loket 4', kuota: 3676, pelayanan: ['KULIT KELAMIN', 'PARU'], pembayaran: 'JKN', keterangan: 'ONLINE' },
]);

const editLoket = (item) => {
  router.push({ path: `/Setting/Edit-Loket/${item.id}` });
};

const deleteLoket = (item) => {
  const index = loketData.value.findIndex(loket => loket.id === item.id);
  if (index !== -1) {
    loketData.value.splice(index, 1);
  }
};

const tambahLoket = () => {
  router.push({ path: '/Setting/Tambah-Loket' });
};
</script>