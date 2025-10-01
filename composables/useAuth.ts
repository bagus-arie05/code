// composables/useAuth.ts - Enhanced version with better error handling
import type { User, SessionResponse, LoginResponse, LogoutResponse } from '~/types/auth'

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const clearError = () => {
    error.value = null
  }

  const checkAuth = async (): Promise<User | null> => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await $fetch<SessionResponse>('/api/auth/session')
      
      if (response.success === false && response.error) {
        error.value = response.error
        user.value = null
        return null
      }
      
      user.value = response.user
      return response.user
    } catch (fetchError: any) {
      console.error('Session check failed:', fetchError)
      error.value = 'Failed to check authentication status'
      user.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const login = async (): Promise<void> => {
    try {
      clearError()
      const response = await $fetch<LoginResponse>('/api/auth/keycloak-login', {
        method: 'POST'
      })

      if (response?.success && response?.data?.authUrl) {
        console.log('🔗 Redirecting to Keycloak login...')
        window.location.href = response.data.authUrl
      } else {
        const errorMsg = response?.error || 'Failed to get authorization URL'
        error.value = errorMsg
        throw new Error(errorMsg)
      }
    } catch (loginError: any) {
      console.error('❌ Login error:', loginError)
      error.value = loginError.message || 'Login failed'
      throw loginError
    }
  }

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true
      clearError()
      console.log('🚪 Starting logout process...')
      
      const response = await $fetch<LogoutResponse>('/api/auth/logout', {
        method: 'POST'
      })
      
      // Clear user immediately regardless of response
      user.value = null
      
      if (response?.success && response?.logoutUrl) {
        console.log('🔗 Redirecting to Keycloak logout...')
        window.location.href = response.logoutUrl
      } else {
        const warningMsg = response?.error || response?.message || 'No logout URL received'
        console.warn('⚠️', warningMsg)
        error.value = warningMsg
        await navigateTo('/LoginPage')
      }
    } catch (logoutError: any) {
      console.error('❌ Logout error:', logoutError)
      error.value = logoutError.message || 'Logout failed'
      user.value = null
      await navigateTo('/LoginPage')
    } finally {
      isLoading.value = false
    }
  }

  // Helper function to refresh user data
  const refreshUser = async (): Promise<boolean> => {
    const userData = await checkAuth()
    return !!userData
  }

  // Helper function to check if user has specific role
  const hasRole = (role: string): boolean => {
    if (!user.value) return false
    
    // Check in roles array
    if (user.value.roles?.includes(role)) return true
    
    // Check in realm_access.roles
    if (user.value.realm_access?.roles?.includes(role)) return true
    
    return false
  }

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    checkAuth,
    login,
    logout,
    refreshUser,
    clearError,
    
    // Utilities
    hasRole,
    hasAnyRole
  }
}