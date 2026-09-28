import { describe, expect, it } from 'vitest'
import { EMAIL_REGEX } from './regex'

describe('EMAIL_REGEX', () => {
  it.each([
    'user@example.com',
    'first.last@domain.co',
    'user+tag@subdomain.example.org',
    '12345@numbers.net',
    'user_name@domain.info',
    'user-name@domain.io',
    'USER@EXAMPLE.COM',
    'a%b+c_d.e@domain.travel',
  ])('matches valid email address: %s', (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(true)
  })

  it.each([
    '',
    'userexample.com',
    'user@',
    '@example.com',
    'user@example',
    'user@example.c',
    'user name@example.com',
    'user@exam ple.com',
    'user@@example.com',
    'user@domain@example.com',
  ])('rejects invalid email address: %s', (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(false)
  })
})
