import { randomBytes } from 'crypto'

export function generatePassword(length = 20): string {
  return randomBytes(length * 2)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length)
}
