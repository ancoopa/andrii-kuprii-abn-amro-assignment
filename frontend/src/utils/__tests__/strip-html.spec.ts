import { describe, it, expect } from 'vitest'
import { stripHtml } from '@/utils/strip-html'

describe('stripHtml', () => {
  it('removes HTML tags from a string', () => {
    const input = '<p>This is a <strong>test</strong> string.</p>'
    const output = 'This is a test string.'
    expect(stripHtml(input)).toBe(output)
  })

  it('returns an empty string if the input is an empty string', () => {
    const input = ''
    const output = ''
    expect(stripHtml(input)).toBe(output)
  })

  it('returns the same string if there are no HTML tags', () => {
    const input = 'This is a plain text string.'
    const output = 'This is a plain text string.'
    expect(stripHtml(input)).toBe(output)
  })

  it('removes multiple HTML tags correctly', () => {
    const input = '<div><p>This is <a href="#">a test</a> string.</p></div>'
    const output = 'This is a test string.'
    expect(stripHtml(input)).toBe(output)
  })

  it('removes self-closing HTML tags correctly', () => {
    const input = 'This is a test string with an image <img src="test.jpg" />'
    const output = 'This is a test string with an image '
    expect(stripHtml(input)).toBe(output)
  })

  it('removes nested HTML tags correctly', () => {
    const input = '<div><span><strong>Nested</strong> tags</span> example.</div>'
    const output = 'Nested tags example.'
    expect(stripHtml(input)).toBe(output)
  })

  it('handles malformed HTML gracefully', () => {
    const input = '<div><p>Malformed <span>HTML'
    const output = 'Malformed HTML'
    expect(stripHtml(input)).toBe(output)
  })
})
