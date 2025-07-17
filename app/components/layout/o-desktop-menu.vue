<script setup lang="ts">
  import { useMenu } from '~/composables/useMenu'
  import backBtn from '../helper/back-btn.vue'

  const { isActiveRoute, menuEntries, showBackButton } = useMenu()
</script>
<template>
  <v-navigation-drawer class="pt-12" mobile-breakpoint="sm" touchless>
    <v-list>
      <v-list-item
        v-for="(menuEntry, menuEntryIndex) in menuEntries"
        :key="menuEntryIndex"
        :active="isActiveRoute(menuEntry.routeName)"
        color="primary"
        :to="{ name: menuEntry.routeName }"
        nuxt
      >
        <template #prepend>
          <component :is="menuEntry.icon" :size="20" class="mr-2" />
        </template>
        <v-list-item-title>
          {{ menuEntry.name }}
        </v-list-item-title>
      </v-list-item>

      <v-divider class="mt-3" />

      <v-list-item v-if="showBackButton" class="pt-5">
        <back-btn class="ml-7" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
