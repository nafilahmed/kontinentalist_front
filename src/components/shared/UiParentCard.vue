<script setup lang="ts">
import { inject } from 'vue'

const emitter = inject('emitter');
const props = defineProps({
    title: String,
    class:String
});

const openCreateStory = () => {
    emitter.emit('openCreateStory',1)
}
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item class="pa-0">
            <div class="d-sm-flex align-center justify-space-between">
                <h5 class="text-h5 mb-6 pl-7 pt-7">{{ title }}</h5>
                <!-- <template v-slot:append> -->
                <v-btn color="info" class="mr-4" @click="openCreateStory"> Create Story</v-btn>
                <!-- </template> -->
            </div>

            <slot />
        </v-card-item>
       
    </v-card>
</template>
