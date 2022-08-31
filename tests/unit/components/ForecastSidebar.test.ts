import { mount } from '@vue/test-utils'
import ForecastSidebar from '@/components/ForecastSidebar.vue'

describe('ForecastSidebar', () => {
  let wrapper
  beforeEach(() => {
    const data = [
      { name: 'rain', title: 'RAIN CHANCE', imgVariants: [] },
      { name: 'temp', title: 'TEMPERATURE', imgVariants: ['Min', 'Max'] },
    ]
    const props = { data }
    wrapper = mount(ForecastSidebar, { props })
  })

  it('should exist', () => {
    expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true)
  })

  describe('Main Buttons', () => {
    let varBtns

    beforeEach(() => {
      varBtns = wrapper.findAll('[data-test="var-btn"]')
    })

    it('should match number of variables', () => {
      expect(varBtns).toHaveLength(wrapper.props('data').length)
    })

    it('should have v-model:activeVariable', () => {
      varBtns
        .slice()
        .reverse()
        .forEach((btn) => btn.trigger('click'))

      expect(wrapper.emitted()).toHaveProperty('update:activeVariable')

      const setActiveVariableEv = wrapper.emitted('update:activeVariable')
      const expectedVal = wrapper
        .props('data')
        .slice()
        .reverse()
        .map((d) => [d.name])

      expect(setActiveVariableEv).toEqual(expectedVal)
    })
  })

  describe('Sub Buttons', () => {
    it('should match number of variants', async () => {
      expect(wrapper.findAll('[data-test="type-btn"]')).toHaveLength(
        wrapper.props('data')[0].imgVariants.length
      )

      await wrapper.setProps({
        activeVariable: wrapper.props('data')[1].name,
      })

      expect(wrapper.findAll('[data-test="type-btn"]')).toHaveLength(
        wrapper.props('data')[1].imgVariants.length
      )
    })

    it('should have v-model:activeType', async () => {
      await wrapper.setProps({
        activeVariable: wrapper.props('data')[1].name,
      })

      const typeBtns = wrapper.findAll('[data-test="type-btn"]')

      typeBtns
        .slice()
        .reverse()
        .forEach((btn) => btn.trigger('click'))

      expect(wrapper.emitted()).toHaveProperty('update:activeType')

      const setActiveVariableEv = wrapper.emitted('update:activeType')
      const expectedVal = wrapper
        .props('data')
        .map((d, i) => [i])
        .reverse()

      expect(setActiveVariableEv).toEqual(expectedVal)
    })
  })
})
