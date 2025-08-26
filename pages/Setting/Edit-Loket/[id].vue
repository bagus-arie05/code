<template>
  <v-container>
    <v-card>
      <v-card-title>Edit Loket</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="simpanLoket">
          <v-text-field label="Nama Loket" v-model="loket.namaLoket"></v-text-field>
          <v-text-field label="Kuota Bangku" v-model="loket.kuota" type="number"></v-text-field>

          <v-select
            label="Status Pelayanan"
            :items="['RAWAT JALAN', 'RAWAT INAP']"
            v-model="loket.statusPelayanan"
          ></v-select>

          <v-select
            label="Pembayaran"
            :items="['JKN', 'UMUM']"
            v-model="loket.pembayaran"
          ></v-select>

          <v-select
            label="Keterangan"
            :items="['ONLINE', 'MANUAL']"
            v-model="loket.keterangan"
          ></v-select>

          <div class="my-4">
            <h3 class="text-h6">Pelayanan</h3>
            <TabelLayanan
              :headers="serviceHeaders"
              :items="availableServices"
              v-model:selected-items="loket.pelayanan"
            />
          </div>

          <v-btn color="success" type="submit" class="mr-2">Simpan</v-btn>
          <v-btn color="secondary" @click="cancelEdit">Batal</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabelLayanan from '../../components/TabelLayanan.vue';

const route = useRoute();
const router = useRouter();

// Data dummy loket yang sama seperti di Master-Loket.vue
const loketData = ref([
  { id: 1, no: 1, namaLoket: 'Loket 1', kuota: 500, pelayanan: ['RADIOTERAPI', 'REHAB MEDIK', 'TINDAKAN'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 2, no: 2, namaLoket: 'Loket 2', kuota: 666, pelayanan: ['JIWA', 'SARAF'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 3, no: 3, namaLoket: 'Loket 3', kuota: 666, pelayanan: ['ANESTESI', 'JANTUNG'], pembayaran: 'JKN', keterangan: 'ONLINE' },
  { id: 4, no: 4, namaLoket: 'Loket 4', kuota: 3676, pelayanan: ['KULIT KELAMIN', 'PARU'], pembayaran: 'JKN', keterangan: 'ONLINE' },
]);

const loket = ref({
  id: null,
  namaLoket: '',
  kuota: 0,
  statusPelayanan: '',
  pembayaran: '',
  keterangan: '',
  pelayanan: [],
});

const serviceHeaders = ref([
  { title: '#', value: 'no', sortable: false },
  { title: 'Kode', value: 'id' },
  { title: 'Klinik', value: 'nama' },
  { title: 'Pilih', value: 'pilih', sortable: false },
]);

const availableServices = ref([
  { no: 1, id: 'AN', nama: 'ANAK' },
  { no: 2, id: 'AS', nama: 'ANESTESI' },
  { no: 3, id: 'BD', nama: 'BEDAH' },
  { no: 4, id: 'GR', nama: 'GERIATRI' },
  { no: 5, id: 'GI', nama: 'GIGI DAN MULUT' },
  { no: 6, id: 'GZ', nama: 'GIZI' },
  { no: 7, id: 'HO', nama: 'HOM' },
  { no: 8, id: 'IP', nama: 'IPD' },
]);

onMounted(() => {
  // Cari loket yang sesuai dengan ID di URL
  const selectedLoket = loketData.value.find(loket => loket.id === parseInt(route.params.id));
  
  if (selectedLoket) {
    // Jika data ditemukan, salin ke objek loket
    loket.value = { ...selectedLoket };
    // Konversi string pelayanan menjadi array untuk checkbox
    if (typeof loket.value.pelayanan === 'string') {
        loket.value.pelayanan = loket.value.pelayanan.split(', ').map(s => s.trim());
    }
  }
});

const simpanLoket = () => {
  // Dalam aplikasi nyata, ini adalah tempat untuk memanggil API update data
  
  // Untuk simulasi, kita akan kembali ke halaman master
  router.back();
};

const cancelEdit = () => {
  router.back();
};
</script>