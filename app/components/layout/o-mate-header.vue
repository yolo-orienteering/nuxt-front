<script setup lang="ts">
  import logo from '@/assets/img/o-mate-logo.webp'
  import { useDisplay } from 'vuetify'

  const display = useDisplay()
</script>

<template>
  <v-app-bar :height="84" scroll-behavior="fully-hide" :scroll-threshold="100">
    <v-row class="ma-2 ml-0 align-center">
      <v-col class="v-col-auto">
        <img
          :src="logo"
          style="height: 64px; width: auto; display: block; margin: auto"
        />
      </v-col>
    </v-row>
  </v-app-bar>

  <v-navigation-drawer class="pt-12" v-if="display.mdAndUp">
    <v-list-item style="font-size: 24px">
      <icon-rocket class="mr-2" />Einstellungen</v-list-item
    >
    <v-list-item>Entdecken</v-list-item>
    <v-list-item>Meine Läufe</v-list-item>
  </v-navigation-drawer>
</template>
