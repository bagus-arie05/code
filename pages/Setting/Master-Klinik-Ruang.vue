<template>
  <v-container>
    <v-card>
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <v-icon size="32" color="white">mdi-door-open</v-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Master Klinik Ruang</h1>
              <p class="page-subtitle">Rabu, 13 Agustus 2025 - Manajemen Ruangan</p>
            </div>
          </div>
          <v-btn 
            color="white" 
            @click="openTambahDialog"
            elevation="0"
            class="add-btn"
          >
            <v-icon left size="20">mdi-plus-circle</v-icon>
            Tambah Ruang
          </v-btn>
        </div>
      </div>

      <!-- Table -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="ruangData"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.namaKlinik="{ item }">
            <v-chip size="small" color="primary" variant="outlined">
              {{ item.kodeKlinik }}
            </v-chip>
            <span class="ml-2">{{ item.namaKlinik }}</span>
          </template>
          
          <template v-slot:item.aksi="{ item }">
            <v-btn
              size="small"
              color="#1976d2"
              @click="openEditDialog(item)"
              class="mr-2"
              variant="flat"
            >
              <v-icon size="16" left>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn
              size="small"
              color="#f44336"
              @click="deleteRuang(item)"
              variant="flat"
            >
              <v-icon size="16" left>mdi-delete</v-icon>
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog Tambah/Edit -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="dialog-header">
          <span class="dialog-title">{{ isEdit ? 'Edit Klinik Ruang' : 'Tambah Klinik Ruang' }}</span>
          <v-btn icon variant="text" @click="closeDialog" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="dialog-content">
          <v-form ref="formRef">
            <!-- Klinik Selection -->
            <v-row>
              <v-col cols="12">
                <div class="section-header">
                  <v-icon color="primary" size="20">mdi-hospital-building</v-icon>
                  <span class="section-title">Pilih Klinik</span>
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Kode Klinik"
                  v-model="formData.kodeKlinik"
                  :items="klinikList"
                  item-title="kode"
                  item-value="kode"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Kode klinik harus dipilih']"
                  required
                  hide-details="auto"
                  placeholder="Masukkan Kode Klinik"
                  @update:model-value="onKlinikChange"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-chip size="small" color="primary">{{ item.raw.kode }}</v-chip>
                      </template>
                      <v-list-item-title>{{ item.raw.nama }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <small class="text-grey">Masukan Kode Ruang 2 Huruf</small>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Nama Klinik"
                  v-model="formData.namaKlinik"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  hide-details="auto"
                  placeholder="Nama akan terisi otomatis"
                  bg-color="grey-lighten-4"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Ruang Section -->
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="section-header">
                  <v-icon color="primary" size="20">mdi-door</v-icon>
                  <span class="section-title">Daftar Ruangan</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    size="small"
                    color="success"
                    variant="flat"
                    @click="addRuang"
                  >
                    <v-icon size="18" left>mdi-plus</v-icon>
                    Add Ruang
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="ruang-list">
                  <div 
                    v-for="(ruang, index) in formData.ruangList" 
                    :key="index" 
                    class="ruang-item"
                  >
                    <v-row align="center">
                      <v-col cols="12" md="1">
                        <div class="ruang-number">
                          <v-icon size="16">mdi-numeric-{{ index + 1 }}-circle</v-icon>
                        </div>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Nomor Ruang"
                          v-model="ruang.nomorRuang"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          placeholder="Masukan Nomor Ruangan"
                          prepend-inner-icon="mdi-pound"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          label="Nama Ruang"
                          v-model="ruang.namaRuang"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          placeholder="Masukan Nama Klinik Ruang"
                          prepend-inner-icon="mdi-door-open"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Nomor Screen"
                          v-model="ruang.nomorScreen"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          placeholder="Screen Klinik Ruang"
                          prepend-inner-icon="mdi-monitor"
                        ></v-text-field>
                        <small class="text-grey">Masukan Nomor Screen Ruang</small>
                      </v-col>

                      <v-col cols="12" md="1" class="d-flex justify-center">
                        <v-btn
                          v-if="formData.ruangList.length > 1"
                          icon
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeRuang(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <v-alert 
                    v-if="formData.ruangList.length === 0"
                    type="info"
                    variant="tonal"
                    class="mt-2"
                  >
                    <v-icon left>mdi-information</v-icon>
                    Klik "Add Ruang" untuk menambahkan ruangan
                  </v-alert>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-lighten-2"
            @click="closeDialog"
            class="action-btn"
          >
            <v-icon left size="18">mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="warning"
            @click="submitForm"
            class="action-btn"
          >
            <v-icon left size="18">mdi-content-save</v-icon>
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
const isEdit = ref(false);
const formRef = ref(null);

const headers = ref([
  { title: 'No', value: 'no', sortable: true },
  { title: 'Nama Klinik', value: 'namaKlinik', sortable: true },
  { title: 'Kode', value: 'kodeKlinik', sortable: true },
  { title: 'Nama Ruang', value: 'namaRuang', sortable: true },
  { title: 'Aksi', value: 'aksi', sortable: false },
]);

// List klinik dari Master Klinik
const klinikList = ref([
  { kode: 'AN', nama: 'ANAK' },
  { kode: 'AS', nama: 'ANESTESI' },
  { kode: 'BD', nama: 'BEDAH' },
  { kode: 'GR', nama: 'GERIATRI' },
  { kode: 'GI', nama: 'GIGI DAN MULUT' },
  { kode: 'GZ', nama: 'GIZI' },
  { kode: 'HO', nama: 'HOM' },
  { kode: 'IP', nama: 'IPD' },
  { kode: 'JT', nama: 'JANTUNG' },
  { kode: 'JW', nama: 'JIWA' },
  { kode: 'KK', nama: 'KULIT KELAMIN' },
  { kode: 'MT', nama: 'MATA' },
  { kode: 'OB', nama: 'OBGYN' },
  { kode: 'PR', nama: 'PARU' },
  { kode: 'RT', nama: 'RADIOTERAPI' },
]);

const ruangData = ref([
  { 
    id: 1, 
    no: 1, 
    kodeKlinik: 'AN', 
    namaKlinik: 'ANAK', 
    namaRuang: 'R. TINDAKAN',
    ruangList: [
      { nomorRuang: '1', namaRuang: 'R. TINDAKAN', nomorScreen: '101' }
    ]
  },
  { 
    id: 2, 
    no: 2, 
    kodeKlinik: 'AS', 
    namaKlinik: 'ANESTESI', 
    namaRuang: 'Ruang 1, Ruang 2',
    ruangList: [
      { nomorRuang: '1', namaRuang: 'Ruang 1', nomorScreen: '201' },
      { nomorRuang: '2', namaRuang: 'Ruang 2', nomorScreen: '202' }
    ]
  },
  { 
    id: 3, 
    no: 3, 
    kodeKlinik: 'BD', 
    namaKlinik: 'BEDAH', 
    namaRuang: 'Ruang Konsultasi',
    ruangList: [
      { nomorRuang: '1', namaRuang: 'Ruang Konsultasi', nomorScreen: '301' }
    ]
  },
  { 
    id: 4, 
    no: 4, 
    kodeKlinik: 'GR', 
    namaKlinik: 'GERIATRI', 
    namaRuang: 'Ruang Pemeriksaan',
    ruangList: [
      { nomorRuang: '1', namaRuang: 'Ruang Pemeriksaan', nomorScreen: '401' }
    ]
  },
  { 
    id: 5, 
    no: 5, 
    kodeKlinik: 'GI', 
    namaKlinik: 'GIGI DAN MULUT', 
    namaRuang: 'Ruang 1, Ruang 2, Ruang 3',
    ruangList: [
      { nomorRuang: '1', namaRuang: 'Ruang 1', nomorScreen: '501' },
      { nomorRuang: '2', namaRuang: 'Ruang 2', nomorScreen: '502' },
      { nomorRuang: '3', namaRuang: 'Ruang 3', nomorScreen: '503' }
    ]
  },
]);

const formData = ref({
  id: null,
  kodeKlinik: '',
  namaKlinik: '',
  ruangList: [
    { nomorRuang: '', namaRuang: '', nomorScreen: '' }
  ],
});

const onKlinikChange = (kode) => {
  const selectedKlinik = klinikList.value.find(k => k.kode === kode);
  if (selectedKlinik) {
    formData.value.namaKlinik = selectedKlinik.nama;
  }
};

const addRuang = () => {
  formData.value.ruangList.push({
    nomorRuang: '',
    namaRuang: '',
    nomorScreen: ''
  });
};

const removeRuang = (index) => {
  if (formData.value.ruangList.length > 1) {
    formData.value.ruangList.splice(index, 1);
  }
};

const openTambahDialog = () => {
  isEdit.value = false;
  resetForm();
  dialog.value = true;
};

const openEditDialog = (item) => {
  isEdit.value = true;
  formData.value = {
    id: item.id,
    kodeKlinik: item.kodeKlinik,
    namaKlinik: item.namaKlinik,
    ruangList: JSON.parse(JSON.stringify(item.ruangList)),
  };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    id: null,
    kodeKlinik: '',
    namaKlinik: '',
    ruangList: [
      { nomorRuang: '', namaRuang: '', nomorScreen: '' }
    ],
  };
  if (formRef.value) {
    formRef.value.reset();
  }
};

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    return;
  }

  if (formData.value.ruangList.length === 0) {
    alert('Tambahkan minimal 1 ruangan');
    return;
  }

  // Generate nama ruang untuk display di table
  const namaRuangDisplay = formData.value.ruangList
    .map(r => r.namaRuang)
    .filter(n => n)
    .join(', ');

  if (isEdit.value) {
    const index = ruangData.value.findIndex(r => r.id === formData.value.id);
    if (index !== -1) {
      ruangData.value[index] = {
        ...ruangData.value[index],
        ...formData.value,
        namaRuang: namaRuangDisplay,
      };
    }
  } else {
    const newId = Math.max(...ruangData.value.map(r => r.id)) + 1;
    const newNo = ruangData.value.length + 1;
    ruangData.value.push({
      id: newId,
      no: newNo,
      ...formData.value,
      namaRuang: namaRuangDisplay,
    });
  }

  closeDialog();
};

const deleteRuang = (item) => {
  if (confirm(`Hapus ruangan ${item.namaRuang} dari klinik ${item.namaKlinik}?`)) {
    const index = ruangData.value.findIndex(r => r.id === item.id);
    if (index !== -1) {
      ruangData.value.splice(index, 1);
      ruangData.value.forEach((r, idx) => {
        r.no = idx + 1;
      });
    }
  }
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  margin-right: 20px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.add-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 0 24px !important;
  height: 44px !important;
  color: #4caf50 !important;
}

.dialog-header {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
}

.dialog-content {
  padding: 24px !important;
  max-height: 650px;
  overflow-y: auto;
}

.dialog-actions {
  padding: 16px 24px;
  background: #f5f5f5;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  min-width: 120px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
}

.ruang-list {
  background: #f8f9fa;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  padding: 16px;
}

.ruang-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.ruang-item:last-child {
  margin-bottom: 0;
}

.ruang-number {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  padding: 8px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}
</style>