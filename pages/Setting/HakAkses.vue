<template>
  <div class="hak-akses-page pa-6">
    <v-breadcrumbs :items="breadcrumbs" class="pl-0 mb-4">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-card v-if="viewMode === 'add' || viewMode === 'editName'" class="pa-6 rounded-xl elevation-4">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold mb-4">
        <v-icon :icon="viewMode === 'add' ? 'mdi-plus' : 'mdi-pencil'" class="mr-2 text-primary" size="28"></v-icon>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text class="px-0">
        <v-row>
          <v-col cols="12">
            <v-label class="font-weight-bold text-medium-emphasis">Nama Tipe User</v-label>
            <v-text-field
              v-model="editedItem.namaTipeUser"
              placeholder="Masukkan Nama Tipe User"
              variant="outlined"
              density="comfortable"
              class="mt-1"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-0 mt-4">
        <v-btn
          color="grey-darken-1"
          variant="flat"
          rounded="lg"
          class="text-capitalize mr-2"
          @click="cancelForm"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          class="text-capitalize"
          @click="saveItem"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>

    <EditHakAkses
      v-else-if="viewMode === 'editAccess'"
      :item="editedItem"
      @save="updateItemAccess"
      @cancel="cancelForm"
    />

    <v-card v-else-if="viewMode === 'view'" class="pa-6 rounded-xl elevation-4">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold mb-4">
        <v-icon icon="mdi-eye-outline" class="mr-2 text-info" size="28"></v-icon>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text class="px-0">
        <v-row>
          <v-col cols="12">
            <v-label class="font-weight-bold text-medium-emphasis">Nama Tipe User</v-label>
            <v-text-field
              v-model="editedItem.namaTipeUser"
              variant="outlined"
              density="comfortable"
              class="mt-1"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card-title class="text-subtitle-1 font-weight-bold pa-0 mb-4">Hak Akses Menu</v-card-title>
            <v-table density="comfortable" class="elevation-1 rounded-xl">
              <thead>
                <tr>
                  <th class="text-left text-uppercase font-weight-bold text-grey-darken-1">No</th>
                  <th class="text-left text-uppercase font-weight-bold text-grey-darken-1">Menu</th>
                  <th class="text-center text-uppercase font-weight-bold text-grey-darken-1">Akses</th>
                  <th class="text-center text-uppercase font-weight-bold text-grey-darken-1">Lihat</th>
                  <th class="text-center text-uppercase font-weight-bold text-grey-darken-1">Tambah</th>
                  <th class="text-center text-uppercase font-weight-bold text-grey-darken-1">Edit</th>
                  <th class="text-center text-uppercase font-weight-bold text-grey-darken-1">Hapus</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(menu, index) in editedItem.hakAksesMenu" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ menu.name }}</td>
                  <td class="text-center">
                    <v-icon :color="menu.canAccess ? 'green' : 'grey-lighten-2'">{{ menu.canAccess ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon :color="menu.canView ? 'green' : 'grey-lighten-2'">{{ menu.canView ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon :color="menu.canAdd ? 'green' : 'grey-lighten-2'">{{ menu.canAdd ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon :color="menu.canEdit ? 'green' : 'grey-lighten-2'">{{ menu.canEdit ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon :color="menu.canDelete ? 'green' : 'grey-lighten-2'">{{ menu.canDelete ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-0 mt-4">
        <v-btn
          color="grey-darken-1"
          variant="flat"
          rounded="lg"
          class="text-capitalize"
          @click="cancelForm"
        >
          Tutup
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-else>
      <v-card class="d-flex flex-column flex-sm-row justify-space-between align-center pa-6 mb-6 rounded-xl bg-blue-lighten-5 elevation-2">
        <v-card-title class="d-flex align-center text-h5 font-weight-bold pa-0 text-blue-darken-3">
          <v-icon icon="mdi-shield-lock-outline" class="mr-2" size="40"></v-icon>
          <span>Hak Akses</span>
        </v-card-title>
        <div class="d-flex mt-4 mt-sm-0">
          <v-btn
            color="success"
            prepend-icon="mdi-plus"
            rounded="lg"
            class="text-capitalize mr-2"
            variant="flat"
            @click="showAddForm"
          >
            Tambah Baru
          </v-btn>
          <v-btn
            color="info"
            prepend-icon="mdi-format-list-numbered"
            rounded="lg"
            class="text-capitalize"
            variant="flat"
            @click="toggleReorderMode"
          >
            {{ reorderMode ? 'Selesai' : 'Atur Urutan' }}
          </v-btn>
        </div>
      </v-card>

      <v-card class="pa-6 rounded-xl elevation-2">
        <v-card-text class="pa-0">
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between mb-4">
            <div class="d-flex align-center mb-4 mb-sm-0">
              <span class="mr-2 text-subtitle-1 text-medium-emphasis">Show</span>
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 50]"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 80px;"
                rounded="lg"
                class="mr-2"
              ></v-select>
              <span class="text-subtitle-1 text-medium-emphasis">entries</span>
            </div>
            <div class="d-flex align-center">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                clearable
              ></v-text-field>
            </div>
          </div>

          <v-data-table
            :headers="headers"
            :items="allHakAksesData"
            :search="search"
            :items-per-page="itemsPerPage"
            v-model:page="page"
            class="elevation-0 custom-table"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex justify-center">
                <v-btn icon size="small" variant="text" class="mr-1" @click="viewItem(item)">
                  <v-icon color="blue-darken-1">mdi-eye-outline</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" class="mr-1" @click="editItem(item)">
                  <v-icon color="orange-darken-1">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" class="mr-1" @click="deleteItem(item)">
                  <v-icon color="red-darken-1">mdi-delete-outline</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" @click="editAccess(item)">
                  <v-icon color="green-darken-1">mdi-lock-check-outline</v-icon>
                </v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <v-alert :value="true" color="grey-lighten-3" icon="mdi-information">
                Tidak ada data yang tersedia.
              </v-alert>
            </template>
            
            <template v-slot:item.id="{ item }">
              <div class="text-center">{{ item.id }}</div>
            </template>
            
            <template v-slot:bottom>
              <v-row class="ma-2 pa-2">
                <v-col cols="12" sm="6" class="d-flex align-center justify-start text-caption text-grey-darken-1">
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

    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card class="pa-6 rounded-xl elevation-4">
        <v-card-title class="text-h6 font-weight-bold">Hapus Data</v-card-title>
        <v-card-text>Apakah Anda yakin ingin menghapus data ini?</v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="grey-darken-1" variant="text" rounded="lg" @click="closeDeleteDialog">Batal</v-btn>
          <v-btn color="red-darken-1" variant="text" rounded="lg" @click="confirmDelete">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="reorderMode" max-width="600px">
      <v-card class="pa-6 rounded-xl elevation-4">
        <v-card-title class="text-h6 font-weight-bold">Atur Urutan Menu</v-card-title>
        <v-card-text>
          <VueDraggableNext
            v-model="draggableMenus"
            item-key="name"
            tag="v-list"
            class="pa-0"
            handle=".handle"
            :animation="200"
          >
            <template #item="{ element }">
              <v-list-item class="rounded-lg elevation-1 my-2" :title="element.name">
                <template #prepend>
                  <v-icon icon="mdi-drag-vertical" class="handle"></v-icon>
                </template>
              </v-list-item>
            </template>
          </VueDraggableNext>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="grey-darken-1" variant="text" rounded="lg" @click="cancelReorder">Batal</v-btn>
          <v-btn color="primary" variant="text" rounded="lg" @click="saveReorder">Simpan Urutan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { VueDraggableNext } from 'vue-draggable-next'; 
import EditHakAkses from '@/components/HakAkses/EditHakAkses.vue';
import { useNavItemsStore } from '@/stores/navItems';

definePageMeta({
  middleware: ['auth']
})

interface HakAksesMenu {
  name: string;
  canAccess: boolean;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface NavItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

interface HakAksesData {
  id: number;
  namaTipeUser: string;
  hakAksesMenu: HakAksesMenu[];
}

interface BackendPermissionItem {
    id: number;
    create: boolean;
    read: boolean;
    update: boolean;
    disable: boolean;
    delete: boolean;
    active: boolean;
    page_name: string;
    pageID: number;
}

interface SessionData {
    roles: string[];
    groups: string[];
}

// State for views
const viewMode = ref<'table' | 'add' | 'editName' | 'editAccess' | 'view'>('table');
const reorderMode = ref(false);

const allHakAksesData = useLocalStorage<HakAksesData[]>('allHakAksesData', []);
const navItemsStore = useNavItemsStore();

const draggableMenus = ref<NavItem[]>([]);

// Data table headers
const headers = ref([
  { title: 'No', key: 'id' as const },
  { title: 'Nama Tipe User', key: 'namaTipeUser' as const, sortable: true },
  { title: 'Aksi', align: 'center' as const, key: 'actions' as const, sortable: false },
]);

// Breadcrumbs
const breadcrumbs = computed(() => {
  const baseCrumbs = [
    { title: 'Dashboard', disabled: false, href: '/dashboard' },
    { title: 'Setting', disabled: false, href: '/setting' },
    { title: 'Hak Akses', disabled: false, href: '/setting/hakakses' },
  ];
  if (viewMode.value === 'add') {
    return [...baseCrumbs, { title: 'Tambah Hak Akses', disabled: true, href: '/setting/tambahhakakses' }];
  } else if (viewMode.value === 'editName') {
    return [...baseCrumbs, { title: 'Edit Nama Tipe User', disabled: true, href: '/setting/editnamahakakses' }];
  } else if (viewMode.value === 'editAccess') {
    return [...baseCrumbs, { title: 'Edit Hak Akses', disabled: true, href: '/setting/edithakakses' }];
  } else if (viewMode.value === 'view') {
    return [...baseCrumbs, { title: 'Detail Hak Akses', disabled: true, href: '/setting/viewhakakses' }];
  }
  return baseCrumbs;
});

// Table and pagination state
const itemsPerPage = ref(10);
const search = ref('');
const page = ref(1);

const editedIndex = ref(-1);
const editedItem = ref<HakAksesData>({
  id: 0,
  namaTipeUser: '',
  hakAksesMenu: [],
});

// --- Menu management logic ---
// This is your list of all possible menus with a path and icon
const defaultMenuItems = () => ([
  { name: 'Dashboard', canAccess: false, canView: false, canAdd: false, canEdit: false, canDelete: false, path: '/dashboard', icon: 'mdi-view-dashboard' },
  { name: 'Setting', canAccess: false, canView: false, canAdd: false, canEdit: false, canDelete: false, path: '/setting', icon: 'mdi-cog' },
  { name: 'Setting / Hak Akses', canAccess: false, canView: false, canAdd: false, canEdit: false, canDelete: false, path: '/setting/hakakses', icon: 'mdi-shield-lock-outline' },
  // ... and so on for all your pages
]);

// Computed properties
const pageCount = computed(() => {
  return Math.ceil(allHakAksesData.value.length / itemsPerPage.value);
});

const showingEntriesText = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(page.value * itemsPerPage.value, allHakAksesData.value.length);
  const total = allHakAksesData.value.length;
  return `Showing ${start} to ${end} of ${total} entries`;
});

const formTitle = computed(() => {
  if (viewMode.value === 'editName') return 'Edit Nama Tipe User';
  if (viewMode.value === 'editAccess') return 'Edit Hak Akses';
  if (viewMode.value === 'view') return 'Detail Hak Akses';
  return 'Tambah Hak Akses';
});

// Delete dialog state
const showDeleteDialog = ref(false);

// Functions to reorder data and sync
const toggleReorderMode = () => {
  reorderMode.value = !reorderMode.value;
  if (reorderMode.value) {
    draggableMenus.value = navItemsStore.navItems.map(item => ({ ...item }));
  }
};

const saveReorder = () => {
  navItemsStore.updateNavItems(draggableMenus.value);
  reorderMode.value = false;
  reindexData();
};

const cancelReorder = () => {
  reorderMode.value = false;
};

// Re-indexes IDs to be sequential
const reindexData = () => {
  allHakAksesData.value.forEach((item, index) => {
    item.id = index + 1;
  });
};

// Functions for actions
const showAddForm = () => {
  resetForm();
  viewMode.value = 'add';
};

const viewItem = (item: HakAksesData) => {
  editedItem.value = { ...item };
  viewMode.value = 'view';
};

const editItem = (item: HakAksesData) => {
  editedIndex.value = allHakAksesData.value.findIndex(d => d.id === item.id);
  editedItem.value = { ...item };
  viewMode.value = 'editName';
};

const editAccess = (item: HakAksesData) => {
  editedIndex.value = allHakAksesData.value.findIndex(d => d.id === item.id);
  const baseMenuItems = defaultMenuItems();
  const existingAccess = item.hakAksesMenu;

  const mergedMenuItems = baseMenuItems.map(defaultMenu => {
    const existingMenu = existingAccess.find(exist => exist.name === defaultMenu.name);
    return existingMenu ? { ...defaultMenu, ...existingMenu } : defaultMenu;
  });

  editedItem.value = {
    ...item,
    hakAksesMenu: mergedMenuItems
  };
  viewMode.value = 'editAccess';
};

const deleteItem = (item: HakAksesData) => {
  editedIndex.value = allHakAksesData.value.findIndex(d => d.id === item.id);
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  editedIndex.value = -1;
};

const confirmDelete = () => {
  if (editedIndex.value > -1) {
    allHakAksesData.value.splice(editedIndex.value, 1);
    reindexData();
  }
  closeDeleteDialog();
};

const cancelForm = () => {
  viewMode.value = 'table';
  resetForm();
};

const updateItemAccess = (updatedItem: HakAksesData) => {
  if (editedIndex.value > -1) {
    Object.assign(allHakAksesData.value[editedIndex.value], updatedItem);
  }
  cancelForm();
};

const resetForm = () => {
  editedItem.value = {
    id: 0,
    namaTipeUser: '',
    hakAksesMenu: navItemsStore.navItems.map(navItem => ({
      name: navItem.name,
      canAccess: false,
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
    })),
  };
};

const saveItem = () => {
  if (editedIndex.value > -1) {
    // Edit item
    Object.assign(allHakAksesData.value[editedIndex.value], editedItem.value);
  } else {
    // Add item with a new ID
    editedItem.value.id = allHakAksesData.value.length + 1;
    allHakAksesData.value.push(editedItem.value);
    reindexData(); // Re-index to ensure sequential IDs
  }
  cancelForm();
};

// Handle initial data load and ID re-indexing
onMounted(() => {
  reindexData();
});
</script>

<style scoped>
.hak-akses-page {
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

.handle {
  cursor: grab;
}
</style>