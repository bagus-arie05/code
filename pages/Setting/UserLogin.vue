<template>
  <div class="user-login-page pa-4">
    <v-breadcrumbs :items="breadcrumbs" class="pl-0">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card v-if="showForm" class="pa-4 rounded-lg elevation-2">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        {{ isEditMode ? 'Edit Pengguna' : readOnly ? 'Detail Pengguna' : 'Tambah Pengguna' }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Nama Lengkap</v-label>
            <v-text-field
              v-model="editedItem.namaLengkap"
              placeholder="Masukkan Nama Lengkap"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Nama User</v-label>
            <v-text-field
              v-model="editedItem.namaUser"
              placeholder="Masukkan Nama User"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Tipe User</v-label>
            <v-select
              v-model="editedItem.tipeUser"
              :items="['Super Admin', 'Admin', 'Loket', 'Klinik', 'Admin Barcode', 'INOVA', 'Ranap', 'Report Only', 'Farmasi', 'Manager']"
              placeholder="Pilih Tipe User"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Keterangan</v-label>
            <v-text-field
              v-model="editedItem.keterangan"
              placeholder="Masukkan Keterangan"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Roles</v-label>
            <v-select
              v-model="editedItem.roles"
              :items="availableRoles"
              multiple
              chips
              placeholder="Pilih Roles Pengguna"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="font-weight-bold">Groups</v-label>
            <v-select
              v-model="editedItem.groups"
              :items="availableGroups"
              multiple
              chips
              placeholder="Pilih Groups Pengguna"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :readonly="readOnly"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="!readOnly && !isEditMode">
          <v-col cols="12">
            <v-label class="font-weight-bold">Password</v-label>
            <v-text-field
              v-model="editedItem.password"
              placeholder="Masukkan Password"
              type="password"
              variant="outlined"
              density="comfortable"
              class="mb-2"
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

    <div v-else>
      <v-card class="d-flex justify-space-between align-center pa-4 mb-4 rounded-lg bg-blue-darken-2 text-white elevation-2">
        <v-card-title class="d-flex align-center text-h5 font-weight-bold pa-0">
          <v-icon icon="mdi-account-group-outline" class="mr-2" size="40"></v-icon>
          <span>User Login</span>
        </v-card-title>
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          rounded
          class="text-capitalize"
          @click="showAddForm"
        >
          Tambah User
        </v-btn>
      </v-card>

      <v-card class="pa-4 rounded-lg elevation-2">
        <v-card-text>
          <div class="d-flex flex-wrap align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <span class="mr-2 text-subtitle-1">Show</span>
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100]"
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

          <v-data-table
            :headers="headers"
            :items="allUserData"
            :search="search"
            :items-per-page="itemsPerPage"
            v-model:page="page"
            class="rounded-lg elevation-0 custom-table"
          >
            <template v-slot:[`item.roles`]="{ item }">
              <v-chip
                v-for="role in item.roles"
                :key="role"
                color="blue-lighten-1"
                size="small"
                class="mr-1 mb-1"
              >
                {{ role }}
              </v-chip>
            </template>
            
            <template v-slot:[`item.groups`]="{ item }">
              <v-chip
                v-for="group in item.groups"
                :key="group"
                color="purple-lighten-1"
                size="small"
                class="mr-1 mb-1"
              >
                {{ group }}
              </v-chip>
            </template>
            
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

    <!-- Custom Modal/Dialog for Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card class="pa-4 rounded-lg">
        <v-card-title class="text-h6 font-weight-bold">Hapus Data</v-card-title>
        <v-card-text>Apakah Anda yakin ingin menghapus data **{{ itemToDelete?.namaLengkap }}**?</v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="grey-darken-1" variant="text" @click="closeDeleteDialog">Batal</v-btn>
          <v-btn color="red" variant="text" @click="confirmDelete">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  middleware:['auth']
})

// --- NEW DATA LISTS FOR SELECTION ---
const availableRoles = [
  'User_Standard', 'User_Report', 'User_Klinik', 'User_Farmasi', 
  'Admin_UserManagement', 'Admin_System', 'Manager_View'
];
const availableGroups = [
  '/RS/Klinik', '/RS/Loket', '/RS/Farmasi', '/RS/IT', '/RS/Management'
];
// ------------------------------------

// Define the core user data structure (without IDs initially)
const rawUserData = [
  { namaLengkap: 'LOKET 1', namaUser: 'loket1', tipeUser: 'Loket', keterangan: 'Loket 1', roles: ['User_Standard'], groups: ['/RS/Loket'] },
  { namaLengkap: 'LOKET 2', namaUser: 'loket2', tipeUser: 'Loket', keterangan: 'Loket 2', roles: ['User_Standard'], groups: ['/RS/Loket'] },
  { namaLengkap: 'LOKET 3', namaUser: 'loket3', tipeUser: 'Loket', keterangan: 'Loket 3', roles: ['User_Standard'], groups: ['/RS/Loket'] },
  { namaLengkap: 'ANAK', namaUser: 'anak', tipeUser: 'Klinik', keterangan: 'ANAK', roles: ['User_Klinik'], groups: ['/RS/Klinik'] },
  { namaLengkap: 'ADMIN PRAM', namaUser: 'adminpram', tipeUser: 'Admin', keterangan: 'Administrator Utama', roles: ['Admin_UserManagement', 'User_Report'], groups: ['/RS/IT'] },
  { namaLengkap: 'Report Only', namaUser: 'laporan', tipeUser: 'Report Only', keterangan: 'Hanya melihat laporan', roles: ['User_Report'], groups: ['/RS/Management'] },
  { namaLengkap: 'Farmasi Utama', namaUser: 'farmasi_utama', tipeUser: 'Farmasi', keterangan: 'Apoteker Penanggung Jawab', roles: ['User_Farmasi'], groups: ['/RS/Farmasi'] },
  { namaLengkap: 'Super Admin User', namaUser: 'superadmin', tipeUser: 'Super Admin', keterangan: 'Full Control System', roles: ['Admin_System', 'Admin_UserManagement', 'User_Standard'], groups: ['/RS/IT', '/RS/Management'] },
  // Adding more generic data to make the list longer and sequential
  { namaLengkap: 'Klinik Umum', namaUser: 'klinik_umum', tipeUser: 'Klinik', keterangan: 'Dokter Umum', roles: ['User_Klinik'], groups: ['/RS/Klinik'] },
  { namaLengkap: 'Manajer Keuangan', namaUser: 'manager_keu', tipeUser: 'Manager', keterangan: 'Pengelola Anggaran', roles: ['Manager_View', 'User_Report'], groups: ['/RS/Management'] },
];

// Map over the raw data to assign sequential IDs starting from 1
const allUserData = ref(rawUserData.map((item, index) => ({
  ...item,
  id: index + 1
})));

// State untuk menampilkan/menyembunyikan formulir
const showForm = ref(false);
const readOnly = ref(false);

const headers = ref([
  { title: 'No', key: 'id' },
  { title: 'Nama Lengkap', key: 'namaLengkap', sortable: true },
  { title: 'Nama User', key: 'namaUser', sortable: true },
  { title: 'Tipe User', key: 'tipeUser', sortable: true },
  { title: 'Roles', key: 'roles', sortable: false }, 
  { title: 'Groups', key: 'groups', sortable: false }, 
  { title: 'Keterangan', key: 'keterangan', sortable: true },
  { title: 'Aksi', key: 'actions', sortable: false },
]);

// Breadcrumbs
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '#/dashboard' },
  { title: 'Setting', disabled: false, href: '#/setting' },
  { title: 'User Login', disabled: false, href: '#/setting/userlogin' },
]);

// State untuk tabel dan paginasi
const itemsPerPage = ref(10);
const search = ref('');
const page = ref(1);
const itemToDelete = ref(null);

// State untuk dialog dan form
const showDeleteDialog = ref(false);
const isEditMode = ref(false);
const editedIndex = ref(-1);
const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
});


// Updated `editedItem` structure with new fields
const editedItem = ref({
  id: 0,
  namaLengkap: '',
  namaUser: '',
  tipeUser: '',
  keterangan: '',
  password: '',
  roles: [],
  groups: []
});

// Computed properties untuk paginasi kustom
const pageCount = computed(() => {
  return Math.ceil(allUserData.value.length / itemsPerPage.value);
});

const showingEntriesText = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(page.value * itemsPerPage.value, allUserData.value.length);
  const total = allUserData.value.length;
  // Handle case where total is 0 (no data)
  if (total === 0) return 'Showing 0 to 0 of 0 entries';
  return `Showing ${start} to ${end} of ${total} entries`;
});

// FUNCTIONS

const resetForm = () => {
  editedItem.value = {
    id: 0,
    namaLengkap: '',
    namaUser: '',
    tipeUser: '',
    keterangan: '',
    password: '',
    roles: [],
    groups: []
  };
};

const showAddForm = () => {
  resetForm();
  isEditMode.value = false;
  readOnly.value = false;
  showForm.value = true;
};

const viewItem = (item) => {
  // We copy the item data for view mode
  editedItem.value = Object.assign({}, item);
  isEditMode.value = false;
  readOnly.value = true;
  showForm.value = true;
};

const editItem = (item) => {
  // Find the index of the item in the actual array
  editedIndex.value = allUserData.value.findIndex(data => data.id === item.id);
  // Copy the item data to the editedItem
  editedItem.value = Object.assign({}, item);
  // Clear password field for security (will only be set if user types a new one)
  editedItem.value.password = ''; 
  isEditMode.value = true;
  readOnly.value = false;
  showForm.value = true;
};

const saveItem = () => {
  // Basic validation (can be expanded)
  if (!editedItem.value.namaLengkap || !editedItem.value.namaUser || !editedItem.value.tipeUser) {
    snackbar.value = { show: true, message: 'Nama Lengkap, Nama User, dan Tipe User wajib diisi!', color: 'error', timeout: 3000 };
    return;
  }

  // Remove password from the final object for display purposes, 
  // as it should be securely handled in a real backend API.
  const { password, ...itemData } = editedItem.value;

  if (isEditMode.value) {
    // Edit existing item
    if (editedIndex.value > -1) {
      Object.assign(allUserData.value[editedIndex.value], itemData);
      snackbar.value = { show: true, message: 'Data pengguna berhasil diperbarui!', color: 'success', timeout: 3000 };
    }
  } else {
    // Add new item: find the highest current ID and add 1
    const maxId = allUserData.value.length > 0 ? Math.max(...allUserData.value.map(item => item.id)) : 0;
    itemData.id = maxId + 1;
    allUserData.value.push(itemData);
    snackbar.value = { show: true, message: 'Pengguna baru berhasil ditambahkan!', color: 'success', timeout: 3000 };
  }
  
  cancelForm();
};

const deleteItem = (item) => {
  itemToDelete.value = item;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  itemToDelete.value = null;
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    // Find the index of the item to delete
    const index = allUserData.value.findIndex(data => data.id === itemToDelete.value.id);
    if (index > -1) {
      // Remove the item
      allUserData.value.splice(index, 1);
      
      // Re-index the remaining items to keep the 'id' column sequential visually
      allUserData.value = allUserData.value.map((item, i) => ({
        ...item,
        id: i + 1
      }));
      
      snackbar.value = { show: true, message: 'Data pengguna berhasil dihapus!', color: 'warning', timeout: 3000 };
    }
  }
  closeDeleteDialog();
};

const cancelForm = () => {
  showForm.value = false;
  resetForm();
  editedIndex.value = -1;
};
</script>

<style scoped>
/* Custom Table Styling for better visual separation */
.custom-table :deep(table) {
  border-collapse: collapse;
}

.custom-table :deep(th) {
  background-color: #f5f5f5 !important;
  font-weight: bold;
  font-size: 0.875rem; /* text-sm */
}

.custom-table :deep(td) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>
