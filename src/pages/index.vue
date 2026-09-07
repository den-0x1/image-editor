<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
				<q-btn round flat>
					<q-icon size="lg" name="palette" />
				</q-btn>
				
				<q-toolbar-title>Image Editor</q-toolbar-title>

        <LocaleSwitcher />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
</script>
