import { mount } from '@vue/test-utils'
import ForecastImg from '@/components/ForecastImg.vue'

describe('ForecastCard', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      varName: 'test',
    }
    wrapper = mount(ForecastImg, { props })
  })

  it('should show the map', () => {
    expect(wrapper.find('[data-test="map"]').attributes('src')).toBe(
      wrapper.vm.forecastImg
    )
  })

  it('should show the colorbar', () => {
    expect(wrapper.find('[data-test="colorbar"]').attributes('src')).toBe(
      wrapper.vm.forecastImgCmap
    )
  })
})
