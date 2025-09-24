<template>
  <div class="screen-edit">
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" @click="goBack" class="mr-2"></v-btn>
      <h2>Edit Screen</h2>
    </div>

    <!-- Screen Selection Cards -->
    <div class="screen-cards mb-6">
      <v-row>
        <v-col cols="12" md="4" v-for="screen in screens" :key="screen.id">
          <v-card
            :class="['screen-card', { active: selectedScreen?.id === screen.id }]"
            @click="selectScreen(screen)"
            elevation="2"
          >
            <v-card-title class="text-center">
              {{ screen.nama }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Selected Screen Display -->
    <div v-if="selectedScreen" class="mb-4">
      <v-chip color="primary" size="large">
        Selected: {{ selectedScreen.nama }}
      </v-chip>
    </div>

    <!-- Clinic Selection Table -->
    <TabelLayanan
      v-if="selectedScreen"
      :headers="computedHeaders"
      :items="klinikItems"
      :selectedItems="selectedKlinik"
      @update:selectedItems="updateSelectedKlinik"
    />

    <!-- Action Buttons -->
    <div class="d-flex justify-end gap-4 mt-6">
      <v-btn variant="outlined" @click="cancel">
        Cancel
      </v-btn>
      <v-btn color="warning" @click="submit" :disabled="!selectedScreen">
        Submit
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TabelLayanan from '~/components/TabelLayanan.vue';

// Get route parameter
const route = useRoute();
const screenId = route.params.id;

// Data
const selectedScreen = ref(null);
const selectedKlinik = ref([]);

const screens = ref([
  { id: 1, nama: 'Screen 1' },
  { id: 2, nama: 'Screen 2' },
  { id: 3, nama: 'Screen 3' }
]);

const klinikItems = ref([
  { id: 1, no: 1, nama_klinik: 'ANAK' },
  { id: 2, no: 2, nama_klinik: 'ANESTESI' },
  { id: 3, no: 3, nama_klinik: 'BEDAH' },
  { id: 4, no: 4, nama_klinik: 'GIGI DAN MULUT' },
  { id: 5, no: 5, nama_klinik: 'GERIATRI' },
  { id: 6, no: 6, nama_klinik: 'GIZI' },
  { id: 7, no: 7, nama_klinik: 'IPD' },
  { id: 8, no: 8, nama_klinik: 'JANTUNG' },
  { id: 9, no: 9, nama_klinik: 'JIWA' },
  { id: 10, no: 10, nama_klinik: 'KUL KEL' },
  { id: 11, no: 11, nama_klinik: 'KOMPLEMENTER' },
  { id: 12, no: 12, nama_klinik: 'MATA' },
  { id: 13, no: 13, nama_klinik: 'SARAF' },
  { id: 14, no: 14, nama_klinik: 'KANDUNGAN' },
  { id: 15, no: 15, nama_klinik: 'ONKOLOGI' },
  { id: 16, no: 16, nama_klinik: 'PARU' },
  { id: 17, no: 17, nama_klinik: 'RADIOTERAPI' },
  { id: 18, no: 18, nama_klinik: 'REHAB MEDIK' },
  { id: 19, no: 19, nama_klinik: 'THT' },
  { id: 20, no: 20, nama_klinik: 'MCU' },
  { id: 21, no: 21, nama_klinik: 'KEMOTERAPI' },
  { id: 22, no: 22, nama_klinik: 'R. TINDAKAN' },
  { id: 23, no: 23, nama_klinik: 'HOM' }
]);

// Computed headers based on selected screen
const computedHeaders = computed(() => {
  return [
    { title: 'No', key: 'no', sortable: false, width: '80px' },
    { title: 'Nama Klinik', key: 'nama_klinik', sortable: true },
    { title: 'Pilih', key: 'pilih', sortable: false, width: '100px' }
  ];
});

// Methods
const selectScreen = (screen) => {
  selectedScreen.value = screen;
  loadScreenData(screen.id);
};

const loadScreenData = (screenId) => {
  // Simulate loading existing selections for the screen
  switch(parseInt(screenId)) {
    case 1:
      selectedKlinik.value = [1, 2, 3, 4, 5, 6, 7, 8]; // ANAK, ANESTESI, etc.
      break;
    case 2:
      selectedKlinik.value = [9, 10, 11, 12, 13, 14, 15, 16]; // JIWA, KUL KEL, etc.
      break;
    case 3:
      selectedKlinik.value = [17, 18, 19, 20, 21, 22, 23]; // RADIOTERAPI, REHAB MEDIK, etc.
      break;
    default:
      selectedKlinik.value = [];
  }
};

const updateSelectedKlinik = (newSelection) => {
  selectedKlinik.value = newSelection;
};

const submit = () => {
  if (!selectedScreen.value) {
    alert('Please select a screen first');
    return;
  }

  // Simulate API call to save the configuration
  const data = {
    screenId: selectedScreen.value.id,
    selectedKlinik: selectedKlinik.value
  };

  console.log('Saving configuration:', data);
  alert('Configuration saved successfully!');
  goBack();
};

const cancel = () => {
  goBack();
};

const goBack = () => {
  navigateTo('/setting/screen');
};

// Lifecycle
onMounted(() => {
  // Auto-select screen based on route parameter
  if (screenId) {
    const screen = screens.value.find(s => s.id == screenId);
    if (screen) {
      selectScreen(screen);
    }
  }
});
</script>

<style scoped>
.screen-edit {
  padding: 20px;
}

.screen-cards {
  margin-bottom: 2rem;
}

.screen-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.screen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.screen-card.active {
  border-color: #1976d2;
  background-color: #d4d4d4;
}

.screen-card .v-card-title {
  font-weight: 600;
  padding: 20px;
}

.gap-4 {
  gap: 16px;
}
</style>