<script setup lang="ts">
  import oHeader from '~/components/layout/oHeader.vue'
  import oDesktopMenu from '~/components/layout/oDesktopMenu.vue'
  import oMobileMenu from '~/components/layout/oMobileMenu.vue'
  import notifications from '~/components/helper/notifications.vue'
</script>

<template>
  <v-app>
    <o-header />
    <notifications />
    <o-desktop-menu />
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <o-mobile-menu class="hidden-sm-and-up" />
  </v-app>
</template>
