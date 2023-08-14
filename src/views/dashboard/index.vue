<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ProductPerformance from '@/components/dashboard/ProductPerformance.vue';
</script>
<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Stories"> 
                <ProductPerformance />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
