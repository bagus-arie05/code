<template>
  <v-container>
    <v-card>
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <v-icon size="32" color="white">mdi-view-dashboard</v-icon>
            </div>
            <div class="header-text">
              <h1 class="page-title">Master Loket</h1>
              <p class="page-subtitle">Rabu, 13 Agustus 2025 - Pelayanan</p>
            </div>
          </div>
          <v-btn 
            color="white" 
            @click="tambahLoket"
            elevation="0"
            class="add-btn"
          >
            <v-icon left size="20">mdi-plus-circle</v-icon>
            Tambah Loket
          </v-btn>
        </div>
      </div>
      <TabelData
        :headers="loketHeaders"
        :items="loketData"
        title="Master Loket"
      >
        <template #actions="{ item }">
          <v-btn
            small
            color="#ff9248"
            @click="editLoket(item)"
            class="mr-2"
            style="color: white"
          >
            Edit
          </v-btn>
          <v-btn 
            small 
            color="grey-lighten-4" 
            @click="deleteLoket(item)"
          >
            Delete
          </v-btn>
        </template>
      </TabelData>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import TabelData from "../../components/TabelData.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loketHeaders = ref([
  { title: "No", value: "no" },
  { title: "Nama Loket", value: "namaLoket" },
  { title: "Kuota", value: "kuota" },
  { title: "Pelayanan", value: "pelayanan" },
  { title: "Pembayaran", value: "pembayaran" },
  { title: "Keterangan", value: "keterangan" },
  { title: "Aksi", value: "aksi", sortable: false },
]);

const loketData = ref([
  {
    id: 1,
    no: 1,
    namaLoket: "Loket 1",
    kuota: 500,
    pelayanan: ["RADIOTERAPI", "REHAB MEDIK", "TINDAKAN"],
    pembayaran: "JKN",
    keterangan: "ONLINE",
  },
  {
    id: 2,
    no: 2,
    namaLoket: "Loket 2",
    kuota: 666,
    pelayanan: ["JIWA", "SARAF"],
    pembayaran: "JKN",
    keterangan: "ONLINE",
  },
  {
    id: 3,
    no: 3,
    namaLoket: "Loket 3",
    kuota: 666,
    pelayanan: ["ANESTESI", "JANTUNG"],
    pembayaran: "JKN",
    keterangan: "ONLINE",
  },
  {
    id: 4,
    no: 4,
    namaLoket: "Loket 4",
    kuota: 3676,
    pelayanan: ["KULIT KELAMIN", "PARU"],
    pembayaran: "JKN",
    keterangan: "ONLINE",
  },
]);

const editLoket = (item) => {
  router.push({ path: `/Setting/Edit-Loket/${item.id}` });
};

const deleteLoket = (item) => {
  const index = loketData.value.findIndex((loket) => loket.id === item.id);
  if (index !== -1) {
    loketData.value.splice(index, 1);
  }
};

const tambahLoket = () => {
  router.push({ path: "/Setting/Tambah-Loket" });
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
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
</style>