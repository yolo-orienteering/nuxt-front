<template>
  <v-btn
    variant="outlined"
    rounded
    @click="props.to ? $router.push(props.to) : $router.go(-1)"
  >
    <icon-chevron-left />
    Zurück
  </v-btn>
</template>

<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  const props = defineProps<{
    to?: RouteLocationRaw
  }>()
</script>
