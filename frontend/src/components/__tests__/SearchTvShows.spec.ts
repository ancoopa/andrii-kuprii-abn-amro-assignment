import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import { generateTvShows } from '@/utils/testing'
import SearchTvShows from '@/components/SearchTvShows.vue'
import { searchTvShows } from '@/services/networking.service'

vi.mock('@/utils/debounce', () => ({
  debounce: (fn: Function) => fn
}))

vi.mock('@/services/networking.service', () => ({
  searchTvShows: vi.fn()
}))

describe('SearchTvShows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = shallowMount(SearchTvShows)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Search')
  })

  it('dropdown is hidden when search is empty', () => {
    const wrapper = mount(SearchTvShows)
    expect(wrapper.find('.options-wrapper').exists()).toBe(false)
  })

  it('displays search results in the dropdown', async () => {
    const wrapper = shallowMount(SearchTvShows)
    wrapper.find('input#search').setValue('Breaking Bad')
    const newTvShows = generateTvShows(5)
    vi.mocked(searchTvShows).mockResolvedValue(newTvShows.map((x) => ({ show: x, score: 1 })))
    await flushPromises()
    expect(wrapper.findAll('.option').length).toBe(newTvShows.length)
  })

  it('hides dropdown when clicking outside the component', async () => {
    const wrapper = shallowMount(SearchTvShows, {
      attachTo: document.body
    })

    wrapper.find('input#search').setValue('Breaking Bad')
    const newTvShows = generateTvShows(5)
    vi.mocked(searchTvShows).mockResolvedValue(newTvShows.map((x) => ({ show: x, score: 1 })))
    await flushPromises()

    document.body.click()
    await flushPromises()

    expect(wrapper.findAll('.option').length).toBe(0)
  })
})
