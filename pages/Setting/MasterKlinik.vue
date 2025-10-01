<template>
  <div class="master-klinik-page pa-4">
    <!-- Breadcrumbs -->
    <v-breadcrumbs :items="breadcrumbs" class="pl-0">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Tampilan Formulir Tambah/Edit/View -->
    <v-card v-if="showForm" class="pa-4 rounded-lg elevation-2">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        {{ isEditMode ? 'Edit Klinik' : readOnly ? 'Detail Klinik' : 'Tambah Klinik' }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Kode</v-label>
            <v-text-field
              v-model="editedItem.kode"
              placeholder="Masukkan Kode Klinik"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Nama</v-label>
            <v-text-field
              v-model="editedItem.namaKlinik"
              placeholder="Masukkan Nama Klinik"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Shift</v-label>
            <v-text-field
              v-model="editedItem.shift"
              placeholder="Jumlah Shift"
              type="number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Kuota Shift</v-label>
            <v-text-field
              v-model="editedItem.kuotaShift"
              placeholder="Kuota Per Shift"
              type="number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="d-flex align-center">
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Jam Buka Shift</v-label>
            <div class="d-flex align-center">
              <v-text-field
                v-model="editedItem.jamBuka"
                placeholder="Jam Buka Shift 1"
                variant="outlined"
                density="comfortable"
                class="mr-2"
                :readonly="readOnly"
              ></v-text-field>
              <span class="text-h6 font-weight-bold mr-2">:</span>
              <v-text-field
                v-model="editedItem.menitBuka"
                placeholder="Menit Buka Shift 1"
                variant="outlined"
                density="comfortable"
                :readonly="readOnly"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="editedItem.autoShift"
              inset
              color="primary"
              label="Auto Shift"
              hide-details
              :readonly="readOnly"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-label class="font-weight-bold">Kuota Bangku</v-label>
            <v-text-field
              v-model="editedItem.kuotaBangku"
              placeholder="Masukkan Kuota Bangku Klinik"
              type="number"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-label class="font-weight-bold">Jadwal Klinik</v-label>
            <v-table class="rounded-lg elevation-1 mt-2">
              <thead>
                <tr>
                  <th class="text-left text-uppercase font-weight-bold">#</th>
                  <th class="text-left text-uppercase font-weight-bold">Hari</th>
                  <th class="text-left text-uppercase font-weight-bold">Pilih</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(day, index) in days" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ day.name }}</td>
                  <td>
                    <v-checkbox
                      v-model="day.selected"
                      color="primary"
                      hide-details
                      :readonly="readOnly"
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-table>
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
          <v-icon icon="mdi-hospital" class="mr-2" size="40"></v-icon>
          <span>Master Klinik</span>
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
            :items="allKlinikData"
            :search="search"
            :items-per-page="itemsPerPage"
            v-model:page="page"
            class="rounded-lg elevation-0 custom-table"
          >
            <!-- Slot untuk aksi di setiap baris -->
            <template v-slot:[`item.actions`]="{ item }">
              <!-- Tombol "View" yang hanya menampilkan detail -->
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
const readOnly = ref(false); // State untuk mode "view"

// Data dummy untuk Master Klinik
const allKlinikData = ref([
  { id: 1, kode: 'AN', namaKlinik: 'ANAK', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 2, kode: 'AS', namaKlinik: 'ANESTESI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 3, kode: 'BD', namaKlinik: 'BEDAH', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 4, kode: 'GR', namaKlinik: 'GERIATRI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 5, kode: 'GI', namaKlinik: 'GIGI DAN MULUT', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 6, kode: 'GZ', namaKlinik: 'GIZI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 7, kode: 'HO', namaKlinik: 'HOM', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 8, kode: 'IP', namaKlinik: 'IPD', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 9, kode: 'JT', namaKlinik: 'JANTUNG', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 10, kode: 'JW', namaKlinik: 'JIWA', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 11, kode: 'OB', namaKlinik: 'KANDUNGAN', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 12, kode: 'KT', namaKlinik: 'KEMOTERAPI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 13, kode: 'KN', namaKlinik: 'KOMPLEMENTER', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 14, kode: 'KL', namaKlinik: 'KUL KEL', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 15, kode: 'MT', namaKlinik: 'MATA', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 16, kode: 'MC', namaKlinik: 'MCU', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 17, kode: 'ON', namaKlinik: 'ONKOLOGI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 18, kode: 'PR', namaKlinik: 'PARU', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 19, kode: 'RT', namaKlinik: 'R. TINDAKAN', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 20, kode: 'RD', namaKlinik: 'RADIOTERAPI', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 21, kode: 'RM', namaKlinik: 'REHAB MEDIK', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 22, kode: 'NU', namaKlinik: 'SARAF', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
  { id: 23, kode: 'TH', namaKlinik: 'THT', shift: 1, kuotaShift: 1000, kuotaBangku: 50, jamBuka: '08', menitBuka: '00', autoShift: true, jadwal: [] },
]);

const headers = ref([
  { title: 'No', key: 'id' },
  { title: 'Kode', key: 'kode', sortable: true },
  { title: 'Nama Klinik', key: 'namaKlinik', sortable: true },
  { title: 'Shift', key: 'shift', sortable: true },
  { title: 'Kuota Shift', key: 'kuotaShift', sortable: true },
  { title: 'Aksi', key: 'actions', sortable: false },
]);

// Breadcrumbs
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Setting', disabled: false, href: '/setting' },
  { title: 'Master Klinik', disabled: false, href: '/setting/masterklinik' },
]);

const days = ref([
  { name: 'Senin', selected: false },
  { name: 'Selasa', selected: false },
  { name: 'Rabu', selected: false },
  { name: 'Kamis', selected: false },
  { name: 'Jum`at', selected: false },
]);

// State untuk tabel dan paginasi
const itemsPerPage = ref(10);
const search = ref('');
const page = ref(1);

// Computed properties untuk paginasi kustom
const pageCount = computed(() => {
  return Math.ceil(allKlinikData.value.length / itemsPerPage.value);
});

const showingEntriesText = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(page.value * itemsPerPage.value, allKlinikData.value.length);
  const total = allKlinikData.value.length;
  return `Showing ${start} to ${end} of ${total} entries`;
});

// State untuk dialog
const showDeleteDialog = ref(false);
const isEditMode = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  id: 0,
  kode: '',
  namaKlinik: '',
  shift: 1,
  kuotaShift: 0,
  kuotaBangku: 0,
  jamBuka: '',
  menitBuka: '',
  autoShift: false,
});


// Fungsi untuk tombol aksi
// Fungsi untuk tombol View yang hanya menampilkan data tanpa bisa diedit
const viewItem = (item) => {
  editedItem.value = { ...item };
  readOnly.value = true;
  isEditMode.value = false;
  showForm.value = true;
  // Update breadcrumbs untuk mode view
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik', disabled: false, href: '/setting/masterklinik' },
    { title: 'Detail Klinik', disabled: true, href: '/setting/viewklinik' },
  ];
};

const editItem = (item) => {
  editedIndex.value = allKlinikData.value.findIndex(d => d.id === item.id);
  editedItem.value = { ...item };
  isEditMode.value = true;
  readOnly.value = false;
  showForm.value = true;
  // Update breadcrumbs untuk mode edit
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik', disabled: false, href: '/setting/masterklinik' },
    { title: 'Edit Klinik', disabled: true, href: '/setting/editklinik' },
  ];
};

const deleteItem = (item) => {
  editedIndex.value = allKlinikData.value.findIndex(d => d.id === item.id);
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (editedIndex.value > -1) {
    allKlinikData.value.splice(editedIndex.value, 1);
  }
  closeDeleteDialog();
};

const cancelForm = () => {
  showForm.value = false;
  isEditMode.value = false;
  readOnly.value = false;
  editedItem.value = {
    id: 0,
    kode: '',
    namaKlinik: '',
    shift: 1,
    kuotaShift: 0,
    kuotaBangku: 0,
    jamBuka: '',
    menitBuka: '',
    autoShift: false,
  };
  editedIndex.value = -1;
  // Reset breadcrumbs ke mode tabel
  breadcrumbs.value = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Master Klinik', disabled: false, href: '/setting/masterklinik' },
  ];
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  editedIndex.value = -1;
};

const saveItem = () => {
  if (isEditMode.value) {
    Object.assign(allKlinikData.value[editedIndex.value], editedItem.value);
  } else {
    // Generate new ID
    const newId = allKlinikData.value.length > 0 ? Math.max(...allKlinikData.value.map(item => item.id)) + 1 : 1;
    editedItem.value.id = newId;
    allKlinikData.value.push(editedItem.value);
  }
  cancelForm(); // Kembali ke tampilan tabel setelah menyimpan
};
</script>

<style scoped>
.master-klinik-page {
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
