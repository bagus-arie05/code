<!-- components/sideBar.vue -->
<template>
  <v-navigation-drawer
    :model-value="drawer"
    :rail="rail"
    permanent
    app
    @update:model-value="emit('update:drawer', $event)"
  >
    <v-list density="compact" nav>
      <template v-for="item in items" :key="item.name">
        <v-menu
          v-if="item.children"
          open-on-hover
          :location="rail ? 'end' : undefined"
          :offset="10"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.name"
              :value="item.name"
              :to="!rail ? item.path : undefined"
              :link="!rail"
            ></v-list-item>
          </template>

          <v-card class="py-2" min-width="200">
            <v-card-title class="text-subtitle-1 font-weight-bold px-4 py-2">
              {{ item.name }}
            </v-card-title>
            <v-divider></v-divider>
            <v-list density="compact" nav>
              <v-list-item
                v-for="child in item.children"
                :key="child.name"
                :to="child.path"
                :title="child.name"
                :prepend-icon="child.icon"
                link
                class="px-4"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-tooltip
          v-else
          :disabled="!rail"
          open-on-hover
          location="end"
          :text="item.name"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.name"
              :to="item.path"
              link
            ></v-list-item>
          </template>
        </v-tooltip>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface NavItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

const props = defineProps({
  items: {
    type: Array as () => NavItem[],
    required: true,
  },
  rail: {
    type: Boolean,
    required: true,
  },
  drawer: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:drawer']);
</script>

<style scoped>
.v-navigation-drawer__content {
  background-color: #ffffff;
}
</style>