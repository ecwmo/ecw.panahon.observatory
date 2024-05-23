import { mount, VueWrapper } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'

import ForecastImg from '@/components/ForecastImg.vue'

type TestCtx = {
  wrapper: VueWrapper
}

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockReturnValue({
      data: {
        imgs: [
          '/resources/model/web_img/wrf-24hr_ppv_max_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-24hr_ppv_mean_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-24hr_rainchance_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-24hr_temp_max_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-24hr_temp_min_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-48hr_ppv_max_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-48hr_ppv_mean_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-48hr_rainchance_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-48hr_temp_max_2024-05-07_02PHT.png',
          '/resources/model/web_img/wrf-48hr_temp_min_2024-05-07_02PHT.png',
        ],
        cmaps: [
          '/resources/model/web_img/cmap/wrf-ppv_cmap.png',
          '/resources/model/web_img/cmap/wrf-rainchance_cmap.png',
          '/resources/model/web_img/cmap/wrf-temp_cmap.png',
        ],
      },
    }),
  },
}))

describe('ForecastCard', () => {
  beforeEach<TestCtx>((ctx) => {
    const props = {
      varName: 'temp',
    }
    ctx.wrapper = mount(ForecastImg, {
      props,
      global: { plugins: [VueQueryPlugin] },
    })
  })

  afterEach<TestCtx>((ctx) => {
    ctx.wrapper?.unmount()
  })

  test<TestCtx>('map', ({ expect, wrapper }) => {
    expect(wrapper.find('[data-test="map"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="map"]').attributes('src')).toBeDefined()
  })

  test<TestCtx>('cbar', ({ expect, wrapper }) => {
    expect(wrapper.find('[data-test="colorbar"]').exists()).toBe(true)
    expect(
      wrapper.find('[data-test="colorbar"]').attributes('src'),
    ).toBeDefined()
  })
})
