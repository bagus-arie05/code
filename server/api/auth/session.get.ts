// server/api/auth/session.get.ts

// Helper function to safely decode the JWT payload (Access Token or ID Token)
const decodeTokenPayload = (token: string | undefined): any | null => {
    if (!token) return null;
    try {
        // Tokens are base64 encoded and separated by '.'
        const parts = token.split('.');
        if (parts.length < 2) return null; // Not a valid JWT format
        
        const payloadBase64 = parts[1];
        
        // Decode from base64 and parse the JSON
        // Note: Using Buffer.from is standard in Node.js server environments (like Nitro/H3)
        return JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    } catch (e) {
        console.error('❌ Failed to decode token payload:', e);
        return null;
    }
};

// --- START OF THE SINGLE EXPORT DEFAULT HANDLER ---
export default defineEventHandler(async (event) => {
    console.log('🔍 Session endpoint called');

    const sessionCookie = getCookie(event, 'user_session');
    console.log('🍪 Session cookie exists:', !!sessionCookie);

    if (!sessionCookie) {
        console.log('❌ No session cookie found');
        throw createError({
            statusCode: 401,
            statusMessage: 'No session cookie found'
        });
    }

    try {
        const session = JSON.parse(sessionCookie);
        console.log('📋 Session parsed successfully');
        
        const isExpired = Date.now() > session.expiresAt;
        console.log('   Is Expired:', isExpired);

        // Check if the token has expired
        if (isExpired) {
            console.log('⏰ Session has expired, clearing cookie');
            deleteCookie(event, 'user_session');
            throw createError({
                statusCode: 401,
                statusMessage: 'Session expired'
            });
        }

        // Decode tokens and prepare the enhanced response data
        const idTokenPayload = decodeTokenPayload(session.idToken);
        const accessTokenPayload = decodeTokenPayload(session.accessToken);
        
        // Final response object for the frontend debug page
        const sessionResponse = {
            // Basic User Info
            user: session.user,
            
            // Raw Tokens
            idToken: session.idToken,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            
            // Session Timestamps
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,

            // Parsed Payloads
            idTokenPayload: idTokenPayload,
            accessTokenPayload: accessTokenPayload,

            // Raw Session Data (for Debug section)
            fullSessionObject: session,
            
            status: 'authenticated',
        };

        console.log('✅ Session is valid, returning full session data');
        return sessionResponse;

    } catch (parseError) {
        console.error('❌ Failed to parse session cookie:', parseError);
        // If JSON parsing fails or any other error occurs, the session is invalid
        deleteCookie(event, 'user_session');
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid session data'
        });
    }
});
// --- END OF THE SINGLE EXPORT DEFAULT HANDLER ---