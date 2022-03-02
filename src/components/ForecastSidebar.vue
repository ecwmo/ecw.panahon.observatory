<template>
  <div class="w-32 flex flex-col gap-y-3 items-center" data-test="sidebar">
    <div class="w-full h-5 flex gap-x-2 justify-evenly">
      <a
        v-for="(v, idx) in imgVariants"
        :key="v"
        class="py-0.5 px-3 text-xs shadow-lg text-center rounded-full"
        href="#"
        :class="[
          activeType === idx
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="$emit('update:activeType', idx)"
        data-test="type-btn"
        >{{ v }}</a
      >
    </div>
    <div class="w-full flex flex-col gap-y-3">
      <a
        v-for="v in data"
        :key="v.name"
        class="w-full p-2 text-xs shadow-lg text-center"
        href="#"
        :class="[
          activeVariable === v.name
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="$emit('update:activeVariable', v.name)"
        data-test="var-btn"
      >
        {{ v.title }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, PropType, computed } from 'vue'

  interface Variable {
    name: string
    title: string
    imgVariants: string[]
  }

  export default defineComponent({
    name: 'ForecastSidebar',
    props: {
      data: {
        type: Object as PropType<Variable[]>,
        required: true,
      },
      activeVariable: {
        type: String,
        default: '',
      },
      activeType: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:activeVariable', 'update:activeType'],
    setup(props) {
      const { data, activeVariable } = toRefs(props)

      const imgVariants = computed(() => {
        const d = data.value.find(({ name }) => name === activeVariable.value)

        return d !== undefined ? d.imgVariants : []
      })

      return {
        imgVariants,
      }
    },
  })
</script>
