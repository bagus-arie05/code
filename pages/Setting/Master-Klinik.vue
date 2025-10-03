<template>
  <v-container>
    <v-card>
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <v-icon size="32" color="white">mdi-hospital-building</v-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Master Klinik</h1>
              <p class="page-subtitle">Rabu, 13 Agustus 2025 - Manajemen Klinik</p>
            </div>
          </div>
          <v-btn 
            color="white" 
            @click="openTambahDialog"
            elevation="0"
            class="add-btn"
          >
            <v-icon left size="20">mdi-plus-circle</v-icon>
            Tambah Klinik
          </v-btn>
        </div>
      </div>

      <!-- Table -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="klinikData"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.shift="{ item }">
            <v-chip size="small" color="primary" variant="flat">
              {{ item.shift }}
            </v-chip>
          </template>
          
          <template v-slot:item.totalQuota="{ item }">
            <span class="font-weight-bold">{{ item.totalQuota }}</span>
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
              @click="deleteKlinik(item)"
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
    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title class="dialog-header">
          <span class="dialog-title">{{ isEdit ? 'Edit Klinik' : 'Tambah Klinik' }}</span>
          <v-btn icon variant="text" @click="closeDialog" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="dialog-content">
          <v-form ref="formRef">
            <v-row>
              <!-- Kode -->
              <v-col cols="12" md="4">
                <v-text-field
                  label="Kode"
                  v-model="formData.kode"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Kode harus diisi']"
                  required
                  hide-details="auto"
                  placeholder="Masukkan kode klinik (2 huruf)"
                ></v-text-field>
                <small class="text-grey">Masukan Kode Klinik 2 Huruf</small>
              </v-col>

              <!-- Nama -->
              <v-col cols="12" md="4">
                <v-text-field
                  label="Nama"
                  v-model="formData.nama"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Nama harus diisi']"
                  required
                  hide-details="auto"
                  placeholder="Gigi dan Mulut"
                ></v-text-field>
              </v-col>

              <!-- Shift -->
              <v-col cols="12" md="4">
                <v-text-field
                  label="Jumlah Shift"
                  v-model.number="formData.shift"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Shift harus diisi', v => v > 0 || 'Shift minimal 1']"
                  required
                  hide-details="auto"
                  @update:model-value="updateShiftCount"
                ></v-text-field>
              </v-col>

              <!-- Auto Shift -->
              <v-col cols="12" md="4">
                <v-checkbox
                  label="Auto Shift"
                  v-model="formData.autoShift"
                  hide-details
                  color="primary"
                ></v-checkbox>
              </v-col>

              <!-- Jam Shift Section -->
              <v-col cols="12">
                <div class="shift-section">
                  <h4 class="shift-section-title">
                    <v-icon size="20" color="primary">mdi-clock-outline</v-icon>
                    Konfigurasi Shift & Kuota
                  </h4>
                  
                  <div v-for="(shift, index) in formData.jamShiftList" :key="index" class="shift-item">
                    <v-row align="center">
                      <v-col cols="12" md="2">
                        <div class="shift-label">
                          <v-icon size="16" left>mdi-numeric-{{ index + 1 }}-circle</v-icon>
                          Shift {{ index + 1 }}
                        </div>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Jam Mulai"
                          v-model="shift.dari"
                          type="time"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          prepend-inner-icon="mdi-clock-start"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Jam Selesai"
                          v-model="shift.sampai"
                          type="time"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          prepend-inner-icon="mdi-clock-end"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Kuota"
                          v-model.number="shift.kuota"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          prepend-inner-icon="mdi-account-multiple"
                          placeholder="0"
                          :rules="[v => v >= 0 || 'Kuota minimal 0']"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="1" class="d-flex justify-center">
                        <v-btn
                          v-if="formData.jamShiftList.length > 1"
                          icon
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeShift(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Total Kuota -->
                  <v-divider class="my-3"></v-divider>
                  <div class="total-kuota">
                    <v-icon color="success" size="20">mdi-sigma</v-icon>
                    <span class="total-label">Total Kuota:</span>
                    <v-chip color="success" variant="flat" size="large">
                      {{ calculateTotalQuota() }} Pasien
                    </v-chip>
                  </div>
                </div>
              </v-col>

              <!-- Jadwal Klinik -->
              <v-col cols="12">
                <div class="jadwal-section">
                  <label class="jadwal-title">
                    <v-icon size="20" color="primary">mdi-calendar-check</v-icon>
                    Jadwal Klinik
                  </label>
                  <v-data-table
                    :headers="jadwalHeaders"
                    :items="hariList"
                    :items-per-page="-1"
                    hide-default-footer
                    class="elevation-0 jadwal-table"
                  >
                    <template v-slot:item.pilih="{ item }">
                      <v-checkbox
                        v-model="formData.jadwalKlinik"
                        :value="item.hari"
                        hide-details
                        color="success"
                      ></v-checkbox>
                    </template>
                  </v-data-table>
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
  { title: 'Kode', value: 'kode', sortable: true },
  { title: 'Nama Klinik', value: 'nama', sortable: true },
  { title: 'Shift', value: 'shift', sortable: true },
  { title: 'Total Kuota', value: 'totalQuota', sortable: true },
  { title: 'Aksi', value: 'aksi', sortable: false },
]);

const klinikData = ref([
  { 
    id: 1, no: 1, kode: 'AN', nama: 'ANAK', shift: 1, totalQuota: 1000,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 1000 }] 
  },
  { 
    id: 2, no: 2, kode: 'AS', nama: 'ANESTESI', shift: 2, totalQuota: 1500,
    jamShiftList: [
      { dari: '07:00', sampai: '11:00', kuota: 1000 }, 
      { dari: '13:00', sampai: '16:00', kuota: 500 }
    ] 
  },
  { 
    id: 3, no: 3, kode: 'BD', nama: 'BEDAH', shift: 1, totalQuota: 800,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 800 }] 
  },
  { 
    id: 4, no: 4, kode: 'GR', nama: 'GERIATRI', shift: 1, totalQuota: 600,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 600 }] 
  },
  { 
    id: 5, no: 5, kode: 'GI', nama: 'GIGI DAN MULUT', shift: 3, totalQuota: 2100,
    jamShiftList: [
      { dari: '07:00', sampai: '11:00', kuota: 1000 }, 
      { dari: '13:00', sampai: '16:00', kuota: 700 }, 
      { dari: '18:00', sampai: '20:00', kuota: 400 }
    ] 
  },
  { 
    id: 6, no: 6, kode: 'GZ', nama: 'GIZI', shift: 1, totalQuota: 500,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 500 }] 
  },
  { 
    id: 7, no: 7, kode: 'HO', nama: 'HOM', shift: 1, totalQuota: 750,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 750 }] 
  },
  { 
    id: 8, no: 8, kode: 'IP', nama: 'IPD', shift: 1, totalQuota: 900,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 900 }] 
  },
  { 
    id: 9, no: 9, kode: 'JT', nama: 'JANTUNG', shift: 2, totalQuota: 1200,
    jamShiftList: [
      { dari: '07:00', sampai: '11:00', kuota: 800 }, 
      { dari: '13:00', sampai: '16:00', kuota: 400 }
    ] 
  },
  { 
    id: 10, no: 10, kode: 'JW', nama: 'JIWA', shift: 1, totalQuota: 700,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 700 }] 
  },
]);

const jadwalHeaders = ref([
  { title: '#', value: 'no', sortable: false },
  { title: 'Hari', value: 'hari', sortable: false },
  { title: 'Pilih', value: 'pilih', sortable: false },
]);

const hariList = ref([
  { no: 1, hari: 'Senin' },
  { no: 2, hari: 'Selasa' },
  { no: 3, hari: 'Rabu' },
  { no: 4, hari: 'Kamis' },
  { no: 5, hari: 'Jum\'at' },
]);

const formData = ref({
  id: null,
  kode: '',
  nama: '',
  shift: 1,
  jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 0 }],
  autoShift: false,
  jadwalKlinik: [],
});

const calculateTotalQuota = () => {
  return formData.value.jamShiftList.reduce((total, shift) => {
    return total + (parseInt(shift.kuota) || 0);
  }, 0);
};

const updateShiftCount = (newShiftCount) => {
  const currentCount = formData.value.jamShiftList.length;
  
  if (newShiftCount > currentCount) {
    // Tambah shift baru
    for (let i = currentCount; i < newShiftCount; i++) {
      let defaultDari = '07:00';
      let defaultSampai = '11:00';
      
      if (i === 1) {
        defaultDari = '13:00';
        defaultSampai = '16:00';
      } else if (i === 2) {
        defaultDari = '18:00';
        defaultSampai = '20:00';
      } else if (i > 2) {
        const prevShift = formData.value.jamShiftList[i - 1];
        const [prevHour] = prevShift.sampai.split(':');
        const nextHour = (parseInt(prevHour) + 1) % 24;
        defaultDari = `${String(nextHour).padStart(2, '0')}:00`;
        defaultSampai = `${String((nextHour + 4) % 24).padStart(2, '0')}:00`;
      }
      
      formData.value.jamShiftList.push({
        dari: defaultDari,
        sampai: defaultSampai,
        kuota: 0
      });
    }
  } else if (newShiftCount < currentCount && newShiftCount > 0) {
    formData.value.jamShiftList = formData.value.jamShiftList.slice(0, newShiftCount);
  }
};

const removeShift = (index) => {
  if (formData.value.jamShiftList.length > 1) {
    formData.value.jamShiftList.splice(index, 1);
    formData.value.shift = formData.value.jamShiftList.length;
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
    kode: item.kode,
    nama: item.nama,
    shift: item.shift,
    jamShiftList: item.jamShiftList ? JSON.parse(JSON.stringify(item.jamShiftList)) : [{ dari: '07:00', sampai: '11:00', kuota: 0 }],
    autoShift: item.autoShift || false,
    jadwalKlinik: item.jadwalKlinik || ['Senin', 'Rabu'],
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
    kode: '',
    nama: '',
    shift: 1,
    jamShiftList: [{ dari: '07:00', sampai: '11:00', kuota: 0 }],
    autoShift: false,
    jadwalKlinik: [],
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

  const totalQuota = calculateTotalQuota();

  if (isEdit.value) {
    const index = klinikData.value.findIndex(k => k.id === formData.value.id);
    if (index !== -1) {
      klinikData.value[index] = {
        ...klinikData.value[index],
        ...formData.value,
        totalQuota: totalQuota,
      };
    }
  } else {
    const newId = Math.max(...klinikData.value.map(k => k.id)) + 1;
    const newNo = klinikData.value.length + 1;
    klinikData.value.push({
      id: newId,
      no: newNo,
      ...formData.value,
      totalQuota: totalQuota,
    });
  }

  closeDialog();
};

const deleteKlinik = (item) => {
  if (confirm(`Hapus klinik ${item.nama}?`)) {
    const index = klinikData.value.findIndex(k => k.id === item.id);
    if (index !== -1) {
      klinikData.value.splice(index, 1);
      klinikData.value.forEach((k, idx) => {
        k.no = idx + 1;
      });
    }
  }
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
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
  color: #1976d2 !important;
}

.dialog-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
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

.shift-section {
  background: #f8f9fa;
  border: 2px solid #e3f2fd;
  border-radius: 12px;
  padding: 20px;
}

.shift-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e3f2fd;
}

.shift-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.shift-item:last-child {
  margin-bottom: 0;
}

.shift-label {
  font-weight: 600;
  color: #424242;
  font-size: 14px;
  text-align: center;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 10px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.total-kuota {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 2px solid #4caf50;
}

.total-label {
  font-weight: 600;
  color: #424242;
  font-size: 15px;
}

.jadwal-section {
  background: #f8f9fa;
  border: 2px solid #e3f2fd;
  border-radius: 12px;
  padding: 20px;
}

.jadwal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e3f2fd;
}

.jadwal-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
</style>