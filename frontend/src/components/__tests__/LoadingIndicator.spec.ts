import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

describe('LoadingIndicator', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(LoadingIndicator)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays the correct loading text', () => {
    const wrapper = shallowMount(LoadingIndicator)
    expect(wrapper.find('span').text()).toBe('Loading...')
  })
})
