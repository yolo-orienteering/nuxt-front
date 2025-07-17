<script setup lang="ts">
  import backBtn from '../helper/back-btn.vue'
  const { isActiveRoute, menuEntries, showBackButton } = useMenu()

  const navigationHeight = computed<number>(() =>
    showBackButton.value ? 56 * 2 : 56
  )
</script>

<template>
  <v-bottom-navigation :height="navigationHeight">
    <v-container class="pa-0">
      <v-row class="my-0 align-end fill-height">
        <!-- back btn -->
        <v-col
          v-if="showBackButton"
          class="v-col-12 text-center menu-row-height menu-border-bottom"
        >
          <back-btn />
        </v-col>

        <!-- menu entries -->
        <v-col
          v-for="(menuEntry, menuEntryIndex) in menuEntries"
          :key="menuEntryIndex"
          class="v-col-4 text-center text-caption menu-row-height"
        >
          <nuxt-link :to="{ name: menuEntry.routeName }">
            <div>
              <component
                :is="menuEntry.icon"
                :size="20"
                :strokeWidth="isActiveRoute(menuEntry.routeName) ? 3 : 1.5"
              />
            </div>
            <div
              class="mt-n1"
              :class="[
                { 'active-menu-entry': isActiveRoute(menuEntry.routeName) },
              ]"
            >
              {{ menuEntry.name }}
            </div>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </v-bottom-navigation>
</template>

<style lang="scss">
  .active-menu-entry {
    border-bottom: 2px solid rgba(var(--v-theme-primary));
    font-weight: bold;
  }

  .menu-row-height {
    height: 56px;
  }

  .menu-border-bottom {
    border-bottom: 2px solid rgba(var(--v-theme-primary));
  }
</style>
