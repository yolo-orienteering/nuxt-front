<script setup lang="ts">
  const { isActiveRoute, menuEntries } = useMenu()
</script>

<template>
  <v-bottom-navigation>
    <v-row class="my-0">
      <v-col
        v-for="(menuEntry, menuEntryIndex) in menuEntries"
        :key="menuEntryIndex"
        class="v-col-4 text-center text-caption pt-2"
      >
        <nuxt-link :to="{ name: menuEntry.routeName }">
          <div>
            <component :is="menuEntry.icon" :size="24" />
          </div>
          <div
            class="mt-n1"
            :class="[
              { 'active-menu-border': isActiveRoute(menuEntry.routeName) },
            ]"
          >
            {{ menuEntry.name }}
          </div>
        </nuxt-link>
      </v-col>
    </v-row>
  </v-bottom-navigation>
</template>

<style lang="scss">
  .active-menu-border {
    border-bottom: 2px solid rgba(var(--v-theme-primary));
  }
</style>
