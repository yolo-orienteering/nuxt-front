<script setup lang="ts">
  import OMateHeader from '~/components/layout/o-mate-header.vue'
  import oNavigationDrawer from '~/components/layout/o-navigation-drawer.vue'
</script>

<template>
  <v-app>
    <o-mate-header />
    <o-navigation-drawer />
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
