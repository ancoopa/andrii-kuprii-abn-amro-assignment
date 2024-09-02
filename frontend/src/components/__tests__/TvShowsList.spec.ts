import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import { generateTvShows } from '@/utils/testing'
import TvShowList from '@/components/TvShowList.vue'
import { fetchNewPageKey } from '@/constants/provide-inject.keys'

vi.mock('@/constants/provide-inject.keys', () => ({
  fetchNewPageKey: Symbol('fetchNewPage')
}))

describe('TvShowList', () => {
  let mockFetchSetNewPage: vi.Mock

  beforeEach(() => {
    mockFetchSetNewPage = vi.fn()
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    const tvShowsQuantity = 5
    const tvShows = generateTvShows(tvShowsQuantity)
    const genre = 'action'
    const wrapper = mount(TvShowList, {
      propsData: {
        tvShows,
        genre
      }
    })
    expect(wrapper.text()).toContain(genre)
    expect(wrapper.findAll('.media-element').length).toBe(tvShowsQuantity + 1)

    for (let i = 0; i < tvShowsQuantity; i++) {
      expect(wrapper.text()).toContain(tvShows[i].name)
    }
    expect(wrapper.text()).toContain('Load More')
  })

  it("doesn't render list if no TV shows", () => {
    const wrapper = mount(TvShowList)
    expect(wrapper.findAll('.media-element').length).toBe(0)
  })

  it('shows loader on "Load More" click', async () => {
    const tvShows = generateTvShows(5)
    const wrapper = mount(TvShowList, {
      propsData: {
        tvShows,
        genre: 'action'
      }
    })
    await wrapper.find('button.button--load-more').trigger('click')
    expect(wrapper.findAll('.loading-indicator').length).toBe(1)
  })

  it('render incoming TV shows for new page', async () => {
    const genre = 'action'
    const wrapper = mount(TvShowList, {
      propsData: {
        tvShows: generateTvShows(5),
        genre
      }
    })

    const newTvShowsQuantity = 10
    const newTvShows = generateTvShows(newTvShowsQuantity)
    await wrapper.setProps({ tvShows: newTvShows })

    expect(wrapper.text()).toContain(genre)
    expect(wrapper.findAll('.media-element').length).toBe(newTvShowsQuantity + 1)

    for (let i = 0; i < newTvShowsQuantity; i++) {
      expect(wrapper.text()).toContain(newTvShows[i].name)
    }
    expect(wrapper.text()).toContain('Load More')
  })

  it('calls fetchSetNewPage when "Load More" is clicked', async () => {
    mockFetchSetNewPage.mockResolvedValue(true)

    const wrapper = shallowMount(TvShowList, {
      global: {
        provide: {
          [fetchNewPageKey]: mockFetchSetNewPage
        }
      },
      props: {
        tvShows: generateTvShows(5),
        genre: 'Action'
      }
    })

    await wrapper.find('.button--load-more').trigger('click')
    expect(mockFetchSetNewPage).toHaveBeenCalledWith('Action')
    await flushPromises()
    expect(wrapper.findAll('.loading-indicator').length).toBe(0)
  })

  it('shows loading indicator when fetching new page', async () => {
    // Keeps the promise pending
    mockFetchSetNewPage.mockResolvedValue(new Promise(() => {}))

    const wrapper = shallowMount(TvShowList, {
      global: {
        provide: {
          [fetchNewPageKey]: mockFetchSetNewPage
        }
      },
      props: {
        tvShows: generateTvShows(5),
        genre: 'Action'
      }
    })

    await wrapper.find('.button--load-more').trigger('click')
    await flushPromises()
    expect(wrapper.findComponent({ name: 'LoadingIndicator' }).exists()).toBe(true)
  })

  it('hides "Load More" button when there are no more pages', async () => {
    mockFetchSetNewPage.mockResolvedValue(false)

    const wrapper = shallowMount(TvShowList, {
      global: {
        provide: {
          [fetchNewPageKey]: mockFetchSetNewPage
        }
      },
      props: {
        tvShows: generateTvShows(5),
        genre: 'Action'
      }
    })

    await wrapper.find('.button--load-more').trigger('click')
    await flushPromises()
    expect(wrapper.find('.button--load-more').exists()).toBe(false)
  })

  it('displays fallback image if no image is provided', () => {
    const wrapper = shallowMount(TvShowList, {
      global: {
        provide: {
          [fetchNewPageKey]: mockFetchSetNewPage
        }
      },
      props: {
        tvShows: [{ ...generateTvShows(1)[0], image: {} }],
        genre: 'Action'
      }
    })

    const img = wrapper.find('.image')
    expect(img.attributes('src')).toBe('/src/assets/movie-placeholder.webp')
  })
})
