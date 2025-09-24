<!-- page edit id data pasien -->
<template>
  <div class="edit-pasien">
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" @click="goBack" class="mr-2"></v-btn>
      <h2>Edit Pasien</h2>
    </div>

    <!-- Form -->
    <v-card class="pa-6" elevation="2">
      <v-form ref="form" v-model="valid">
        <v-row>
          <!-- Tanggal Daftar -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.tanggal_daftar"
              label="Tanggal Daftar"
              variant="outlined"
              readonly
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- Tanggal Periksa -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.tanggal_periksa"
              label="Tanggal Periksa"
              variant="outlined"
              type="date"
              density="compact"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- No Barcode -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.no_barcode"
              label="No Barcode"
              variant="outlined"
              readonly
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- No Antrian -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.no_antrian"
              label="No Antrian"
              variant="outlined"
              readonly
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- No Klinik -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.no_klinik"
              label="No Klinik"
              variant="outlined"
              placeholder="Belum Mendapatkan Antrian Klinik"
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- No Rekammedik -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.no_rekammedik"
              label="No Rekammedik"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- Klinik -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.klinik"
              label="Klinik"
              :items="klinikOptions"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Shift -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.shift"
              label="Shift"
              :items="shiftOptions"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Keterangan -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.keterangan"
              label="Keterangan"
              variant="outlined"
              density="compact"
              readonly
            >
              <template v-slot:append-inner>
                <span class="text-red font-weight-bold">
                  {{ formData.keterangan }}
                </span>
              </template>
            </v-text-field>
          </v-col>

          <!-- Pembayaran -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.pembayaran"
              label="Pembayaran"
              :items="pembayaranOptions"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <div class="d-flex justify-end gap-4 mt-6">
          <v-btn variant="outlined" @click="cancel">
            Cancel
          </v-btn>
          <v-btn 
            color="warning" 
            @click="submit"
            :disabled="!valid"
            :loading="loading"
          >
            Submit
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const pasienId = route.params.id;

// Form data
const valid = ref(false);
const loading = ref(false);
const form = ref(null);

const formData = ref({
  tanggal_daftar: '',
  tanggal_periksa: '',
  no_barcode: '',
  no_antrian: '',
  no_klinik: '',
  no_rekammedik: '',
  klinik: '',
  shift: '',
  keterangan: '',
  pembayaran: ''
});

// Options
const klinikOptions = [
  'HOM',
  'KANDUNGAN', 
  'ANAK',
  'IPD',
  'JIWA',
  'KUL KEL',
  'KOMPLEMENTER',
  'MATA',
  'SARAF',
  'ONKOLOGI',
  'PARU',
  'RADIOTERAPI',
  'REHAB MEDIK',
  'THT',
  'MCU',
  'KEMOTERAPI',
  'R. TINDAKAN',
  'ANESTESI',
  'BEDAH',
  'GIGI DAN MULUT',
  'GERIATRI',
  'GIZI',
  'JANTUNG'
];

const shiftOptions = [
  'Shift 1 = Mulai Pukul 07:00',
  'Shift 2 = Mulai Pukul 13:00',
  'Shift 3 = Mulai Pukul 19:00'
];

const pembayaranOptions = [
  'JKN',
  'UMUM',
  'ASURANSI',
  'KARYAWAN'
];

// Validation rules
const rules = {
  required: value => !!value || 'Field ini wajib diisi'
};

// Mock data for editing
const mockPasienData = {
  1: {
    tanggal_daftar: '2025-08-13 00:00:03',
    tanggal_periksa: '2025-08-27',
    no_barcode: '25027100007',
    no_antrian: 'IP1001',
    no_klinik: 'Belum Mendapatkan Antrian Klinik',
    no_rekammedik: '11555500',
    klinik: 'IPD',
    shift: 'Shift 1 = Mulai Pukul 07:00',
    keterangan: 'PENDAFTARAN ONLINE',
    pembayaran: 'JKN'
  },
  2: {
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
};

// Methods
const loadPasienData = () => {
  const data = mockPasienData[pasienId];
  if (data) {
    formData.value = { ...data };
  }
};

const submit = async () => {
  if (!valid.value) return;
  
  loading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Updating pasien data:', formData.value);
    
    // Show success message (you can use a toast/snackbar here)
    alert('Data pasien berhasil diperbarui!');
    
    // Navigate back to list
    goBack();
  } catch (error) {
    console.error('Error updating pasien:', error);
    alert('Gagal memperbarui data pasien!');
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  goBack();
};

const goBack = () => {
  navigateTo('/data-pasien');
};

// Lifecycle
onMounted(() => {
  loadPasienData();
});
</script>

<style scoped>
.edit-pasien {
  padding: 20px;
}

.gap-4 {
  gap: 16px;
}

.text-red {
  color: #d32f2f;
}
</style>