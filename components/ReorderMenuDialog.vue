<!-- <template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        Atur Urutan Menu
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <draggable v-model="localMenus" item-key="title" @end="onDragEnd">
            <template #item="{ element }">
              <v-list-item class="reorder-item">
                <v-list-item-content>
                  <v-list-item-title>{{ element.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-drag</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" text @click="dialog = false">Batal</v-btn>
        <v-btn color="blue" text @click="saveOrder">Simpan Urutan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import navigationItems from '~/data/menu.js';

const dialog = ref(false);
const localMenus = ref([]);

// Watch for changes in the dialog's visibility
watch(dialog, (val) => {
  if (val) {
    // Make a deep copy to avoid mutating the original data
    localMenus.value = JSON.parse(JSON.stringify(navigationItems));
  }
});

const onDragEnd = (event) => {
  // Logic to handle the end of a drag event
};

const saveOrder = () => {
  // Emit an event with the new menu order
  // You would then handle this in the parent component
  // to update the ~/data/menu.js file (or your state management)
  // and trigger a UI refresh.
  dialog.value = false;
};

const openDialog = () => {
  dialog.value = true;
};

defineExpose({ openDialog });
</script>

<style scoped>
.reorder-item {
  cursor: grab;
  border-bottom: 1px solid #eee;
}
.reorder-item:active {
  cursor: grabbing;
}
</style> -->