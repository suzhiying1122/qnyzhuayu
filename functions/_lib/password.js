import { scryptAsync } from '@noble/hashes/scrypt.js';

const options = { N: 16384, r: 8, p: 5, dkLen: 32, maxmem: 32 * 1024 * 1024 };
const encoder = new TextEncoder();
const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (value) => Uint8Array.from(value.match(/../g), (v) => parseInt(v, 16));
const format = /^scrypt\$16384\$8\$5\$([a-f0-9]{32})\$([a-f0-9]{64})$/;

export function passwordValue(payload, key = 'password') {
  return typeof payload?.[key] === 'string' ? payload[key] : '';
}

export function validPassword(password) {
  return password.length >= 12 && password.length <= 128;
}

export function isPasswordHash(value) {
  return typeof value === 'string' && format.test(value);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await scryptAsync(encoder.encode(password), salt, options);
  return `scrypt$16384$8$5$${hex(salt)}$${hex(hash)}`;
}

export async function verifyPassword(password, stored) {
  // Unknown and disabled accounts perform the same KDF as valid accounts.
  const match = typeof stored === 'string' ? stored.match(format) : null;
  const salt = match ? unhex(match[1]) : new Uint8Array(16);
  const expected = match ? unhex(match[2]) : new Uint8Array(32);
  const actual = await scryptAsync(encoder.encode(password), salt, options);
  let difference = 0;
  for (let i = 0; i < actual.length; i++) difference |= actual[i] ^ expected[i];
  return Boolean(match) && difference === 0;
}
