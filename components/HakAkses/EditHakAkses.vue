<template>
  <v-card class="pa-4 rounded-lg elevation-2">
    <v-card-title class="text-h5 font-weight-bold mb-4">
      Edit Hak Akses Menu | {{ localItem.namaTipeUser }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-0 mb-4">Hak Akses Menu</v-card-title>
          <v-table density="compact" class="elevation-1 rounded-lg">
            <thead>
              <tr>
                <th class="text-left">No</th>
                <th class="text-left">Menu</th>
                <th class="text-center">Akses</th>
                <th class="text-center">Lihat</th>
                <th class="text-center">Tambah</th>
                <th class="text-center">Edit</th>
                <th class="text-center">Hapus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(menu, index) in localItem.hakAksesMenu" :key="menu.name">
                <td>{{ index + 1 }}</td>
                <td>{{ menu.name }}</td>
                <td class="text-center">
                  <v-checkbox v-model="menu.canAccess" hide-details></v-checkbox>
                </td>
                <td class="text-center">
                  <v-checkbox v-model="menu.canView" hide-details></v-checkbox>
                </td>
                <td class="text-center">
                  <v-checkbox v-model="menu.canAdd" hide-details></v-checkbox>
                </td>
                <td class="text-center">
                  <v-checkbox v-model="menu.canEdit" hide-details></v-checkbox>
                </td>
                <td class="text-center">
                  <v-checkbox v-model="menu.canDelete" hide-details></v-checkbox>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="d-flex justify-end pa-4">
      <v-btn
        color="grey-darken-1"
        variant="flat"
        class="text-capitalize rounded-lg mr-2"
        @click="$emit('cancel')"
      >
        Batal
      </v-btn>
      <v-btn
        color="orange-darken-2"
        variant="flat"
        class="text-capitalize rounded-lg"
        @click="$emit('save', localItem)"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Define types for better readability and safety
interface HakAksesMenu {
  name: string;
  canAccess: boolean;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface HakAksesData {
  id: number;
  namaTipeUser: string;
  hakAksesMenu: HakAksesMenu[];
}

// Define props with type validation
const props = defineProps({
  item: {
    type: Object as () => HakAksesData,
    required: true,
    // Add custom validator for more robust checks
    validator: (value: HakAksesData) => {
      return 'namaTipeUser' in value && 'hakAksesMenu' in value;
    },
  },
});

// Define emits for clarity
const emits = defineEmits(['save', 'cancel']);

// Use a local copy to avoid mutating the prop directly
const localItem = ref<HakAksesData>(JSON.parse(JSON.stringify(props.item)));

// Watch the prop for changes and update the local copy
watch(() => props.item, (newItem) => {
  localItem.value = JSON.parse(JSON.stringify(newItem));
});
</script>

<style scoped>
.v-table :deep(th) {
  font-weight: bold !important;
  background-color: #f9fafb !important;
}

.v-table :deep(td) {
  vertical-align: middle;
}

.v-checkbox :deep(.v-selection-control__input) {
  color: #2196F3 !important;
}
</style>