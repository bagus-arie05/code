<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom right"
    origin="top right"
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar size="40">
          <v-img 
            :src="user?.picture || 'https://i.pravatar.cc/300?img=68'" 
            :alt="`${user?.name || 'User'} Profile`"
          ></v-img>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="rounded-lg elevation-4 pa-4" width="300">
      <div class="d-flex align-center pb-2">
        <v-avatar size="48">
          <v-img 
            :src="user?.picture || 'https://i.pravatar.cc/300?img=68'" 
            :alt="`${user?.name || 'User'} Profile`"
          ></v-img>
        </v-avatar>
        <div class="ml-4">
          <div class="text-subtitle-1 font-weight-bold">
            {{ user?.name || user?.preferred_username || 'User' }}
          </div>
          <div class="text-caption text-grey-darken-1">
            {{ user?.email || 'No email' }}
          </div>
          <div class="text-caption text-grey-darken-2">
            ID: {{ user?.id?.substring(0, 8) }}...
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>

      <v-list dense>
        <v-list-item link class="rounded-lg" @click="handleAction('account')">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Pengaturan Akun</v-list-item-title>
        </v-list-item>

        <v-list-item link class="rounded-lg" @click="handleAction('darkMode')">
          <template v-slot:prepend>
            <v-icon>mdi-weather-night</v-icon>
          </template>
          <v-list-item-title>Mode Gelap</v-list-item-title>
          <template v-slot:append>
            <v-switch
              v-model="darkMode"
              hide-details
              density="compact"
              color="primary"
            ></v-switch>
          </template>
        </v-list-item>

        <v-list-item link class="rounded-lg" @click="handleAction('profile')">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Profil Saya</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item 
          link 
          class="rounded-lg text-red" 
          @click="signOut"
          :disabled="isLoggingOut"
        >
          <template v-slot:prepend>
            <v-icon color="red">mdi-logout</v-icon>
          </template>
          <v-list-item-title>
            {{ isLoggingOut ? 'Logging out...' : 'Keluar' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const menu = ref(false);
const darkMode = ref(false);
const isLoggingOut = ref(false);
const emit = defineEmits(['logout']);

/**
 * Handles the logout action - delegates to parent
 */
const signOut = async () => {
  if (isLoggingOut.value) return;
  
  isLoggingOut.value = true;
  menu.value = false;
  
  try {
    console.log('🚪 ProfilePopup signOut called...')
    emit('logout');
  } finally {
    isLoggingOut.value = false;
  }
};

const handleAction = (action) => {
  console.log('Action triggered:', action);
  
  switch(action) {
    case 'account':
      // Navigate to account settings
      navigateTo('/settings/account')
      break;
    case 'profile':
      // Navigate to profile page
      navigateTo('/profile')
      break;
    case 'darkMode':
      // Dark mode toggle is handled by v-model
      break;
    default:
      console.log('Unknown action:', action);
  }
  
  // Close menu for navigation actions
  if (action !== 'darkMode') {
    menu.value = false;
  }
};
</script>

<style scoped>
.text-red {
  color: rgb(244, 67, 54) !important;
}
</style>