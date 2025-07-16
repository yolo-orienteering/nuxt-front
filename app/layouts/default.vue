<script setup lang="ts">
  import OMateHeader from '~/components/layout/o-mate-header.vue'
</script>

<template>
  <v-app>
    <o-mate-header />
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
