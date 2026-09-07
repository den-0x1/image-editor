<template>
  <q-tabs
    v-model="tab"
    class="text-grey"
    active-color="orange"
    narrow-indicator
  >
    <q-tab name="desktop" icon="computer" />
    <q-tab name="mobile" icon="smartphone" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="desktop">
      <q-select
        filled
        v-model="selectedDesktop"
        use-input
        hide-selected
        fill-input
        stack-label
        input-debounce="0"
        :options="filteredOptionsDesktop"
        @filter="filterFnDesktop"
        @update:model-value="value => emit('onSelectDim', value)"
        class="full-width"
        :placeholder="$t('dimsPlaceholder')"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('dimsEmptyTxt') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-tab-panel>

    <q-tab-panel name="mobile">
      <q-select
        filled
        v-model="selectedMobile"
        use-input
        hide-selected
        fill-input
        stack-label
        input-debounce="0"
        :options="filteredOptionsMobile"
        @filter="filterFnMobile"
        @update:model-value="value => emit('onSelectDim', value)"
        class="full-width"
        :placeholder="$t('dimsPlaceholder')"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('dimsEmptyTxt') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from 'vue'
import dims from '@/lib/dimensions'

const emit = defineEmits(['onSelectDim'])

const tab = ref('desktop')

const selectedDesktop = ref('')
const optionsDesktop = dims.desktop
const filteredOptionsDesktop = ref(optionsDesktop)

const filterFnDesktop = (val, update) => {
  update(() => {
    filteredOptionsDesktop.value = optionsDesktop.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}

const selectedMobile = ref('')
const optionsMobile = dims.mobile
const filteredOptionsMobile = ref(optionsMobile)

const filterFnMobile = (val, update) => {
  update(() => {
    filteredOptionsMobile.value = optionsMobile.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}
</script>