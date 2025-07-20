<script setup lang="ts">
  import logo from '@/assets/img/o-mate-logo.webp'
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
</template>
