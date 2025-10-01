<template>
  <div class="master-klinik-ruang-page pa-4">
    <!-- Breadcrumbs -->
    <v-breadcrumbs :items="breadcrumbs" class="pl-0">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Tampilan Formulir Tambah/Edit/View -->
    <v-card v-if="showForm" class="pa-4 rounded-lg elevation-2">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        {{ isEditMode ? 'Edit Ruang Klinik' : readOnly ? 'Detail Ruang Klinik' : 'Tambah Ruang Klinik' }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Nama Klinik</v-label>
            <v-select
              v-model="editedItem.namaKlinik"
              :items="['ANAK', 'ANESTESI', 'BEDAH', 'GERIATRI', 'GIGI DAN MULUT', 'GIZI', 'HOM', 'IPD', 'JANTUNG', 'JIWA', 'KANDUNGAN', 'KEMOTERAPI', 'KOMPLEMENTER', 'KUL KEL', 'MATA', 'MCU', 'ONKOLOGI', 'PARU', 'R. TINDAKAN', 'RADIOTERAPI', 'REHAB MEDIK', 'SARAF', 'THT']"
              placeholder="Pilih Nama Klinik"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Kode Ruang</v-label>
            <v-text-field
              v-model="editedItem.kode"
              placeholder="Masukkan Kode Ruang"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-label class="font-weight-bold">Nama Ruang</v-label>
            <v-text-field
              v-model="editedItem.namaRuang"
              placeholder="Masukkan Nama Ruang"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-start pa-4">
        <v-btn
          color="grey-darken-1"
          variant="flat"
          class="text-capitalize rounded-lg mr-2"
          @click="cancelForm"
        >
          {{ readOnly ? 'Tutup' : 'Batal' }}
        </v-btn>
        <v-btn
          v-if="!readOnly"
          color="orange-darken-2"
          variant="flat"
          class="text-capitalize rounded-lg"
          @click="saveItem"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Tampilan Tabel Data -->
    <div v-else>
      <!-- Banner biru sebagai pengganti header h1 -->
      <v-card class="d-flex justify-space-between align-center pa-4 mb-4 rounded-lg bg-blue-darken-2 text-white elevation-2">
        <v-card-title class="d-flex align-center text-h5 font-weight-bold pa-0">
          <v-icon icon="mdi-hospital-box-outline" class="mr-2" size="40"></v-icon>
          <span>Master Klinik Ruang</span>
        </v-card-title>
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          rounded
          class="text-capitalize"
          @click="showForm = true"
        >
          Tambah Baru
        </v-btn>
      </v-card>

      <v-card class="pa-4 rounded-lg elevation-2">
        <v-card-text>
          <!-- Table controls -->
          <div class="d-flex flex-wrap align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <span class="mr-2 text-subtitle-1">Show</span>
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 50]"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 80px;"
                rounded
                class="mr-2"
              ></v-select>
              <span class="text-subtitle-1">entries</span>
            </div>
            <div class="d-flex align-center">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                variant="outlined"
                density="compact"
                hide-details
                rounded
                clearable
              ></v-text-field>
            </div>
          </div>

          <!-- Data Table dengan paginasi kustom -->
          <v-data-table
            :headers="headers"
            :items="allRuangData"
            :search="search"
            :items-per-page="itemsPerPage"
            v-model:page="page"
            class="rounded-lg elevation-0 custom-table"
          >
            <!-- Slot untuk aksi di setiap baris -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon color="blue" size="small" class="mr-2" @click="viewItem(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon color="orange" size="small" class="mr-2" @click="editItem(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" size="small" @click="deleteItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            
            <template v-slot:no-data>
              <v-alert :value="true" color="grey-lighten-3" icon="mdi-information">
                Tidak ada data yang tersedia.
              </v-alert>
            </template>

            <!-- Slot kustom untuk footer tabel (paginasi) -->
            <template v-slot:bottom>
              <v-row class="ma-2">
                <v-col cols="12" sm="6" class="d-flex align-center justify-start text-caption text-grey">
                  {{ showingEntriesText }}
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center justify-end">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                    rounded="circle"
                    :total-visible="5"
                  ></v-pagination>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </div>

  <!-- Delete Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="400px">
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="text-h6 font-weight-bold">Hapus Data</v-card-title>
      <v-card-text>Apakah Anda yakin ingin menghapus data ini?</v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="closeDeleteDialog">Batal</v-btn>
        <v-btn color="red" variant="text" @click="confirmDelete">Hapus</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  middleware:['auth']
})

// State untuk menampilkan/menyembunyikan formulir
const showForm = ref(false);
const readOnly = ref(false);

// Data dummy untuk Master Klinik Ruang
const allRuangData = ref([
  { id: 1, namaKlinik: 'ANAK', kode: 'AN-01', namaRuang: 'RUANG ANAK 1' },
  { id: 2, namaKlinik: 'ANAK', kode: 'AN-02', namaRuang: 'RUANG ANAK 2' },
  { id: 3, namaKlinik: 'ANESTESI', kode: 'AS-01', namaRuang: 'RUANG ANESTESI 1' },
  { id: 4, namaKlinik: 'BEDAH', kode: 'BD-01', namaRuang: 'RUANG BEDAH 1' },
  { id: 5, namaKlinik: 'GIGI DAN MULUT', kode: 'GI-01', namaRuang: 'RUANG GIGI DAN MULUT 1' },
  { id: 6, namaKlinik: 'GERIATRI', kode: 'GR-01', namaRuang: 'RUANG GERIATRI 1' },
  { id: 7, namaKlinik: 'GIZI', kode: 'GZ-01', namaRuang: 'RUANG GIZI 1' },
  { id: 8, namaKlinik: 'HOM', kode: 'HO-01', namaRuang: 'RUANG HOM 1' },
  { id: 9, namaKlinik: 'IPD', kode: 'IP-01', namaRuang: 'RUANG IPD 1' },
  { id: 10, namaKlinik: 'JANTUNG', kode: 'JT-01', namaRuang: 'RUANG JANTUNG 1' },
  { id: 11, namaKlinik: 'JIWA', kode: 'JW-01', namaRuang: 'RUANG JIWA 1' },
  { id: 12, namaKlinik: 'KANDUNGAN', kode: 'OB-01', namaRuang: 'RUANG KANDUNGAN 1' },
  { id: 13, namaKlinik: 'KANDUNGAN', kode: 'OB-02', namaRuang: 'RUANG KANDUNGAN 2' },
  { id: 14, namaKlinik: 'KEMOTERAPI', kode: 'KT-01', namaRuang: 'RUANG KEMOTERAPI 1' },
  { id: 15, namaKlinik: 'KOMPLEMENTER', kode: 'KN-01', namaRuang: 'RUANG KOMPLEMENTER 1' },
  { id: 16, namaKlinik: 'KUL KEL', kode: 'KL-01', namaRuang: 'RUANG KUL KEL 1' },
  { id: 17, namaKlinik: 'MATA', kode: 'MT-01', namaRuang: 'RUANG MATA 1' },
  { id: 18, namaKlinik: 'MCU', kode: 'MC-01', namaRuang: 'RUANG MCU 1' },
  { id: 19, namaKlinik: 'ONKOLOGI', kode: 'ON-01', namaRuang: 'RUANG ONKOLOGI 1' },
  { id: 20, namaKlinik: 'PARU', kode: 'PR-01', namaRuang: 'RUANG PARU 1' },
  { id: 21, namaKlinik: 'R. TINDAKAN', kode: 'RT-01', namaRuang: 'RUANG R. TINDAKAN 1' },
  { id: 22, namaKlinik: 'RADIOTERAPI', kode: 'RD-01', namaRuang: 'RUANG RADIOTERAPI 1' },
  { id: 23, namaKlinik: 'REHAB MEDIK', kode: 'RM-01', namaRuang: 'RUANG REHAB MEDIK 1' },
  { id: 24, namaKlinik: 'SARAF', kode: 'NU-01', namaRuang: 'RUANG SARAF 1' },
  { id: 25, namaKlinik: 'THT', kode: 'TH-01', namaRuang: 'RUANG THT 1' },
]);

const headers = ref([
  { title: 'No', key: 'id' },
  { title: 'Nama Klinik', key: 'namaKlinik', sortable: true },
  { title: 'Kode Ruang', key: 'kode', sortable: true },
  { title: 'Nama Ruang', key: 'namaRuang', sortable: true },
  { title: 'Aksi', key: 'actions', sortable: false },
]);

// Breadcrumbs
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Setting', disabled: false, href: '/setting' },
  { title: 'Master Klinik Ruang', disabled: false, href: '/setting/masterklinikruang' },
]);

// State untuk tabel dan paginasi
const itemsPerPage = ref(10);
const search = ref('');
const page = ref(1);

// Computed properties untuk paginasi kustom
const pageCount = computed(() => {
  return Math.ceil(allRuangData.value.length / itemsPerPage.value);
});

const showingEntriesText = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(page.value * itemsPerPage.value, allRuangData.value.length);
  const total = allRuangData.value.length;
  return `Showing ${start} to ${end} of ${total} entries`;
});

// State untuk dialog
const showDeleteDialog = ref(false);
const isEditMode = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  id: 0,
  namaKlinik: '',
  kode: '',
  namaRuang: '',
});

// Fungsi untuk tombol aksi
const viewItem = (item) => {
  editedItem.value = { ...item };
  readOnly.value = true;
  isEditMode.value = false;
  showForm.value = true;
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik Ruang', disabled: false, href: '/setting/masterklinikruang' },
    { title: 'Detail Ruang Klinik', disabled: true, href: '/setting/viewruang' },
  ];
};

const editItem = (item) => {
  editedIndex.value = allRuangData.value.findIndex(d => d.id === item.id);
  editedItem.value = { ...item };
  isEditMode.value = true;
  readOnly.value = false;
  showForm.value = true;
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik Ruang', disabled: false, href: '/setting/masterklinikruang' },
    { title: 'Edit Ruang Klinik', disabled: true, href: '/setting/editruang' },
  ];
};

const deleteItem = (item) => {
  editedIndex.value = allRuangData.value.findIndex(d => d.id === item.id);
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (editedIndex.value > -1) {
    allRuangData.value.splice(editedIndex.value, 1);
  }
  closeDeleteDialog();
};

const cancelForm = () => {
  showForm.value = false;
  isEditMode.value = false;
  readOnly.value = false;
  editedItem.value = {
    id: 0,
    namaKlinik: '',
    kode: '',
    namaRuang: '',
  };
  editedIndex.value = -1;
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik Ruang', disabled: false, href: '/setting/masterklinikruang' },
  ];
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  editedIndex.value = -1;
};

const saveItem = () => {
  if (isEditMode.value) {
    Object.assign(allRuangData.value[editedIndex.value], editedItem.value);
  } else {
    const newId = allRuangData.value.length > 0 ? Math.max(...allRuangData.value.map(item => item.id)) + 1 : 1;
    editedItem.value.id = newId;
    allRuangData.value.push(editedItem.value);
  }
  cancelForm();
};
</script>

<style scoped>
.master-klinik-ruang-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.custom-table {
  border: none;
}

.v-data-table :deep(th) {
  font-weight: bold !important;
  color: #333 !important;
}

.v-data-table :deep(td) {
  vertical-align: middle;
}

.v-btn--icon {
  border-radius: 8px;
}

.v-select :deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
