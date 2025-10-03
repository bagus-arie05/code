<template>
  <v-container>
    <v-card class="form-card" elevation="0">
      <!-- Header -->
      <div class="form-header">
        <div class="header-content">
          <div class="header-left">
            <v-btn
              icon
              variant="text"
              color="white"
              @click="cancelAdd"
              class="back-btn"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="header-text">
              <h1 class="page-title">Tambah Loket Baru</h1>
              <p class="page-subtitle">Isi form untuk menambahkan loket</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <v-card-text class="form-content">
        <v-form @submit.prevent="simpanLoket" ref="formRef">
          <!-- Section: Informasi Loket -->
          <div class="form-section">
            <h3 class="section-title">Informasi Loket</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Nama Loket"
                  v-model="loket.namaLoket"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Nama loket harus diisi']"
                  required
                  hide-details="auto"
                  class="form-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Kuota Bangku"
                  v-model="loket.kuota"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Kuota harus diisi', v => v > 0 || 'Kuota harus lebih dari 0']"
                  required
                  hide-details="auto"
                  class="form-field"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Section: Konfigurasi -->
          <div class="form-section">
            <h3 class="section-title">Konfigurasi</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  label="Status Pelayanan"
                  :items="['RAWAT JALAN', 'RAWAT INAP']"
                  v-model="loket.statusPelayanan"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Status pelayanan harus dipilih']"
                  required
                  hide-details="auto"
                  class="form-field"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="Pembayaran"
                  :items="['JKN', 'UMUM', 'SPM', 'JKMM', 'JAMPERSAL', 'T4', 'KARYAWAN']"
                  v-model="loket.pembayaran"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Pembayaran harus dipilih']"
                  required
                  hide-details="auto"
                  class="form-field"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="Keterangan"
                  :items="['ONLINE', 'OFFLINE']"
                  v-model="loket.keterangan"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Keterangan harus dipilih']"
                  required
                  hide-details="auto"
                  class="form-field"
                ></v-select>
              </v-col>
            </v-row>
          </div>

          <!-- Section: Pelayanan -->
          <div class="form-section">
            <h3 class="section-title">Pilih Pelayanan</h3>
            <div class="table-wrapper">
              <TabelLayanan
                :headers="serviceHeaders"
                :items="availableServices"
                v-model:selected-items="loket.pelayanan"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <v-btn
              color="#1976d2"
              type="submit"
              size="large"
              class="action-btn save-btn"
            >
              <v-icon left>mdi-content-save</v-icon>
              Simpan Loket
            </v-btn>
            <v-btn
              color="grey-lighten-2"
              @click="cancelAdd"
              size="large"
              class="action-btn cancel-btn"
            >
              <v-icon left>mdi-close</v-icon>
              Batal
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TabelLayanan from '../../components/TabelLayanan.vue';

const router = useRouter();
const formRef = ref(null);

const loket = ref({
  namaLoket: '',
  kuota: null,
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
  { no: 9, id: 'JT', nama: 'JANTUNG' },
  { no: 10, id: 'JW', nama: 'JIWA' },
  { no: 11, id: 'KK', nama: 'KULIT KELAMIN' },
  { no: 12, id: 'PR', nama: 'PARU' },
  { no: 13, id: 'RT', nama: 'RADIOTERAPI' },
  { no: 14, id: 'RM', nama: 'REHAB MEDIK' },
  { no: 15, id: 'SR', nama: 'SARAF' },
  { no: 16, id: 'TD', nama: 'TINDAKAN' },
]);

const simpanLoket = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    return;
  }

  // Validasi pelayanan
  if (loket.value.pelayanan.length === 0) {
    alert('Pilih minimal 1 pelayanan');
    return;
  }

  // Dalam aplikasi nyata, ini adalah tempat untuk memanggil API create data
  console.log('Data loket baru:', loket.value);
  
  // Kembali ke halaman master
  router.push('/Setting/Master-Loket');
};

const cancelAdd = () => {
  router.back();
};
</script>

<style scoped>
.form-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.form-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
}

.header-content {
  padding: 28px 32px;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.form-content {
  padding: 32px !important;
  background: #fafafa;
}

.form-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e3f2fd;
}

.form-field {
  margin-bottom: 4px;
}

.table-wrapper {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  min-width: 140px;
}

.save-btn {
  color: white;
}

.cancel-btn {
  color: #616161;
}
</style>