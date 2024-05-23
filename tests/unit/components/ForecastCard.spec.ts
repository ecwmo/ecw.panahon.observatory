import { mount, type VueWrapper } from '@vue/test-utils'
import ForecastCard from '@/components/ForecastCard.vue'

import type {
  ForecastCardInfo,
  ForecastCardData,
} from '@/composables/useForecastCardData'

type TestCtx = {
  wrapper: VueWrapper
  props: ForecastCardInfo
}

describe('ForecastCard', () => {
  beforeEach<TestCtx>((ctx) => {
    const data = [
      { name: 'test1', value: 0.0 },
      { name: 'test2', value: 1.1 },
    ] as ForecastCardData
    ctx.props = {
      name: 'test',
      title: 'Test title',
      data,
      icon: { src: 'sample.png' },
    } as ForecastCardInfo
    ctx.wrapper = mount(ForecastCard, { props: ctx.props })
  })

  afterEach<TestCtx>((ctx) => {
    ctx.wrapper.unmount()
  })

  test<TestCtx>('mount', ({ expect, wrapper }) => {
    expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
  })

  test<TestCtx>('title', ({ expect, wrapper, props }) => {
    const el = wrapper.find('[data-test="card-title"]')
    expect(el.exists()).toBe(true)
    expect(el.text()).toBe(props['title'])
  })

  test<TestCtx>('icon', ({ expect, wrapper, props }) => {
    const el = wrapper.find('[data-test="card-icon"]')
    expect(el.exists()).toBe(true)
    const img = el.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(props['icon'].src)
  })

  test<TestCtx>('body', ({ expect, wrapper, props }) => {
    const body = wrapper.findAll('[data-test="card-body"]')
    expect(body).toHaveLength(props['data'].length)
  })
})
