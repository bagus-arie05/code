// middleware/guest.ts
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('👋 Guest middleware triggered for:', to.path);

  // Skip middleware on server-side during build/generation
  if (process.server && process.env.NODE_ENV === 'development') {
    console.log('⏭️ Skipping guest check on server-side during development');
    return;
  }

  const isAuthRedirect = to.query.authenticated === 'true';
  const isLogoutSuccess = to.query.logout === 'success';

  // If this is a logout success, allow access to login page
  if (isLogoutSuccess) {
    console.log('✅ Logout success detected, allowing access to login page');
    return;
  }

  // If this is a redirect from a successful login, we need to wait
  if (isAuthRedirect) {
    console.log('⏳ Client-side is processing a new login session, waiting for session to be established...');
    // We navigate to a clean URL to remove the query parameter from the user's view
    return navigateTo({ path: to.path, query: {} }, { replace: true });
  }
  
  try {
    console.log('🔍 Checking if user is already authenticated...');
    
    // The $fetch will automatically send the new user_session cookie
    const session = await $fetch<{ user: any } | null>('/api/auth/session').catch(() => null);

    if (session && session.user) {
      console.log('✅ User already authenticated, redirecting to dashboard');
      return navigateTo('/dashboard');
    } else {
      console.log('ℹ️ No session found, staying on login page');
      return;
    }
  } catch (error) {
    console.log('ℹ️ Auth check failed (expected for login), staying on login page');
    return;
  }
});