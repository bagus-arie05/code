// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    console.log('🚪 Logout handler called');

    // Get the current session to retrieve tokens
    const sessionCookie = getCookie(event, 'user_session');
    let idToken = null;

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        idToken = session.idToken;
        console.log('🔑 ID token found in session:', !!idToken);
      } catch (error) {
        console.warn('⚠️ Could not parse session cookie:', error);
      }
    } else {
      console.warn('⚠️ No session cookie found');
    }

    // Clear all auth-related cookies
    console.log('🧹 Clearing session cookies...');
    deleteCookie(event, 'user_session');
    deleteCookie(event, 'oauth_state');

    // Also clear with different path variations to be thorough
    deleteCookie(event, 'user_session', { path: '/' });
    deleteCookie(event, 'oauth_state', { path: '/' });

    console.log('✅ Session cleared successfully');

    // Construct the Keycloak logout URL with proper parameters
    const logoutUrl = new URL(`${config.keycloakIssuer}/protocol/openid-connect/logout`);
    
    // Add required parameters for proper Keycloak logout - REDIRECT TO LOGIN PAGE
    logoutUrl.searchParams.set('client_id', config.keycloakClientId);
    logoutUrl.searchParams.set('post_logout_redirect_uri', `${config.public.authUrl}/LoginPage?logout=success`);
    
    // If we have an ID token, add it for proper session termination
    if (idToken) {
      logoutUrl.searchParams.set('id_token_hint', idToken);
      console.log('🔑 Added id_token_hint to logout URL');
    } else {
      console.warn('⚠️ No ID token available for logout hint');
    }
    
    console.log('🔗 Keycloak logout URL constructed:', logoutUrl.toString());
    
    // Return the logout URL to the client for redirect
    // This approach gives better control to the client-side code
    return {
      success: true,
      logoutUrl: logoutUrl.toString(),
      message: 'Session cleared successfully'
    };

  } catch (error: any) {
    console.error('❌ Logout error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Even if there's an error, try to provide a basic logout URL - REDIRECT TO LOGIN PAGE
    const config = useRuntimeConfig();
    const fallbackLogoutUrl = `${config.keycloakIssuer}/protocol/openid-connect/logout?client_id=${config.keycloakClientId}&post_logout_redirect_uri=${encodeURIComponent(config.public.authUrl + '/LoginPage?logout=success')}`;
    
    return {
      success: false,
      logoutUrl: fallbackLogoutUrl,
      error: 'Logout encountered an error, but providing fallback logout URL',
      message: error.message
    };
  }
});