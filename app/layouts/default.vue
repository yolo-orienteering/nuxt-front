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
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <o-mobile-menu class="hidden-sm-and-up" />
  </v-app>
</template>
