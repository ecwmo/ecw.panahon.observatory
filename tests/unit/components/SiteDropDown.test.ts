import { mount } from '@vue/test-utils'
import SiteDropDown from '@/components/SiteDropDown.vue'

describe('SiteDropDown', () => {
  let wrapper

  beforeEach(() => {
    const sites = [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }]
    const props = { sites }
    wrapper = mount(SiteDropDown, { props })
  })

  it('should render select element', () => {
    expect(wrapper.find('[data-test="select"]').exists()).toBe(true)
  })

  it('should render option elements', () => {
    // no props
    let wrapper0 = mount(SiteDropDown)
    let opts = wrapper0.findAll('[data-test="options"]')
    expect(opts).toHaveLength(1)
    expect(opts[0].text()).toBe('')

    // with props
    opts = wrapper.findAll('[data-test="options"]')
    expect(opts).toHaveLength(wrapper.props('sites').length)

    const optsTxts = opts.map((o) => o.text())
    const expectedVal = wrapper.props('sites').map((d) => d.name)
    expect(optsTxts).toEqual(expectedVal)
  })

  it('should change value', async () => {
    const sites = wrapper.props('sites')
    const startValue = sites[0].name
    const endValue = sites[sites.length - 1].name

    await wrapper.setProps({ modelValue: startValue })
    const select = wrapper.find('[data-test="select"]')
    expect(select.element.value).toBe(startValue)

    await select.setValue(endValue)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([endValue])
  })
})
