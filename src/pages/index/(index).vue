<template>
  <q-page class="flex flex-center">
    <div v-if="imageSrc" class="row full-width justify-center">
      <div class="col-12 col-md-1">
        <div class="row q-py-md">
          <div class="col col-md-12 flex justify-center">
            <q-btn stack flat icon="crop" :label="$t('cropTabTxt')" :color="tab == 'crop' ? 'orange' : 'blue-grey'" class="full-width" @click="toCropTab" />
          </div>

          <div class="col col-md-12 flex justify-center">
            <q-btn stack flat icon="tune" :label="$t('filtersTabTxt')" :color="tab == 'filters' ? 'orange' : 'blue-grey'" class="full-width" @click="toFiltersTab" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md">
        <div class="row">
          <div class="col-12 col-md-9">
            <CropperComponent />
          </div>

          <div class="col-12 col-md-3 q-px-sm">
            <div class="flex justify-around items-center q-pa-md">
              <q-btn outline @click="removeImage" rounded color="deep-orange" icon="delete_forever" :label="$t('removeBtnTxt')" />

              <q-btn rounded @click="cropImage" color="orange" icon-right="download" :label="$t('downloadBtnTxt')"  />
            </div>

            <q-separator class="q-my-md" />

            <div v-if="tab == 'crop'">
              <DimensionsComp @onSelectDim="setCropBoxData" />

              <q-separator />

              <div v-show="oversize" class="flex flex-center rounded-borders q-ma-md q-pa-md" style="border: 3px solid #ff9800;">
                <q-icon name="assignment_late" class="text-orange text-h4" />

                <div class="text-subtitle1 text-center">{{ $t('oversizeTxt') }}</div>
              </div>
            </div>

            <div v-else>
              <FiltersComp :image="imageSrc" @onApplyFilters="onApplyFilters" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-file
      v-else
      rounded
      outlined
      bottom-slots
      :label="$t('pickImgTxt')"
      counter
      accept="image/jpeg, image/png"
      :filter="checkFileSize"
      @rejected="onRejected"
      @update:model-value="value => imageFile = value"
      style="width: 250px;"
    >
      <template v-slot:append>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:hint>
        {{ $t('pickImgInfo') }}
      </template>
    </q-file>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useLocaleStore } from '@/stores/locale-store'
import { useI18n } from "vue-i18n"
import { type VuePictureCropperProps, useCropper } from "vue-picture-cropper"
import "cropperjs/dist/cropper.css"
import "vue-picture-cropper/style.css"
import DimensionsComp from "@/components/DimensionsComp.vue"
import FiltersComp from "@/components/FiltersComp.vue"

const $q = useQuasar()

const localeStore = useLocaleStore()

const { t } = useI18n()

const cropperInst = ref()

const initImgData = ref('')

const cropperProps = computed<VuePictureCropperProps>(() => ({
  img: imageSrc.value ?? '',
  options: {
    viewMode: 1,
    dragMode: 'none',
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    scalable: false,
    zoomable: false,
    autoCropArea: 1
  }
}))

const [CropperComponent, cropper] = useCropper(cropperProps)

cropper.onInstanceEffect(
  (instance) => {
    if (!instance) return

    cropperInst.value = instance

    const handler = () => {
      const dataURI = instance.getDataURL()
      initImgData.value = dataURI || ''
    }

    const el = instance.element
    el.addEventListener('ready', handler)

    return () => {
      el.removeEventListener('ready', handler)
    }
  }
)

const tab = ref('crop')

const oversize = ref(false)

const imageFile = ref(null)

const imageSrc = computed(() => imageFile.value ? URL.createObjectURL(imageFile.value) : null)

const toCropTab = () => {
  tab.value = 'crop'

  oversize.value = false
}

const toFiltersTab = () => {
  tab.value = 'filters'

  cropperInst.value.reset()
}

const setCropBoxData = (size) => {
  const canvasData = cropperInst.value.getCanvasData()
  const containerData = cropperInst.value.getContainerData()

  const width = size.width / (canvasData.naturalWidth / canvasData.width)
  const height = size.height / (canvasData.naturalHeight / canvasData.height)

  const x = (containerData.width / 2) - (width / 2)
  const y = (containerData.height / 2) - (height / 2)

  cropperInst.value.setCropBoxData({ left: x, top: y, width: width, height: height })

  cropperInst.value.setDragMode('move')

  oversize.value = canvasData.naturalWidth < parseInt(size.width) || canvasData.naturalHeight < parseInt(size.height)
}

const onApplyFilters = async (filterSet) => {
  let filter = ''

  for (const property in filterSet) {
    if (property === 'hueRotate') {
      filter += `hue-rotate(${filterSet[property]}deg) `
    } else if (property === 'blur') {
      filter += `blur(${filterSet[property]}px) `
    } else {
      filter += `${property}(${filterSet[property]}) `
    }
  }

  try {
    const imgData = await updateCanvas(initImgData.value, filter)
    cropperInst.value.replace(imgData, true)
  } catch (e) {
    console.log(e)
  }
}

const updateCanvas = (url: string, filter: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      if (ctx) {
        ctx.filter = filter

        ctx.drawImage(img, 0, 0)
      }

      resolve(canvas.toDataURL())
    }

    img.onerror = (e) => reject(e)

    img.src = url
  })
}

const cropImage = () => downloadImg(cropperInst.value.getCroppedCanvas().toDataURL(), 'image-editor')

const removeImage = () => {
  imageFile.value = null
  initImgData.value = ''
}

const onRejected = rejectedEntries => $q.notify({ type: 'negative', message: `${rejectedEntries.length} ${t('uploadRejectTxt')}` })

const checkFileSize = files => files.filter(file => Math.round((file.size / 1024)) < 10240)

const getFormattedDateTime = () => {
  const today = new Date()
  const date = today.toLocaleDateString(localeStore.currentLocale, { year: 'numeric', month: '2-digit', day: '2-digit' })
  const time = today.toLocaleTimeString(localeStore.currentLocale)
  return date + '-' + time
}

const downloadImg = (uri: string, name: string) => {
  const link = document.createElement('a')
  link.download = name + '_' + getFormattedDateTime() + '.jpg'
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
