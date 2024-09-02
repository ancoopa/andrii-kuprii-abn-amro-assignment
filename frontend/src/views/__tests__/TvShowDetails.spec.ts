import { nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TvShowDetails from '@/views/TvShowDetails.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { fetchTvShow } from '@/services/networking.service'
import { generateTvShows } from '@/utils/testing'
import { stripHtml } from '@/utils/strip-html'

vi.mock('@/services/networking.service', () => ({
  fetchTvShow: vi.fn()
}))
vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}))

describe('TvShowDetails', () => {
  const mockRoute = {
    params: { id: '1' }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRoute as any).mockReturnValue(mockRoute)
  })

  it('displays a loading indicator while fetching data', async () => {
    vi.mocked(fetchTvShow).mockResolvedValue(generateTvShows(1)[0])

    const wrapper = mount(TvShowDetails)
    expect(wrapper.findComponent(LoadingIndicator).exists()).toBe(false)
    await nextTick()
    expect(wrapper.findComponent(LoadingIndicator).exists()).toBe(true)
    // TODO: Find out why there are 3 ticks required
    await nextTick()
    await nextTick()
    await nextTick()
    expect(wrapper.findComponent(LoadingIndicator).exists()).toBe(false)
  })

  it('renders the TvShow information when fetched successfully', async () => {
    const mockTvShow = generateTvShows(1)[0]
    vi.mocked(fetchTvShow).mockResolvedValue(mockTvShow)

    const wrapper = mount(TvShowDetails)
    await nextTick()
    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.title').text()).toBe(mockTvShow.name)
    expect(wrapper.find('.genres').text()).toContain(mockTvShow.genres.join(', '))
    expect(wrapper.find('.rating').text()).toBe(`Rating: ★${mockTvShow.rating.average}`)
    expect(wrapper.find('.summary').text()).toBe(stripHtml(mockTvShow.summary))
    expect(wrapper.find('img.tv-show-image').attributes('src')).toBe(mockTvShow.image.original)
    expect(wrapper.find(`a[href="${mockTvShow.url}"]`).exists()).toBe(true)
    expect(wrapper.find(`a[href="${mockTvShow.officialSite}"]`).exists()).toBe(true)
  })

  it('displays a placeholder image when no original image is available', async () => {
    const mockTvShow = generateTvShows(1)[0]
    mockTvShow.image = {}
    vi.mocked(fetchTvShow).mockResolvedValue(mockTvShow)

    const wrapper = mount(TvShowDetails)
    await nextTick()
    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('img.tv-show-image').attributes('src')).toBe(
      '/src/assets/movie-placeholder.webp'
    )
  })

  it('displays a message when no show is found for the given id', async () => {
    vi.mocked(fetchTvShow).mockResolvedValue(null)

    const wrapper = mount(TvShowDetails)
    await nextTick()
    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('No show with id 1.')
  })
})
