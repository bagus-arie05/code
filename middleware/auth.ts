// export default defineNuxtRouteMiddleware(async (to) => {
//   console.log('🛡️ Auth middleware triggered for:', to.path)

//   // Skip middleware on server-side during build/generation
//   if (process.server && process.env.NODE_ENV === 'development') {
//     console.log('⏭️ Skipping auth check on server-side during development')
//     return
//   }

//   // Allow the login page to handle its own checks
//   if (to.path === '/LoginPage') {
//     console.log('⏭️ Allowing access to LoginPage')
//     return
//   }

//   // This is the crucial change: check for the authentication signal
//   const isAuthRedirect = to.query.authenticated === 'true';

//   // If this is a redirect from a successful login, we need to let the route load
//   if (isAuthRedirect) {
//     console.log('⏳ Client-side is processing a new login session, allowing the route to load...');
//     // We navigate to a clean URL to remove the query parameter
//     return navigateTo({ path: to.path, query: {} }, { replace: true });
//   }

//   try {
//     console.log('🔍 Checking authentication status...')
    
//     const session = await $fetch<{ user: any } | null>('/api/auth/session').catch(() => null)

//     if (session && session.user) {
//       console.log('✅ User is authenticated:', session.user.name || session.user.email)
//       return
//     } else {
//       console.log('❌ No valid session found, redirecting to login')
//       return navigateTo('/LoginPage')
//     }
//   } catch (error) {
//     console.error('❌ Auth middleware error:', error)
//     console.log('🔄 Redirecting to login due to error')
//     return navigateTo('/LoginPage')
//   }
// })


import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import type { RouteLocationNormalized } from 'vue-router';

// Define the shape of the user object returned by your authentication API.
// This provides type safety for session.user.
interface User {
  name?: string | null;
  email: string;
  // Add other properties from your user object as needed.
}

// Define the shape of the full session object returned by the API.
interface Session {
  user: User;
}

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  console.log('🛡️ Auth middleware triggered for:', to.path);

  // Skip middleware on server-side during development build/generation
  if (process.server && process.env.NODE_ENV === 'development') {
    console.log('⏭️ Skipping auth check on server-side during development');
    return;
  }

  // Allow the login page to handle its own checks without redirection loops
  if (to.path === '/LoginPage') {
    console.log('⏭️ Allowing access to LoginPage');
    return;
  }

  // Check for the authentication signal from a successful login redirect
  const isAuthRedirect: boolean = to.query.authenticated === 'true';

  // If this is a redirect from a successful login, allow the route to load.
  // We navigate to a clean URL to remove the query parameter.
  if (isAuthRedirect) {
    console.log('⏳ Client-side is processing a new login session, allowing the route to load...');
    return navigateTo({ path: to.path, query: {} }, { replace: true });
  }

  try {
    console.log('🔍 Checking authentication status...');
    
    // Use the defined Session interface to type the fetch response
    const session: Session | null = await $fetch<Session>('/api/auth/session').catch(() => null);

    // Check if a valid session and user exist using optional chaining
    if (session?.user) {
      console.log('✅ User is authenticated:', session.user.name || session.user.email);
      return;
    } else {
      console.log('❌ No valid session found, redirecting to login');
      return navigateTo('/LoginPage');
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.log('🔄 Redirecting to login due to error');
    return navigateTo('/LoginPage');
  }
});


