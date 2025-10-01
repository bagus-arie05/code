<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  middleware:['auth']
})

// Define a type for the data structure you now return from the API
interface SessionData {
  user: {
    name: string;
    email: string;
    // ... add other user fields
  };
  status: string;
  createdAt: number;
  expiresAt: number;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  accessTokenPayload: any;
  idTokenPayload: any;
  fullSessionObject: any;
}

const sessionData = ref<SessionData | null>(null);
const loading = ref(true);
const authError = ref<any>(null);


// Computeds for easy display
const sessionExpiresDate = computed(() => {
    if (!sessionData.value?.expiresAt) return 'N/A';
    return new Date(sessionData.value.expiresAt).toLocaleString();
});

const sessionCreatedDate = computed(() => {
    if (!sessionData.value?.createdAt) return 'N/A';
    return new Date(sessionData.value.createdAt).toLocaleString();
});

const currentDateTime = computed(() => new Date().toLocaleString());

// Helper to display JSON data nicely
const formatJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};

onMounted(async () => {
  try {
    // Fetch the enhanced session data from your API
    const data = await $fetch<SessionData>('/api/auth/session');
    sessionData.value = data;
    authError.value = null;

  } catch (e: any) {
    console.error('Failed to fetch session data:', e);
    // Store the error status for display
    authError.value = e.data?.statusMessage || 'Session check failed. Please log in.';
    sessionData.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 border-b pb-2">Complete Session Data Debug Page</h1>

    <div v-if="loading" class="text-center p-8">
      <p class="text-xl">Loading session data...</p>
    </div>

    <div v-else-if="authError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Authentication Error:</strong>
      <span class="block sm:inline">{{ authError }}</span>
      <p class="mt-2">If you expect to be logged in, the session may have expired or the cookie is missing/invalid.</p>
      <NuxtLink to="/LoginPage" class="text-blue-600 hover:underline">Go to Login Page</NuxtLink>
    </div>

    <div v-else-if="sessionData">
      
      <section class="mb-6 border p-4 rounded-lg bg-gray-50">
        <h2 class="text-xl font-semibold mb-3">Basic User Information</h2>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <p><strong>Name:</strong> {{ sessionData.user.name }}</p>
          <p><strong>Email:</strong> {{ sessionData.user.email }}</p>
          <p><strong>Status:</strong> <span class="text-green-600 font-medium">{{ sessionData.status }}</span></p>
          <p><strong>Session Expires:</strong> {{ sessionExpiresDate }}</p>
          <p><strong>Created At:</strong> {{ sessionCreatedDate }}</p>
        </div>
      </section>

      <section class="mb-6 border p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-3">Token Information (Raw)</h2>
        <div class="space-y-3">
          <details>
            <summary class="cursor-pointer font-medium hover:text-blue-600">ID Token (session.idToken)</summary>
            <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ sessionData.idToken }}</pre>
          </details>
          <details>
            <summary class="cursor-pointer font-medium hover:text-blue-600">Access Token (session.accessToken)</summary>
            <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ sessionData.accessToken }}</pre>
          </details>
          <details>
            <summary class="cursor-pointer font-medium hover:text-blue-600">Refresh Token (session.refreshToken)</summary>
            <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ sessionData.refreshToken || 'N/A' }}</pre>
          </details>
        </div>
      </section>

      <section class="mb-6 border p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-3">Parsed Token Payloads</h2>
        <div class="space-y-3">
          <details open>
            <summary class="cursor-pointer font-medium hover:text-blue-600">Access Token Payload</summary>
            <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ formatJson(sessionData.accessTokenPayload) }}</pre>
          </details>
          <details>
            <summary class="cursor-pointer font-medium hover:text-blue-600">ID Token Payload</summary>
            <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ formatJson(sessionData.idTokenPayload) }}</pre>
          </details>
        </div>
      </section>
      
      <section class="mb-6 border p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-3">Complete Raw Session Data (Debug)</h2>
        <details>
          <summary class="cursor-pointer font-medium hover:text-blue-600">Full Session Object</summary>
          <pre class="whitespace-pre-wrap bg-gray-100 p-3 mt-1 text-xs">{{ formatJson(sessionData.fullSessionObject) }}</pre>
        </details>
      </section>

      <section class="mb-6 p-4 rounded-lg border-t-2 border-dashed">
        <h2 class="text-xl font-semibold mb-3">Session Timeline</h2>
        <ul class="space-y-2">
          <li class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-black rounded-full"></span>
            <p><strong>Session Created:</strong> {{ sessionCreatedDate }}</p>
          </li>
          <li class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-black rounded-full"></span>
            <p><strong>Current Time:</strong> {{ currentDateTime }}</p>
          </li>
          <li class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-black rounded-full"></span>
            <p><strong>Session Expires:</strong> {{ sessionExpiresDate }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Basic styling for better visibility */
summary {
  list-style: none; /* Removes the default arrow */
  display: block; /* Allows summary to span full width */
  padding: 0.5rem 0;
}
/* Adds a custom arrow/chevron */
summary::before {
  content: "▶";
  margin-right: 0.5em;
  transition: transform 0.2s;
  display: inline-block;
}
details[open] summary::before {
  content: "▼";
  /* transform: rotate(90deg); */
}
</style>