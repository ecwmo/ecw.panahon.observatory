import { mount } from '@vue/test-utils'
import ForecastCard from '@/components/ForecastCard.vue'

describe('ForecastCard', () => {
  let wrapper

  beforeEach(() => {
    const data = [
      { name: 'test1', value: 0.0 },
      { name: 'test2', value: 1.1 },
    ]
    const props = {
      name: 'test',
      title: 'Test title',
      data,
      icon: 'sample.png',
    }
    wrapper = mount(ForecastCard, { props })
  })

  it('should exist', () => {
    expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
  })

  it('should have a title', () => {
    expect(wrapper.find('[data-test="card-title"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-title"]').text()).toBe(
      wrapper.props('title')
    )
  })

  it('should have an icon', () => {
    expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-icon"]').find('img').exists()).toBe(
      true
    )
    expect(
      wrapper.find('[data-test="card-icon"]').find('img').attributes('src')
    ).toBe(wrapper.props('icon'))
  })

  it('should have a body', () => {
    const body = wrapper.findAll('[data-test="card-body"]')
    expect(body).toHaveLength(wrapper.props('data').length)
  })
})
