<template>
  <div class="w-32 flex flex-col gap-y-3 items-center" data-test="sidebar">
    <div class="w-full h-5 flex gap-x-2 justify-evenly">
      <a
        v-for="(v, idx) in imgVariants"
        :key="v"
        class="py-0.5 px-3 text-xs shadow-lg text-center rounded-full"
        href="#"
        :class="[
          activeImgTypeIdx === idx
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="handleImgTypeClick(idx)"
        data-test="type-btn"
        >{{ v }}</a
      >
    </div>
    <div class="w-full flex flex-col gap-y-3">
      <a
        v-for="v in forecastVariables"
        :key="v.name"
        class="w-full p-2 text-xs shadow-lg text-center"
        href="#"
        :class="[
          activeVarName === v.name
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="handleVarNameClick(v.name)"
        data-test="var-btn"
      >
        {{ v.title }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useStore } from '@nanostores/vue'

  import {
    forecastVariables,
    setActiveVarName,
    setActiveImgTypeIdx,
    $activeVarName,
    $activeImgTypeIdx,
  } from '@/stores/forecast'

  const emit = defineEmits<{
    'update:activeVarName': [name: string]
    'update:activeImgTypeIdx': [idx: number]
  }>()

  const activeVarName = useStore($activeVarName)
  const activeImgTypeIdx = useStore($activeImgTypeIdx)

  const imgVariants = computed(
    () =>
      forecastVariables.find(({ name }) => name === activeVarName.value)
        ?.imgVariants ?? [],
  )

  const handleVarNameClick = (varName: string) => {
    setActiveVarName(varName)
    emit('update:activeVarName', varName)
  }

  const handleImgTypeClick = (idx: number) => {
    setActiveImgTypeIdx(idx)
    emit('update:activeImgTypeIdx', idx)
  }
</script>
