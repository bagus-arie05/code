<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p v-if="user" class="text-subtitle-1 text-grey-darken-1 mt-1">
          Selamat Datang, {{ user.name || user.preferred_username }}!
        </p>
      </div>
      <div class="d-flex align-center">
        <v-chip color="green-lighten-1" class="mr-2 pa-3 font-weight-bold">
          <v-icon start icon="mdi-calendar"></v-icon>
          {{ currentDate }}
        </v-chip>
      </div>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 rounded-xl elevation-6" color="blue-lighten-1" theme="dark">
          <div class="d-flex align-center">
            <v-icon size="64" class="mr-4">mdi-account-group</v-icon>
            <div>
              <div class="text-h4 font-weight-black">2635</div>
              <div class="text-subtitle-1">Total Visitors</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 rounded-xl elevation-6" color="cyan-lighten-1" theme="dark">
          <div class="d-flex align-center">
            <v-icon size="64" class="mr-4">mdi-account-multiple-plus</v-icon>
            <div>
              <div class="text-h4 font-weight-black">759</div>
              <div class="text-subtitle-1">Offline Registrants</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 rounded-xl elevation-6" color="green-lighten-1" theme="dark">
          <div class="d-flex align-center">
            <v-icon size="64" class="mr-4">mdi-account-multiple-plus-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-black">1876</div>
              <div class="text-subtitle-1">Online Registrants</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 rounded-xl elevation-6" color="orange-lighten-1" theme="dark">
          <div class="d-flex align-center">
            <v-icon size="64" class="mr-4">mdi-ticket</v-icon>
            <div>
              <div class="text-h4 font-weight-black">248</div>
              <div class="text-subtitle-1">Total Tickets Printed</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl elevation-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Grafik Jumlah Antrean</span>
            <v-btn-toggle v-model="queueTimePeriod" mandatory divided variant="outlined" color="primary" class="text-caption">
              <v-btn size="small" value="day">Hari</v-btn>
              <v-btn size="small" value="week">Minggu</v-btn>
              <v-btn size="small" value="month">Bulan</v-btn>
              <v-btn size="small" value="year">Tahun</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <Bar
              :data="queueChartData"
              :options="queueChartOptions"
              style="height: 300px"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl elevation-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Monthly Visitor Data</span>
            <div>
              <v-chip
                :color="activeYear === '2024' ? 'green-lighten-1' : 'grey-lighten-2'"
                class="mr-2 text-caption font-weight-bold cursor-pointer"
                @click="changeYear('2024')"
              >
                2024
              </v-chip>
              <v-chip
                :color="activeYear === '2025' ? 'green-lighten-1' : 'grey-lighten-2'"
                class="text-caption font-weight-bold cursor-pointer"
                @click="changeYear('2025')"
              >
                2025
              </v-chip>
            </div>
          </v-card-title>
          <v-card-text>
            <Bar
              :data="barData"
              :options="barOptions"
              style="height: 300px"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl elevation-6">
          <v-card-title class="text-h6 font-weight-bold">Realtime Ticket Queue</v-card-title>
          <v-card-text>
            <Line
              ref="realtimeChart"
              :data="initialLineData"
              :options="lineOptions"
              style="height: 300px"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl elevation-6">
          <v-card-title class="text-h6 font-weight-bold">Registrant Breakdown</v-card-title>
          <v-card-text>
            <Pie
              :data="pieData"
              :options="pieOptions"
              style="height: 300px"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay v-model="isLoading" contained class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <p class="mt-4">Loading dashboard...</p>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { Bar, Pie, Line } from 'vue-chartjs';
import dayjs from 'dayjs';

// Tambahkan plugin Dayjs
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

definePageMeta({
  middleware:['auth']
})

// Register necessary Chart.js elements
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement);

// Use the auth composable
const { user, isLoading, checkAuth, logout } = useAuth()
const isLoggingOut = ref(false)

// Dashboard data
const currentDate = ref('');
const activeYear = ref('2025');
const queueTimePeriod = ref('month');

// --- MOCK DATA DINAMIS ANTREEAN (Tetap) ---
const mockQueueData = ref([
  // ... (data tetap sama)
  { date: '2025-09-22', count: 120 },
  { date: '2025-09-23', count: 150 },
  { date: '2025-09-24', count: 135 },
  { date: '2025-09-25', count: 160 },
  { date: '2025-09-26', count: 145 },
  { date: '2025-09-27', count: 170 },
  { date: '2025-09-28', count: 180 },
  { date: '2025-08-10', count: 300 },
  { date: '2025-08-20', count: 350 },
  { date: '2025-09-01', count: 400 },
  { date: '2025-09-15', count: 450 },
  { date: '2024-01-01', count: 1200 },
  { date: '2024-06-01', count: 1800 },
  { date: '2025-01-01', count: 2000 },
  { date: '2025-06-01', count: 2500 },
]);
// --- AKHIR MOCK DATA ANTREEAN ---

// --- REFACTORED REALTIME LOGIC ---
const realtimeChart = ref(null); // Ref untuk mengakses komponen Line
const maxDataPoints = 10;
let realtimeInterval = null;

// Initial data structure (non-reactive for update function)
const initialLineData = {
    labels: Array.from({ length: maxDataPoints }, (_, i) => 
        dayjs().subtract((maxDataPoints - 1 - i) * 5, 'second').format('HH:mm:ss')
    ),
    datasets: [
        {
            label: 'Tickets Processed',
            backgroundColor: '#FF5722',
            borderColor: '#FF5722',
            data: Array.from({ length: maxDataPoints }, () => Math.floor(Math.random() * 50) + 100),
            fill: false,
            tension: 0.1,
        },
    ],
};

const lineOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0 // Crucial: Disable animation for smooth realtime scrolling
    },
    plugins: {
        legend: { display: true },
        title: { display: false }
    },
    scales: {
        y: {
            beginAtZero: true,
            suggestedMax: 200,
            title: { display: true, text: 'Count' },
            grid: { display: true }
        },
        x: {
            title: { display: true, text: 'Time (HH:MM:SS)' },
            grid: { display: false }
        }
    }
});

// Function to simulate realtime data update using chart.update()
const updateRealtimeData = () => {
    const chart = realtimeChart.value?.chart;
    if (!chart) return;

    // 1. Get the current data arrays
    const dataArray = chart.data.datasets[0].data;
    const labelArray = chart.data.labels;

    // 2. Shift (remove) the oldest data point and label
    dataArray.shift();
    labelArray.shift();

    // 3. Generate new data point and time label
    const newDataPoint = Math.floor(Math.random() * 50) + 100;
    const newTimeLabel = dayjs().format('HH:mm:ss');

    // 4. Push the new data and label
    dataArray.push(newDataPoint);
    labelArray.push(newTimeLabel);

    // 5. CRUCIAL: Tell Chart.js to redraw itself without destroying the instance
    chart.update(); 
};
// --- END REFACTORED REALTIME LOGIC ---


// Example data for both years (Tetap)
const visitorData2024 = [150, 200, 350, 400, 380, 500, 550, 600, 520, 480, 650, 700];
const visitorData2025 = [200, 250, 400, 450, 420, 550, 600, 650, 570, 520, 700, 750];

// Check authentication and setup on page load
onMounted(async () => {
  try {
    const sessionUser = await checkAuth()
    if (sessionUser) {
      // Set current date
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      currentDate.value = new Date().toLocaleDateString('id-ID', options);

      // Start realtime data update interval
      // Pastikan chart instance sudah siap sebelum memulai interval
      realtimeInterval = setInterval(updateRealtimeData, 5000); 
    } else {
      await navigateTo('/LoginPage');
    }
  } catch (error) {
    console.error('Auth check error:', error);
    await navigateTo('/LoginPage');
  }
});

// Clear the interval when the component is unmounted
onUnmounted(() => {
  if (realtimeInterval) {
    clearInterval(realtimeInterval);
  }
});

// Updated logout handler (Tetap)
const handleLogout = async () => {
  if (isLoggingOut.value) return
  
  try {
    isLoggingOut.value = true
    console.log('🚪 Dashboard logout initiated...')
    await logout()
  } catch (error) {
    console.error('❌ Dashboard logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
};

// Function to change the active year (Tetap)
const changeYear = (year) => {
  activeYear.value = year;
};

// --- LOGIKA UTAMA UNTUK GRAFIK ANTREEAN (Tetap) ---
const processQueueData = (data, period) => {
  const grouped = {};
  const sortedDates = data.map(item => ({
    ...item,
    date: dayjs(item.date)
  })).sort((a, b) => a.date.valueOf() - b.date.valueOf());

  sortedDates.forEach(item => {
    let key;
    let label;

    if (period === 'day') {
      key = item.date.format('YYYY-MM-DD');
      label = item.date.format('DD/MM');
    } else if (period === 'week') {
      key = item.date.format('YYYY-WW');
      label = `Wk ${item.date.week()} ${item.date.year()}`;
    } else if (period === 'month') {
      key = item.date.format('YYYY-MM');
      label = item.date.format('MMM YYYY');
    } else if (period === 'year') {
      key = item.date.format('YYYY');
      label = item.date.format('YYYY');
    }

    if (!grouped[key]) {
      grouped[key] = { label: label, count: 0 };
    }
    grouped[key].count += item.count;
  });

  const finalLabels = Object.values(grouped).map(g => g.label);
  const finalCounts = Object.values(grouped).map(g => g.count);

  return {
    labels: finalLabels,
    datasets: [
      {
        label: `Total Antrean per ${period}`,
        backgroundColor: '#FFB300',
        data: finalCounts,
      },
    ],
  };
};

const queueChartData = computed(() => {
  if (!mockQueueData.value.length) return { labels: [], datasets: [] };
  return processQueueData(mockQueueData.value, queueTimePeriod.value);
});

const queueChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true }
    },
    x: {
      grid: { display: false }
    }
  }
});
// --- AKHIR LOGIKA GRAFIK ANTREEAN ---


// Computed property Monthly Visitor (Tetap)
const barData = computed(() => {
  const dataForYear = activeYear.value === '2024' ? visitorData2024 : visitorData2025;
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: `Total Visitors ${activeYear.value}`,
        backgroundColor: '#2196F3',
        data: dataForYear,
      },
    ],
  };
});

// Bar chart options (Tetap)
const barOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false }
    },
    x: {
      grid: { display: false }
    }
  }
});

// Pie chart data (Tetap)
const pieData = ref({
  labels: ['Offline Registrants', 'Online Registrants'],
  datasets: [
    {
      backgroundColor: ['#2196F3', '#4CAF50'],
      data: [759, 1876],
    },
  ],
});

// Pie chart options (Tetap)
const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        }
      }
    }
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>