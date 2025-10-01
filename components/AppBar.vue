<template>
  <v-app-bar app color="#ff9248" dark>
    <v-app-bar-nav-icon @click="emit('toggle-rail')"></v-app-bar-nav-icon>
     <v-toolbar-title class="ml-2 font-weight-bold">
      <span class="text-blue-darken-2">Antrean</span> RSSA
    </v-toolbar-title>
    <v-spacer></v-spacer>
    
    <!-- Show loading state or user info -->
    <div v-if="isLoading" class="d-flex align-center">
      <v-progress-circular indeterminate size="20" class="mr-2"></v-progress-circular>
      <span class="mr-2">Loading...</span>
    </div>
    
    <template v-else-if="isAuthenticated && user">
      <ProfilePopup 
        :user="user" 
        @logout="handleLogout" 
      /><template>
  <v-app-bar app color="blue-grey-darken-3" dark flat>
    <v-app-bar-nav-icon @click="emit('toggle-rail')"></v-app-bar-nav-icon>
    <v-toolbar-title class="ml-2 font-weight-bold">
      <span class="text-orange-darken-2">Antrian</span> RSSA
    </v-toolbar-title>

    <v-spacer></v-spacer>
    
    <div v-if="isLoading" class="d-flex align-center">
      <v-progress-circular indeterminate color="orange-darken-2" size="20" class="mr-2"></v-progress-circular>
      <span class="text-caption">Loading...</span>
    </div>

    <template v-else-if="isAuthenticated && user">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="flat"
            rounded="xl"
            color="transparent"
            class="pa-2 text-capitalize"
          >
            <div class="d-flex align-center">
              <v-avatar color="orange-darken-2" size="36" class="mr-2">
                <span class="text-white font-weight-bold">{{ user.name?.charAt(0) || 'U' }}</span>
              </v-avatar>
              <span class="text-subtitle-1 font-weight-bold text-white">{{ user.name || 'User' }}</span>
              <v-icon right size="20" class="ml-1">mdi-chevron-down</v-icon>
            </div>
          </v-btn>
        </template>
        <ProfilePopup 
          :user="user" 
          @logout="handleLogout" 
        />
      </v-menu>
    </template>
    
    <template v-else>
      <v-btn @click="redirectToLogin" color="orange-darken-2" variant="flat" rounded="lg" class="text-capitalize">
        <v-icon left>mdi-login</v-icon>
        Login
      </v-btn>
    </template>
  </v-app-bar>
</template>
      <span class="mr-2">{{ user.name || user.preferred_username || user.email }}</span>
    </template>
    
    <template v-else>
      <v-btn @click="redirectToLogin" color="white" text>
        Login
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import ProfilePopup from './ProfilePopup.vue';

// Emit untuk parent component
const emit = defineEmits(['toggle-rail']);

// Use auth composable
const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuth()

// Handle logout - use the composable's logout method
const handleLogout = async () => {
  console.log("🚪 AppBar logout initiated...")
  try {
    await logout()
  } catch (error) {
    console.error("❌ AppBar logout error:", error)
  }
}

// Redirect to login if not authenticated
const redirectToLogin = () => {
  navigateTo('/LoginPage')
}

// Check authentication on mount
onMounted(async () => {
  await checkAuth()
})
</script>
