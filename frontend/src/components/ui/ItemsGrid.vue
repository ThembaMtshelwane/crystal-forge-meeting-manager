<script setup lang="ts" generic="T extends {id : string}">
import { defineProps } from "vue";

const props = defineProps<{ items: T[] }>();
</script>

<template>
  <v-row>
    <v-col v-for="item in items" :key="item.id" cols="12" sm="6" lg="4">
      <slot name="item" :item-data="item"></slot>
    </v-col>
  </v-row>
</template>
