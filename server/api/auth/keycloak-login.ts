// server/api/auth/keycloak-login.ts
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  console.log('🔐 Keycloak Login Handler Called')
  console.log('📍 Method:', getMethod(event))
  
  try {
    const config = useRuntimeConfig()
    
    // Debug: Log runtime config (without secrets)
    console.log('🔧 Runtime Config Check:')
    console.log('  - Has keycloakIssuer:', !!config.keycloakIssuer)
    console.log('  - Has keycloakClientId:', !!config.keycloakClientId)
    console.log('  - Has keycloakSecret:', !!config.keycloakClientSecret)
    console.log('  - Issuer value:', config.keycloakIssuer)
    
    // Validate required configuration
    if (!config.keycloakIssuer) {
      throw new Error('KEYCLOAK_ISSUER is not configured')
    }
    if (!config.keycloakClientId) {
      throw new Error('KEYCLOAK_CLIENT_ID is not configured')
    }
    
    // Generate state parameter for security
    const state = randomBytes(32).toString('hex')
    console.log('🎲 Generated state:', state.substring(0, 8) + '...')
    
    // Store state in session cookie
    setCookie(event, 'oauth_state', state, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })
    
    // Build Keycloak authorization URL
    const redirectUri = `${config.public.authUrl}/api/auth/keycloak-callback`
    const authUrl = new URL(`${config.keycloakIssuer}/protocol/openid-connect/auth`)
    
    authUrl.searchParams.set('client_id', config.keycloakClientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid profile email')
    authUrl.searchParams.set('state', state)
    
    console.log('🏗️ Auth URL built:', authUrl.toString())
    
    return {
      success: true,
      data: {
        authUrl: authUrl.toString()
      }
    }
    
  } catch (error: any) {
    console.error('❌ Login Error:', error.message)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to generate authorization URL: ${error.message}`
    })
  }
})