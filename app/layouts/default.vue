<script setup lang="ts">
  import oHeader from '~/components/layout/o-header.vue'
  import oDesktopMenu from '~/components/layout/o-desktop-menu.vue'
  import oMobileMenu from '~/components/layout/o-mobile-menu.vue'
</script>

<template>
  <v-app>
    <o-header />
    <o-desktop-menu />
    <v-main>
      <v-container class="main-container">
        <slot />
      </v-container>
    </v-main>
    <o-mobile-menu class="align-self-end hidden-sm-and-up" />
  </v-app>
</template>

<style lang="scss">
  .main-container {
    height: calc(100vh - 84px);
  }
</style>
