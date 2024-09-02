import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MainDashboard, { type TvShowsState } from '@/views/MainDashboard.vue' // Updated component name
import TvShowList from '@/components/TvShowList.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { fetchPaginateTvShows } from '@/services/networking.service'
import { nextTick } from 'vue'
import { generateTvShows } from '@/utils/testing'

vi.mock('@/services/networking.service', () => ({
  fetchPaginateTvShows: vi.fn()
}))

describe('MainDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders TvShowList components for each genre after fetching data', async () => {
    const mockTvShows: TvShowsState = {
      drama: {
        shows: generateTvShows(1),
        currentPage: 1,
        hasMorePages: true
      },
      comedy: {
        shows: generateTvShows(2),
        currentPage: 1,
        hasMorePages: true
      }
    }
    vi.mocked(fetchPaginateTvShows).mockResolvedValue(mockTvShows)

    const wrapper = mount(MainDashboard)
    await nextTick()

    expect(wrapper.findComponent(LoadingIndicator).exists()).toBe(true)
    // TODO: Figure out why there are 3 ticks needed here:
    await nextTick()
    await nextTick()
    await nextTick()

    const tvShowLists = wrapper.findAllComponents(TvShowList)
    expect(tvShowLists.length).toBe(2)
    expect(tvShowLists[0].props('genre')).toBe('comedy')
    expect(tvShowLists[1].props('genre')).toBe('drama')
  })
})
