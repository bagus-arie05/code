// server/api/auth/keycloak-callback.ts - FIX APPLIED
export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig();
        const query = getQuery(event);

        console.log('🔄 === KEYCLOAK CALLBACK STARTED ===');
        console.log('📋 Query parameters:', query);

        const code = query.code as string;
        const state = query.state as string;
        const error = query.error as string;
        const storedState = getCookie(event, 'oauth_state');

        if (error) {
            console.error('❌ OAuth error from Keycloak:', error);
            const errorDescription = query.error_description as string;
            console.error('❌ Error description:', errorDescription);

            const errorMsg = encodeURIComponent(`Keycloak error: ${error} - ${errorDescription || 'Please try again'}`);
            return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
        }

        console.log('📝 Code received:', !!code);
        console.log('🎲 State from URL:', state);
        console.log('🎲 State from cookie:', storedState);
        console.log('🎲 State validation:', state === storedState);

        if (!state || state !== storedState) {
            console.error('❌ Invalid state parameter - possible CSRF attack');
            console.error('   Expected:', storedState);
            console.error('   Received:', state);

            const errorMsg = encodeURIComponent('Security validation failed. Please try logging in again.');
            return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
        }

        deleteCookie(event, 'oauth_state');

        if (!code) {
            console.error('❌ Authorization code not provided');
            const errorMsg = encodeURIComponent('No authorization code received from Keycloak.');
            return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
        }

        const tokenUrl = `${config.keycloakIssuer}/protocol/openid-connect/token`;
        const redirectUri = `${config.public.authUrl}/api/auth/keycloak-callback`;

        // ... (Token exchange logic remains the same) ...
        const tokenPayload = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: config.keycloakClientId,
            client_secret: config.keycloakClientSecret,
            code,
            redirect_uri: redirectUri,
        });

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenPayload,
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('❌ Token exchange failed:', errorText);
            const errorMsg = encodeURIComponent(`Token exchange failed: ${tokenResponse.status} - Please check Keycloak configuration`);
            return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
        }

        const tokens = await tokenResponse.json();
        
        // ... (Token decoding and sessionData creation remains the same) ...
        let idTokenPayload;
        try {
            idTokenPayload = JSON.parse(
                Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()
            );
        } catch (decodeError) {
            console.error('❌ Failed to decode ID token:', decodeError);
            const errorMsg = encodeURIComponent('Invalid ID token format');
            return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
        }
        
        const sessionData = {
            user: {
                id: idTokenPayload.sub,
                email: idTokenPayload.email,
                name: idTokenPayload.name || idTokenPayload.preferred_username,
                preferred_username: idTokenPayload.preferred_username,
                given_name: idTokenPayload.given_name,
                family_name: idTokenPayload.family_name,
            },
            accessToken: tokens.access_token,
            idToken: tokens.id_token,
            refreshToken: tokens.refresh_token,
            expiresAt: Date.now() + (tokens.expires_in * 1000),
            createdAt: Date.now(),
        };

        // ----------------------------------------------------
        // 👇 CRITICAL FIX FOR DEPLOYED HTTPS ENVIRONMENTS 👇
        // ----------------------------------------------------
        // Check if the request was originally HTTPS (via proxy)
        const isSecure = process.env.NODE_ENV === 'production' || 
                         event.node.req.headers['x-forwarded-proto'] === 'https';

        console.log('🔗 Setting session cookie with secure flag:', isSecure);

        setCookie(event, 'user_session', JSON.stringify(sessionData), {
            httpOnly: true,
            // CRITICAL: Must be TRUE when operating over HTTPS (deployed)
            secure: isSecure, 
            // Ensures cookie is sent on cross-site redirects (Keycloak -> Your App)
            sameSite: 'lax', 
            maxAge: tokens.expires_in,
            path: '/',
        });

        console.log('✅ Session cookie created successfully');
        
        // Note: The following line will still log false because the cookie 
        // is in the response header, not the request header yet. This is expected.
        const testCookie = getCookie(event, 'user_session'); 
        console.log('🧪 Cookie test - can read back in this handler (Expected False):', !!testCookie); 
        
        console.log('↪️ Redirecting to dashboard...');
        return sendRedirect(event, '/dashboard?authenticated=true');

    } catch (error: any) {
        console.error('❌ === CALLBACK ERROR ===');
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ ==================');

        const errorMsg = encodeURIComponent(`Authentication failed: ${error.message}`);
        return sendRedirect(event, `/LoginPage?error=${errorMsg}`);
    }
});