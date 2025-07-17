<template>
  <v-btn
    variant="outlined"
    rounded
    max-height="100%"
    @click="props.to ? $router.push(props.to) : $router.go(-1)"
  >
    <span class="d-flex align-center">
      <icon-chevron-left class="mr-1" />
      Zurück
    </span>
  </v-btn>
</template>

<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  const props = defineProps<{
    to?: RouteLocationRaw
  }>()
</script>
