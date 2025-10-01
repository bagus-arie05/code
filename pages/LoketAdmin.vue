<template>
  <!-- Main Content -->
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-6 main-content-padding">
      <!-- Header Banner & Stats -->
      <v-card class="d-flex justify-space-between align-center pa-5 rounded-xl elevation-4 mb-6 header-banner">
        <div class="d-flex align-center">
          <v-icon size="40" class="mr-3 text-white">mdi-hospital-box-outline</v-icon>
          <span class="text-h4 font-weight-bold text-white">Loket Admin </span>
        </div>
        <div class="d-flex align-center text-white text-end flex-wrap justify-end">
          <span class="mr-4">Loket 24</span>
          <span class="mr-4">{{ currentDateLongFormatted }}</span>
          <span>{{ currentDateShortFormatted }} - Pelayanan</span>
        </div>
      </v-card>

      <!-- Status Cards Section -->
      <v-row class="mb-6">
        <!-- Panggil 1 Antrian Card -->
        <v-col cols="12" sm="6" md="3">
          <v-card 
            class="pa-4 rounded-xl elevation-2 text-center" 
            color="#4CAF50" 
            @click="handleStatusCardClick(1)"
          >
            <v-card-text class="text-white">
              <div class="text-h4 font-weight-bold">1</div>
              <div class="text-subtitle-1 mt-1">Panggil</div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Panggil 5 Antrian Card -->
        <v-col cols="12" sm="6" md="3">
          <v-card 
            class="pa-4 rounded-xl elevation-2 text-center" 
            color="#4CAF50" 
            @click="handleStatusCardClick(5)"
          >
            <v-card-text class="text-white">
              <div class="text-h4 font-weight-bold">5</div>
              <div class="text-subtitle-1 mt-1">Panggil</div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Panggil 10 Antrian Card -->
        <v-col cols="12" sm="6" md="3">
          <v-card 
            class="pa-4 rounded-xl elevation-2 text-center" 
            color="#4CAF50" 
            @click="handleStatusCardClick(10)"
          >
            <v-card-text class="text-white">
              <div class="text-h4 font-weight-bold">10</div>
              <div class="text-subtitle-1 mt-1">Panggil</div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Panggil 20 Antrian Card -->
        <v-col cols="12" sm="6" md="3">
          <v-card 
            class="pa-4 rounded-xl elevation-2 text-center" 
            color="#4CAF50" 
            @click="handleStatusCardClick(20)"
          >
            <v-card-text class="text-white">
              <div class="text-h4 font-weight-bold">20</div>
              <div class="text-subtitle-1 mt-1">Panggil</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Next Patient Card -->
      <v-card class="next-patient-card d-flex align-center justify-center pa-8 text-center rounded-xl elevation-6 mb-6">
        <div class="text-center">
          <div class="text-h4 text-white">NEXT PATIENT</div>
          <div class="text-h2 font-weight-bold text-white mt-2">UM1001</div>
          <v-btn
            size="large"
            color="#00A896"
            class="mt-4 text-white"
            @click="handleNextPatientClick"
          >
            <v-icon start>mdi-arrow-right-circle</v-icon>
            Panggil Pasien Selanjutnya
          </v-btn>
        </div>
      </v-card>

      <!-- Main Data Table -->
      <v-card class="mb-6 pa-6 rounded-xl elevation-2">
        <v-card-title class="d-flex justify-space-between align-center text-h5 font-weight-bold pa-0 mb-4">
          Data Pasien
          <div class="d-flex align-center">
            <span class="mr-2 text-caption">Show</span>
            <v-select
              v-model="itemsPerPage"
              :items="[10, 25, 50, 100]"
              density="compact"
              variant="solo"
              flat
              hide-details
              class="mx-2 select-items"
            ></v-select>
            <span class="mr-2 text-caption">entries</span>
            <v-text-field
              v-model="search"
              density="compact"
              variant="solo"
              flat
              hide-details
              append-inner-icon="mdi-magnify"
              label="Search"
              style="max-width: 200px"
            ></v-text-field>
          </div>
        </v-card-title>
        <v-data-table
          :headers="mainHeaders"
          :items="mainPatients"
          :search="search"
          :items-per-page="itemsPerPage"
          :row-class="getRowClass"
          class="custom-table"
        >
          <!-- Custom template for the 'aksi' column -->
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex ga-1">
              <!-- Show different buttons based on the item's status -->
              <template v-if="item.status === 'dipanggil'">
                 <v-btn size="small" color="primary" variant="flat" class="rounded-lg" @click="handleProsesClick(item)">
                  <v-icon start>mdi-cogs</v-icon>Proses
                </v-btn>
                <v-btn size="small" color="success" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-check-circle-outline</v-icon>Selesai
                </v-btn>
              </template>
              <template v-else-if="item.status === 'dalam_proses'">
                <v-btn size="small" color="success" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-check-circle-outline</v-icon>Selesai
                </v-btn>
                <v-btn size="small" color="warning" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-pause-circle-outline</v-icon>Tunda
                </v-btn>
                <v-btn size="small" color="error" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-close-circle-outline</v-icon>Batal
                </v-btn>
              </template>
              <template v-else>
                <v-btn size="small" color="primary" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-cogs</v-icon>Proses
                </v-btn>
                <v-btn size="small" color="success" variant="flat" class="rounded-lg">
                  <v-icon start>mdi-check-circle-outline</v-icon>Selesai
                </v-btn>
              </template>
            </div>
          </template>
          <!-- Custom template for the 'panggil' column -->
          <template v-slot:item.panggil="{ item }">
            <v-btn 
              size="small" 
              :color="item.status === 'dalam_proses' ? 'grey' : 'info'" 
              variant="flat" 
              class="rounded-lg" 
              @click="handlePanggilClick(item)"
              :disabled="item.status === 'dalam_proses'"
            >
              <v-icon start>mdi-phone</v-icon>Panggil
            </v-btn>
          </template>
          <!-- Custom template for the 'noAntrian' column -->
          <template v-slot:item.noAntrian="{ item }">
            <span :class="{'online-antrian': item.status === 'dipanggil'}">{{ item.noAntrian }}</span>
          </template>
        </v-data-table>
      </v-card>

      <!-- Late Patients Table -->
      <v-card class="mb-6 pa-6 rounded-xl elevation-2">
        <v-card-title class="d-flex justify-space-between align-center text-h5 font-weight-bold pa-0 mb-4">
          Info Pasien Lapor Terlambat
          <div class="d-flex align-center">
            <span class="mr-2 text-caption text-orange">KETERANGAN: PASIEN MASUK PADA TANGGAL</span>
            <span class="mr-2 text-caption">Show</span>
            <v-select
              v-model="lateItemsPerPage"
              :items="[10, 25, 50, 100]"
              density="compact"
              variant="solo"
              flat
              hide-details
              class="mx-2 select-items"
            ></v-select>
            <span class="mr-2 text-caption">entries</span>
            <v-text-field
              v-model="lateSearch"
              density="compact"
              variant="solo"
              flat
              hide-details
              append-inner-icon="mdi-magnify"
              label="Search"
              style="max-width: 200px"
            ></v-text-field>
          </div>
        </v-card-title>
        <v-data-table
          :headers="lateHeaders"
          :items="latePatients"
          :search="lateSearch"
          :items-per-page="lateItemsPerPage"
          class="custom-table"
        >
          <template v-slot:no-data>
            <div class="text-center pa-4">Tidak ada data yang tersedia</div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Clinic Entry Patients Table -->
      <v-card class="mb-6 pa-6 rounded-xl elevation-2">
        <v-card-title class="d-flex justify-space-between align-center text-h5 font-weight-bold pa-0 mb-4">
          Info Pasien Masuk Klinik
        </v-card-title>
        <v-data-table
          :headers="clinicHeaders"
          :items="clinicPatients"
          :search="clinicSearch"
          :items-per-page="clinicItemsPerPage"
          class="custom-table"
        >
          <template v-slot:no-data>
            <div class="text-center pa-4">Tidak ada data yang tersedia</div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Info Klinik Table -->
      <v-card class="pa-6 rounded-xl elevation-2">
        <v-card-title class="text-h5 font-weight-bold pa-0 mb-4">
          Info Klinik
        </v-card-title>
        <v-data-table
          :headers="infoKlinikHeaders"
          :items="infoKlinikData"
          class="custom-table"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:bottom>
            <v-card-text class="d-flex justify-end text-right">
              <span class="mr-4 font-weight-bold text-h6">Total:</span>
              <span class="mr-12 font-weight-bold text-h6 text-primary">{{ totalDapatDipanggil }}</span>
              <span class="font-weight-bold text-h6 text-primary">{{ totalShiftBelumBuka }}</span>
            </v-card-text>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

definePageMeta({
  middleware:['auth']
})

// Reactive data
const search = ref("");
const lateSearch = ref("");
const clinicSearch = ref("");
const itemsPerPage = ref(10);
const lateItemsPerPage = ref(10);
const clinicItemsPerPage = ref(10);
const currentDateLongFormatted = ref(""); 
const currentDateShortFormatted = ref(""); 

// Table headers
const mainHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Jam Panggil", value: "jamPanggil" },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Fast Track", value: "fastTrack" },
  { title: "Pembayaran", value: "pembayaran" },
  { title: "Panggil", align: 'center', value: "panggil", sortable: false },
  { title: "Aksi",  value: "aksi", sortable: false },
]);

const lateHeaders = ref([
  { title: "No", value: "no", sortable: false },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const clinicHeaders = ref([
  { title: "#", value: "no", sortable: false },
  { title: "Barcode", value: "barcode" },
  { title: "No Antrian", value: "noAntrian" },
  { title: "No RM", value: "noRM" },
  { title: "Shift", value: "shift" },
  { title: "Klinik", value: "klinik" },
  { title: "Fast Track", value: "fastTrack" },
  { title: "Pembayaran", value: "pembayaran" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const infoKlinikHeaders = ref([
  { title: "#", value: "no" },
  { title: "Klinik", value: "klinik" },
  { title: "Jumlah Shift", value: "jumlahShift" },
  { title: "Quota Per Shift", value: "quotaPerShift" },
  { title: "Status", value: "status" },
  { title: "Dapat Di Panggil", value: "dapatDiPanggil" },
  { title: "Shift Belum Buka", value: "shiftBelumBuka" },
]);

// Sample data with new 'originalAntrian' and 'status' properties
const mainPatients = ref([
  { no: 1, jamPanggil: "11:46", barcode: "250826100362", noAntrian: "UM1002 | Online - 250826100362", originalAntrian: "UM1002", shift: "Shift 1", klinik: "IPD", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "dipanggil" },
  { no: 2, jamPanggil: "06:47", barcode: "250826100140", noAntrian: "UM1003", originalAntrian: "UM1003", shift: "Shift 1", klinik: "IPD", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "" },
  { no: 3, jamPanggil: "06:47", barcode: "250826100143", noAntrian: "UM1004", originalAntrian: "UM1004", shift: "Shift 1", klinik: "IPD", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "" },
  { no: 4, jamPanggil: "06:47", barcode: "250826100500", noAntrian: "UM1005", originalAntrian: "UM1005", shift: "Shift 1", klinik: "MATA", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "" },
  { no: 5, jamPanggil: "06:47", barcode: "250826100525", noAntrian: "UM1006", originalAntrian: "UM1006", shift: "Shift 1", klinik: "ONKOLOGI", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "" },
  { no: 6, jamPanggil: "06:47", barcode: "250826100536", noAntrian: "UM1007", originalAntrian: "UM1007", shift: "Shift 1", klinik: "THT", fastTrack: "", pembayaran: "UMUM", panggil: "Panggil", status: "" },
]);

// Tambahkan lebih banyak data pasien untuk demonstrasi "Panggil 20"
for (let i = 7; i <= 25; i++) {
  mainPatients.value.push({
    no: i,
    jamPanggil: "07:00",
    barcode: `250826100${100 + i}`,
    noAntrian: `UM100${i}`,
    originalAntrian: `UM100${i}`,
    shift: "Shift 1",
    klinik: "UMUM",
    fastTrack: "",
    pembayaran: "UMUM",
    panggil: "Panggil",
    status: "",
  });
}

const latePatients = ref([]);
const clinicPatients = ref([]);
const infoKlinikData = ref([
  { no: 1, klinik: "ANESTESI", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 2, klinik: "GERIATRI", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 3, klinik: "GIGI DAN MULUT", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 4, klinik: "HOM", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 5, klinik: "IPD", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 6, klinik: "JANTUNG", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 7, klinik: "KANDUNGAN", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 8, klinik: "KOMPLEMENTER", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBukan: "-" },
  { no: 9, klinik: "KUL.KEL", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 10, klinik: "MATA", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 11, klinik: "ONKOLOGI", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 12, klinik: "PARU", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 13, klinik: "SARAF", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
  { no: 14, klinik: "THT", jumlahShift: "1 Shift", quotaPerShift: 1000, status: "Buka - Shift 1", dapatDiPanggil: "-", shiftBelumBuka: "-" },
]);

// Computed properties for totals
const totalDapatDipanggil = computed(() => {
  return infoKlinikData.value.reduce((total, item) => {
    return total + (item.dapatDiPanggil === "-" ? 0 : parseInt(item.dapatDiPanggil));
  }, 0);
});

const totalShiftBelumBuka = computed(() => {
  return infoKlinikData.value.reduce((total, item) => {
    return total + (item.shiftBelumBuka === "-" ? 0 : parseInt(item.shiftBelumBuka));
  }, 0);
});

// Methods
const getRowClass = (item) => {
  if (item.status === 'dipanggil') {
    return 'called-row';
  }
  return '';
};

const handleStatusCardClick = (count) => {
  console.log(`Memanggil ${count} antrean pasien.`);
  const updatedPatients = mainPatients.value.map((patient, index) => {
    const isCalled = index < count;
    return {
      ...patient,
      status: isCalled ? 'dipanggil' : '',
      noAntrian: isCalled ? `${patient.originalAntrian} | Online - ${patient.barcode}` : patient.originalAntrian
    };
  });
  mainPatients.value = updatedPatients;
};

const handleNextPatientClick = () => {
  console.log("Tombol Panggil Pasien Selanjutnya diklik! (Mengambil pasien pertama dari antrean)");
  const updatedPatients = mainPatients.value.map(patient => {
    return { ...patient, status: '', noAntrian: patient.originalAntrian };
  });
  mainPatients.value = updatedPatients;
};

const handlePanggilClick = (item) => {
  console.log(`Tombol Panggil untuk pasien: ${item.noAntrian} diklik!`);
  
  // Membuat salinan baru dari seluruh array untuk memicu reaktivitas
  const updatedPatients = mainPatients.value.map(p => {
    // Jika pasien cocok, buat salinan baru dengan status 'dipanggil' dan tambahkan "Online"
    if (p.no === item.no) {
      return {
        ...p,
        status: 'dipanggil',
        noAntrian: `${p.originalAntrian} | Online - ${p.barcode}`
      };
    }
    // Jika tidak, kembalikan objek pasien aslinya
    return p;
  });

  // Ganti seluruh array data dengan salinan yang baru.
  mainPatients.value = updatedPatients;
};

const handleProsesClick = (item) => {
  console.log(`Tombol Proses untuk pasien: ${item.noAntrian} diklik!`);
  
  const updatedPatients = mainPatients.value.map(p => {
    if (p.no === item.no) {
      return {
        ...p,
        status: 'dalam_proses'
      };
    }
    return p;
  });

  mainPatients.value = updatedPatients;
};

// Mengatur tanggal saat komponen dimuat
onMounted(() => {
  const today = new Date();
  const optionsLong = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateLongFormatted.value = today.toLocaleDateString('id-ID', optionsLong);
  
  const optionsShort = { year: 'numeric', month: 'long', day: 'numeric' };
  currentDateShortFormatted.value = today.toLocaleDateString('id-ID', optionsShort);
});
</script>

<style scoped>
/* Scoped styles for a cleaner look */
.main-content-padding {
  padding-left: 24px !important;
  padding-right: 24px !important;
}

/* Header Banner */
.header-banner {
  background: linear-gradient(90deg, #1565C0, #1976D2);
  color: white;
  min-height: 120px;
}

/* Next Patient Card */
.next-patient-card {
  background: linear-gradient(45deg, #00A896, #00796B);
  color: white;
}

/* Status Cards */
.v-card.text-center {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.v-card.text-center:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Table styling */
.custom-table :deep(thead th) {
  background-color: #E8EAF6; /* Light gray-blue header */
  font-weight: bold;
}

.custom-table :deep(tbody tr:nth-of-type(odd)) {
  background-color: #F5F5F5; /* Light gray for odd rows */
}

/* Highlighted row for "dipanggil" status */
.custom-table :deep(tbody tr.called-row) {
  background-color: #998479 !important; /* Light green background */
}

/* Field and Select styling */
.select-items .v-field--variant-solo,
.v-text-field .v-field--variant-solo {
  background-color: #ECEFF1;
}

.text-blue {
  color: #1976D2 !important;
}

.text-primary {
  color: #1976D2 !important;
}

.online-antrian {
  font-weight: bold;
  color: #1976D2;
}
</style>
