<template>
  <q-scroll-area style="height: 68vh;">
    <div v-for="{ name, filterSet }, index in presets" :key="name" class="flex flex-center cursor-pointer rounded-borders q-ma-md relative-position" style="border: 3px solid #ff9800;">
      <q-img
        :src="image"
        :style="getFilter(name)"
        fit="scale-down"
        @click="onSelectFilter(name, filterSet)"
      />
        <q-badge :color="selectedFilter == name ? 'orange' : 'orange-1'" floating :class="selectedFilter == name ? 'text-white' : 'text-orange'" class="q-ma-sm q-pa-sm text-uppercase">
          <div>{{ name }}</div>
        </q-badge>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { ref } from 'vue'
import presets from '@/lib/presets'

defineProps(['image'])

const emit = defineEmits(['onApplyFilters'])

const selectedFilter = ref('')

const getFilter = (presetName) => {
	const { filterSet } = presets.find(({ name }) => name === presetName)

	const filterString = Object
		.keys(filterSet)
		.map(filterFunc => {
			if (filterFunc === 'hueRotate') return `hue-rotate(${filterSet[filterFunc]}deg)`

			if (filterFunc === 'blur') return `blur(${filterSet[filterFunc]}px)`

			return `${filterFunc}(${filterSet[filterFunc]})`
		})
		.join(' ')

	return { filter: filterString }
}

const onSelectFilter = (name, filterSet) => {
  selectedFilter.value = name

  emit('onApplyFilters', filterSet)
}
</script>