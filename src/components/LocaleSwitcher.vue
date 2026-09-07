<template>
  <q-select
    v-model="selectedLocale"
    :options="localeOptions"
    emit-value
    map-options
    borderless
    filled
    dense
    options-dense
    @update:model-value="changeLanguage"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useLocaleStore } from '@/stores/locale-store'

const localeOptions = [
  { value: 'en-US', label: 'EN' },
  { value: 'ru-RU', label: 'RU' }
]

const localeStore = useLocaleStore()
const selectedLocale = ref(localeStore.currentLocale)
const changeLanguage = (newValue) => localeStore.setLocale(newValue)
</script>