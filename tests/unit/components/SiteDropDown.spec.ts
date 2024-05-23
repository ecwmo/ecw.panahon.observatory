import { mount, VueWrapper } from '@vue/test-utils'

import SiteDropDown, { type Site } from '@/components/SiteDropDown.vue'

type TestCtx = {
  wrapper: VueWrapper
  props: { sites: Site[] }
}

describe('SiteDropDown', () => {
  beforeEach<TestCtx>((ctx) => {
    const sites = [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }]
    ctx.props = { sites }
    ctx.wrapper = mount(SiteDropDown, { props: ctx.props })
  })

  afterEach<TestCtx>((ctx) => {
    ctx.wrapper.unmount()
  })

  test<TestCtx>('select', ({ expect, wrapper }) => {
    expect(wrapper.find('[data-test="select"]').exists()).toBe(true)
  })

  test<TestCtx>('option', ({ expect, wrapper, props }) => {
    // no props
    const _wrapper = mount(SiteDropDown)
    let opts = _wrapper.findAll('[data-test="options"]')
    expect(opts).toHaveLength(1)
    expect(opts[0].text()).toBe('')

    // with props
    opts = wrapper.findAll('[data-test="options"]')
    expect(opts).toHaveLength(props['sites'].length)

    const optsTxts = opts.map((o) => o.text())
    const expectedVal = props['sites'].map((d) => d.name)
    expect(optsTxts).toEqual(expectedVal)
  })

  test<TestCtx>('value change', async ({ expect, wrapper, props }) => {
    const sites = props['sites']
    const startValue = sites[0].name
    const endValue = sites[sites.length - 1].name

    await wrapper.setProps({ modelValue: startValue })
    const select = wrapper.find<HTMLInputElement>('[data-test="select"]')
    expect(select.element.value).toBe(startValue)

    await select.setValue(endValue)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([endValue])
  })
})
