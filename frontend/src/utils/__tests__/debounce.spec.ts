import { describe, it, expect, vi, beforeEach } from 'vitest'
import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should call the function after the specified wait time', () => {
    const mockFunc = vi.fn()
    const debouncedFunc = debounce(mockFunc, 500)

    debouncedFunc()
    expect(mockFunc).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(mockFunc).toHaveBeenCalledOnce()
  })

  it('should not call the function if called again before the wait time', () => {
    const mockFunc = vi.fn()
    const debouncedFunc = debounce(mockFunc, 500)

    debouncedFunc()
    vi.advanceTimersByTime(400)
    expect(mockFunc).not.toHaveBeenCalled()

    debouncedFunc()
    vi.advanceTimersByTime(100)
    expect(mockFunc).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(mockFunc).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(mockFunc).toHaveBeenCalledOnce()
  })

  it('should call the function with the correct arguments', () => {
    const mockFunc = vi.fn()
    const debouncedFunc = debounce(mockFunc, 500)

    debouncedFunc(1, 2, 3)
    vi.advanceTimersByTime(500)
    expect(mockFunc).toHaveBeenCalledWith(1, 2, 3)
  })

  it('should handle multiple calls and only execute the last one', () => {
    const mockFunc = vi.fn()
    const debouncedFunc = debounce(mockFunc, 500)

    debouncedFunc('first')
    vi.advanceTimersByTime(300)
    debouncedFunc('second')
    vi.advanceTimersByTime(300)
    debouncedFunc('third')

    vi.advanceTimersByTime(500)
    expect(mockFunc).toHaveBeenCalledOnce()
    expect(mockFunc).toHaveBeenCalledWith('third')
  })

  it('should reset the timer with each call within the wait time', () => {
    const mockFunc = vi.fn()
    const debouncedFunc = debounce(mockFunc, 500)

    debouncedFunc('first')
    vi.advanceTimersByTime(200)
    debouncedFunc('second')
    vi.advanceTimersByTime(200)
    debouncedFunc('third')
    vi.advanceTimersByTime(200)
    debouncedFunc('fourth')
    expect(mockFunc).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(mockFunc).toHaveBeenCalledOnce()
    expect(mockFunc).toHaveBeenCalledWith('fourth')
  })
})
