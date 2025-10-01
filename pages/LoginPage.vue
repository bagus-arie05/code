<!-- // Pages/LoginPage.vue -->

<template>
  <v-container fluid fill-height class="login-background">
    
    <!-- Navigation Bar -->
    <v-app-bar class="navbar" flat>
      <v-toolbar-title class="brand-logo">
        <v-icon class="mr-2" color="white">mdi-hospital-building</v-icon>
        <span class="font-weight-bold text-blue-darken-3">ANTREAN</span> <span class="font-weight-bold" >RSSA</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Navigation with Dropdown Menus -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            class="nav-link"
            v-bind="props"
          >
            Tentang
            <v-icon right small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        
        <v-list class="nav-dropdown">
          <v-list-item class="dropdown-item">
            <v-icon class="mr-3">mdi-hospital-building</v-icon>
            <v-list-item-title>Profil Rumah Sakit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            class="nav-link"
            v-bind="props"
          >
            Kontak
            <v-icon right small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        
        <v-list class="nav-dropdown">
          <v-list-item class="dropdown-item">
            <v-icon class="mr-3">mdi-phone</v-icon>
            <v-list-item-title>Hubungi Kami</v-list-item-title>
          </v-list-item>
          <v-list-item class="dropdown-item">
            <v-icon class="mr-3">mdi-map-marker</v-icon>
            <v-list-item-title>Alamat & Lokasi</v-list-item-title>
          </v-list-item>
          <v-list-item class="dropdown-item">
            <v-icon class="mr-3">mdi-email</v-icon>
            <v-list-item-title>Email</v-list-item-title>
          </v-list-item>
          <v-list-item class="dropdown-item">
            <v-icon class="mr-3">mdi-help-circle</v-icon>
            <v-list-item-title>Bantuan</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-btn icon color="white" class="ml-4">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Floating Medical Icons Background -->
    <div class="floating-medical-icon icon-1">
      <v-icon size="144">mdi-heart-pulse</v-icon>
    </div>
    <div class="floating-medical-icon icon-2">
      <v-icon size="108">mdi-medical-bag</v-icon>
    </div>
    <div class="floating-medical-icon icon-3">
      <v-icon size="126">mdi-stethoscope</v-icon>
    </div>
    <div class="floating-medical-icon icon-4">
      <v-icon size="120">mdi-hospital-box</v-icon>
    </div>
    <div class="floating-medical-icon icon-5">
      <v-icon size="96">mdi-pill</v-icon>
    </div>
    <div class="floating-medical-icon icon-6">
      <v-icon size="114">mdi-bandage</v-icon>
    </div>

    <v-row class="fill-height align-center justify-center">
      <!-- Left Content -->
      <v-col cols="12" md="6" class="text-section">
        <div class="hero-content">
          <div class="logo-section mb-6">
            <img
              src="/Rumah_Sakit_Umum_Daerah_Dr._Saiful_Anwar.webp"
              alt="Logo Rumah Sakit"
              class="mt-3 hospital-logo"
            />
            <h1 class="hero-title">Sistem Terbaik</h1>
            <h1 class="hero-title">Untuk Pelayanan</h1>
            <h1 class="hero-title">Kesehatan</h1>
          </div>
          
          <p class="hero-description">
            Tingkatkan efisiensi layanan rumah sakit dengan sistem antrean RSSA yang canggih dan intuitif. 
            Dirancang dengan kesederhanaan, keamanan, dan kecepatan, memastikan perjalanan 
            Anda ke platform kami semudah mungkin. Mari kita buat inovasi menjadi sederhana!
          </p>
        </div>
      </v-col>

      <!-- Right Login Card -->
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-card class="login-card white-card rounded-xl pa-8" max-width="450" width="100%">
          
          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="welcome-title-dark">SELAMAT DATANG KEMBALI</h2>
            <p class="login-instruction-dark">MASUK UNTUK MELANJUTKAN</p>
          </div>

          <!-- Logo Section -->
          <div class="d-flex flex-column align-center text-center mb-6">
            <span class="text-h5 font-weight-bold app-title-dark text-blue-darken-3">Antrean RSSA</span>
            <img
              src="/Rumah_Sakit_Umum_Daerah_Dr._Saiful_Anwar.webp"
              alt="Logo Rumah Sakit"
              class="mt-3 hospital-logo"
            />
          </div>

          <!-- Alert Messages -->
          <v-alert v-if="errorMessage" type="error" class="mb-4" dismissible @click:close="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>

          <v-alert v-if="successMessage" type="success" class="mb-4">
            {{ successMessage }}
          </v-alert>

          <!-- SSO Info -->
          <div class="text-center mb-6">
            <p class="sso-text-dark">Login menggunakan Single Sign-On</p>
          </div>

          <!-- Keycloak Login Button -->
          <v-btn
            @click="handleLogin"
            class="login-btn"
            block
            rounded="lg"
            size="large"
            :loading="isLoading"
            :disabled="isLoading"
          >
            <v-icon left>mdi-shield-key</v-icon>
            <span class="font-weight-bold">
              {{ isLoading ? 'Connecting to Keycloak...' : 'Login dengan Keycloak' }}
            </span>
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>

          <!-- Registration Section -->
          <v-divider class="my-6 custom-divider-dark"></v-divider>
          
          <div class="text-center">
            <v-btn
              @click="showRegistrationDialog = true"
              class="register-btn-dark"
              variant="outlined"
              block
              rounded="lg"
              size="large"
            >
              <v-icon left>mdi-account-plus</v-icon>
              <span class="font-weight-bold">Daftar Akun Baru</span>
            </v-btn>

            <div class="text-center mt-4">
              <span class="help-text-dark">
                Belum memiliki akun?
              </span>
              <br>
              <v-btn
                @click="showAdminContact = true"
                variant="text"
                color="#0053AD"
                size="small"
                class="contact-link-dark mt-1"
              >
                Hubungi Administrator
              </v-btn>
            </div>
          </div>

          <!-- Password Help -->
          <div class="text-center mt-4">
            <span class="help-link-dark">Masalah dengan kata sandi Anda?</span>
          </div>

        </v-card>
      </v-col>
    </v-row>

    <!-- Registration Information Dialog -->
    <v-dialog v-model="showRegistrationDialog" max-width="500">
      <v-card class="white-dialog rounded-xl">
        <v-card-title class="text-h5 text-grey-darken-3 text-center pa-6 bg-grey-lighten-4">
          <v-icon left color="#0053AD">mdi-account-plus</v-icon>
          Pendaftaran Akun Baru
        </v-card-title>
       
        <v-card-text class="text-grey-darken-2 pa-6">
          <div class="text-center mb-4">
            <v-icon size="64" color="#0053AD" class="mb-4">mdi-information</v-icon>
          </div>
         
          <p class="text-body-1 mb-4">
            Untuk mendaftar akun baru pada sistem Antrean RSSA, silakan ikuti langkah berikut:
          </p>
         
          <v-list class="transparent">
            <v-list-item class="text-grey-darken-2 px-0">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-numeric-1-circle</v-icon>
              </template>
              <v-list-item-title class="text-grey-darken-2">
                Hubungi Administrator IT Rumah Sakit
              </v-list-item-title>
            </v-list-item>
           
            <v-list-item class="text-grey-darken-2 px-0">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-numeric-2-circle</v-icon>
              </template>
              <v-list-item-title class="text-grey-darken-2">
                Siapkan dokumen identitas dan surat penugasan
              </v-list-item-title>
            </v-list-item>
           
            <v-list-item class="text-grey-darken-2 px-0">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-numeric-3-circle</v-icon>
              </template>
              <v-list-item-title class="text-grey-darken-2">
                Tunggu proses verifikasi dan aktivasi akun
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
       
        <v-card-actions class="pa-6 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn
            @click="showRegistrationDialog = false"
            color="grey"
            variant="outlined"
            rounded
          >
            Tutup
          </v-btn>
          <v-btn
            @click="showRegistrationDialog = false; showAdminContact = true"
            color="#0053AD"
            rounded
          >
            <v-icon left>mdi-phone</v-icon>
            Hubungi Admin
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Admin Contact Dialog -->
    <v-dialog v-model="showAdminContact" max-width="500">
      <v-card class="white-dialog rounded-xl">
        <v-card-title class="text-h5 text-grey-darken-3 text-center pa-6 bg-grey-lighten-4">
          <v-icon left color="#0053AD">mdi-account-tie</v-icon>
          Kontak Administrator
        </v-card-title>
       
        <v-card-text class="text-grey-darken-2 pa-6">
          <div class="text-center mb-4">
            <v-icon size="64" color="#0053AD" class="mb-4">mdi-phone-settings</v-icon>
          </div>
         
          <v-list class="transparent">
            <v-list-item class="text-grey-darken-2 px-0 mb-2">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-office-building</v-icon>
              </template>
              <div>
                <v-list-item-title class="text-grey-darken-2 font-weight-bold">
                  IT Support RSSA
                </v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">
                  Bagian Teknologi Informasi
                </v-list-item-subtitle>
              </div>
            </v-list-item>
           
            <v-list-item class="text-grey-darken-2 px-0 mb-2">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-phone</v-icon>
              </template>
              <div>
                <v-list-item-title class="text-grey-darken-2">
                  (0341) 343343 ext. 1234
                </v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">
                  Telepon Internal
                </v-list-item-subtitle>
              </div>
            </v-list-item>
           
            <v-list-item class="text-grey-darken-2 px-0 mb-2">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-email</v-icon>
              </template>
              <div>
                <v-list-item-title class="text-grey-darken-2">
                  it-support@rssa.malang.go.id
                </v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">
                  Email Resmi
                </v-list-item-subtitle>
              </div>
            </v-list-item>
           
            <v-list-item class="text-grey-darken-2 px-0">
              <template v-slot:prepend>
                <v-icon color="#0053AD">mdi-clock</v-icon>
              </template>
              <div>
                <v-list-item-title class="text-grey-darken-2">
                  Senin - Jumat: 07:00 - 15:00
                </v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">
                  Jam Operasional
                </v-list-item-subtitle>
              </div>
            </v-list-item>
          </v-list>
         
          <v-alert
            type="info"
            variant="tonal"
            class="mt-4"
            color="blue"
          >
            <div class="text-grey-darken-2">
              <strong>Catatan:</strong> Pendaftaran akun memerlukan verifikasi dokumen dan dapat memakan waktu 1-2 hari kerja.
            </div>
          </v-alert>
        </v-card-text>
       
        <v-card-actions class="pa-6 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn
            @click="showAdminContact = false"
            color="grey"
            variant="outlined"
            rounded
          >
            Tutup
          </v-btn>
          <v-btn
            @click="copyContactInfo"
            color="#0053AD"
            rounded
          >
            <v-icon left>mdi-content-copy</v-icon>
            Salin Info
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import type { LoginResponse } from '~/types/auth'

// Use guest middleware to redirect if already authenticated
definePageMeta({
  layout: 'empty',
  middleware:['auth','guest']
})

// Reactive state
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const showRegistrationDialog = ref<boolean>(false)
const showAdminContact = ref<boolean>(false)

// Check URL parameters for errors
const route = useRoute()
onMounted(() => {
  if (route.query.error) {
    errorMessage.value = decodeURIComponent(route.query.error as string)
  }
})

// Custom login handler
const handleLogin = async (): Promise<void> => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    console.log('Starting login process...')
   
    const response = await $fetch<LoginResponse>('/api/auth/keycloak-login', {
      method: 'POST'
    })

    if (response?.success && response?.data?.authUrl) {
      console.log('Redirecting to Keycloak...')
      successMessage.value = 'Redirecting to Keycloak...'
     
      setTimeout(() => {
        window.location.href = response.data!.authUrl
      }, 500)
    } else {
      throw new Error('Failed to get authorization URL')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = `Login failed: ${error.message || 'Please try again.'}`
  } finally {
    isLoading.value = false
  }
}

// Copy contact information to clipboard
const copyContactInfo = async (): Promise<void> => {
  const contactInfo = `
IT Support RSSA
Telepon: (0341) 343343 ext. 1234
Email: it-support@rssa.malang.go.id
Jam Operasional: Senin - Jumat, 08:00 - 16:00
  `.trim()
 
  try {
    await navigator.clipboard.writeText(contactInfo)
    successMessage.value = 'Informasi kontak berhasil disalin!'
    showAdminContact.value = false
   
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to copy contact info:', error)
  }
}
</script>

<style scoped>
/* Main Background */
.login-background {
  background: linear-gradient(135deg, #f1b464 0%, #faa22e 25%, #e49458 50%, #e46f30 75%, #e26450 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Navigation Bar */
.navbar {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-logo {
  color: white;
  font-size: 1.2rem;
}

.nav-link {
  color: white !important;
  text-transform: none;
  font-weight: 500;
}

/* Floating Medical Icons */
.floating-medical-icon {
  position: absolute;
  animation: dvdBounce 20s linear infinite;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  z-index: 1;
  width: fit-content;
  height: fit-content;
}

.floating-medical-icon:hover {
  opacity: 1;
}

.floating-medical-icon .v-icon {
  color: rgba(255, 255, 255, 0.15) !important;
}

.icon-1 {
  top: 0%;
  left: 0%;
  animation-delay: 0s;
  animation-duration: 25s;
  animation-name: dvdBounce1;
}

.icon-1 .v-icon {
  color: rgba(6, 37, 83, 0.15) !important;
}

.icon-2 {
  top: 0%;
  right: 0%;
  animation-delay: 0s;
  animation-duration: 30s;
  animation-name: dvdBounce2;
}

.icon-2 .v-icon {
  color: rgba(15, 180, 70, 0.12) !important;
}

.icon-3 {
  bottom: 0%;
  left: 0%;
  animation-delay: 0s;
  animation-duration: 22s;
  animation-name: dvdBounce3;
}

.icon-3 .v-icon {
  color: rgba(23, 178, 206, 0.18) !important;
}

.icon-4 {
  top: 50%;
  left: 0%;
  animation-delay: 0s;
  animation-duration: 28s;
  animation-name: dvdBounce4;
}

.icon-4 .v-icon {
  color: rgba(223, 8, 8, 0.14) !important;
}

.icon-5 {
  bottom: 0%;
  right: 0%;
  animation-delay: 0s;
  animation-duration: 26s;
  animation-name: dvdBounce5;
}

.icon-5 .v-icon {
  color: rgba(148, 15, 236, 0.16) !important;
}

.icon-6 {
  top: 25%;
  left: 0%;
  animation-delay: 0s;
  animation-duration: 24s;
  animation-name: dvdBounce6;
}

.icon-6 .v-icon {
  color: rgba(87, 48, 5, 0.13) !important;
}

/* DVD Bounce Animation 1 - Top Left to Bottom Right */
@keyframes dvdBounce1 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(80vw, 70vh); }
  50% { transform: translate(20vw, 10vh); }
  75% { transform: translate(70vw, 80vh); }
  100% { transform: translate(0, 0); }
}

/* DVD Bounce Animation 2 - Top Right to Bottom Left */
@keyframes dvdBounce2 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-75vw, 60vh); }
  50% { transform: translate(-30vw, 20vh); }
  75% { transform: translate(-85vw, 75vh); }
  100% { transform: translate(0, 0); }
}

/* DVD Bounce Animation 3 - Bottom Left to Top Right */
@keyframes dvdBounce3 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(70vw, -60vh); }
  50% { transform: translate(40vw, -80vh); }
  75% { transform: translate(90vw, -30vh); }
  100% { transform: translate(0, 0); }
}

/* DVD Bounce Animation 4 - Middle Left across screen */
@keyframes dvdBounce4 {
  0% { transform: translate(0, 0); }
  16.6% { transform: translate(60vw, -30vh); }
  33.3% { transform: translate(90vw, 20vh); }
  50% { transform: translate(50vw, 40vh); }
  66.6% { transform: translate(10vw, -20vh); }
  83.3% { transform: translate(80vw, -40vh); }
  100% { transform: translate(0, 0); }
}

/* DVD Bounce Animation 5 - Bottom Right to Top Left */
@keyframes dvdBounce5 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-60vw, -70vh); }
  50% { transform: translate(-90vw, -20vh); }
  75% { transform: translate(-40vw, -80vh); }
  100% { transform: translate(0, 0); }
}

/* DVD Bounce Animation 6 - Complex zigzag pattern */
@keyframes dvdBounce6 {
  0% { transform: translate(0, 0); }
  14.3% { transform: translate(50vw, 30vh); }
  28.6% { transform: translate(85vw, -20vh); }
  42.9% { transform: translate(30vw, 60vh); }
  57.1% { transform: translate(70vw, 10vh); }
  71.4% { transform: translate(15vw, 70vh); }
  85.7% { transform: translate(80vw, 40vh); }
  100% { transform: translate(0, 0); }
}

/* Hero Section */
.text-section {
  padding-left: 4rem;
  z-index: 2;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  color: white;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Login Card - White Background */
.login-card {
  z-index: 3;
  max-width: 450px;
  margin: 2rem;
}

.white-card {
  background: white !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.15),
    0 8px 25px rgba(0, 0, 0, 0.1);
}

/* White Dialog Styles */
.white-dialog {
  background: white !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

/* Card Header - Dark Text */
.welcome-title-dark {
  color: #37474F;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
}

.login-instruction-dark {
  color: #546E7A;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
}

/* App Title - Dark */
.app-title-dark {
  color: #0053AD;
  text-shadow: none;
}

.hospital-logo {
  height: 64px;
  width: auto;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.sso-text-dark {
  color: #546E7A;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Buttons */
.login-btn {
  background: linear-gradient(135deg, #0053AD 0%, #0663C7 50%, #0671E0 100%) !important;
  color: white !important;
  border: none;
  box-shadow: 
    0 8px 25px rgba(0, 83, 173, 0.3),
    0 4px 12px rgba(0, 83, 173, 0.2);
  transition: all 0.3s ease;
  text-transform: none;
  font-size: 1rem;
  height: 56px;
}

.login-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #004A9B 0%, #0558B0 50%, #0661CA 100%) !important;
  box-shadow: 
    0 12px 30px rgba(0, 83, 173, 0.4),
    0 6px 15px rgba(0, 83, 173, 0.3);
}

.register-btn-dark {
  color: #0053AD !important;
  border: 2px solid #0053AD !important;
  background: transparent !important;
  transition: all 0.3s ease;
  text-transform: none;
  height: 48px;
}

.register-btn-dark:hover {
  background: rgba(0, 83, 173, 0.05) !important;
  border-color: #0663C7 !important;
  transform: translateY(-1px);
}

/* Custom Divider - Dark */
.custom-divider-dark {
  border-color: rgba(0, 0, 0, 0.12) !important;
  opacity: 1 !important;
}

/* Help Text and Links - Dark */
.help-text-dark {
  color: #546E7A;
  font-size: 0.9rem;
}

.contact-link-dark {
  color: #0053AD !important;
  text-decoration: underline;
  text-transform: none;
  font-size: 0.9rem;
}

.help-link-dark {
  color: #78909C;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

.help-link-dark:hover {
  color: #0053AD;
}

/* Transparent Background */
.transparent {
  background: transparent !important;
}

/* Navigation Dropdown Styles */
.nav-dropdown {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  min-width: 220px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dropdown-item {
  color: #FF9B1B;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
  padding: 8px 12px;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #FF9B1B 0%, #FF8F00 100%);
  color: white;
  transform: translateX(4px);
}

.dropdown-item .v-icon {
  transition: all 0.3s ease;
}

.dropdown-item:hover .v-icon {
  transform: scale(1.1);
}

.nav-link {
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 960px) {
  .text-section {
    padding-left: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .login-card {
    margin: 1rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .text-section {
    padding-left: 1rem;
  }
}
</style>