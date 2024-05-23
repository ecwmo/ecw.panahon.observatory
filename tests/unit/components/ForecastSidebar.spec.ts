import { mount, VueWrapper } from '@vue/test-utils'

import ForecastSidebar from '@/components/ForecastSidebar.vue'

type TestCtx = {
  wrapper: VueWrapper
}

const { mForecastVars } = vi.hoisted(() => ({
  mForecastVars: [
    {
      name: 'ppv',
      name2: 'solPow',
      units: 'MW',
      title: 'SOLAR POWER',
      stroke: '#F59E0B',
      fill: '#FDE68A',
      dotColor: '#FCD34D',
    },
    {
      name: 'temp',
      name2: 'temp',
      units: '°C',
      title: 'TEMPERATURE',
      stroke: '#F97316',
      fill: '#FED7AA',
      dotColor: '#FB923C',
    },
  ],
}))

vi.mock('@/data/forecastVars.json', () => ({
  default: mForecastVars,
}))

describe('ForecastSidebar', () => {
  beforeEach<TestCtx>((ctx) => {
    ctx.wrapper = mount(ForecastSidebar)
  })

  afterEach<TestCtx>((ctx) => {
    ctx.wrapper.unmount()
  })

  test<TestCtx>('mount', ({ expect, wrapper }) => {
    expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true)
  })

  describe('Main Buttons', () => {
    //   let varBtns
    //
    test<TestCtx>('count', ({ expect, wrapper }) => {
      const varBtns = wrapper.findAll('[data-test="var-btn"]')
      expect(varBtns).toHaveLength(mForecastVars.length)
    })

    test<TestCtx>('update:activeVarName', ({ expect, wrapper }) => {
      const varBtns = wrapper.findAll('[data-test="var-btn"]')
      varBtns
        .slice()
        .reverse()
        .forEach((btn) => btn.trigger('click'))

      expect(wrapper.emitted()).toHaveProperty('update:activeVarName')

      const setActiveVariableEv = wrapper.emitted('update:activeVarName')
      const expectedVal = mForecastVars
        .slice()
        .reverse()
        .map((d) => [d.name])

      expect(setActiveVariableEv).toEqual(expectedVal)
    })
  })

  describe('Sub Buttons', () => {
    test<TestCtx>('updateactiveImgTypeIdx', async ({ expect, wrapper }) => {
      const typeBtns = wrapper.findAll('[data-test="type-btn"]')

      typeBtns
        .slice()
        .reverse()
        .forEach((btn) => btn.trigger('click'))

      expect(wrapper.emitted()).toHaveProperty('update:activeImgTypeIdx')
    })
  })
})
