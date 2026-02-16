import crypto from 'node:crypto';

const ALG = 'aes-256-gcm';
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

/**
 * Encrypt plaintext with AES-256-GCM. Key must be 32 bytes.
 * Returns base64(iv + authTag + ciphertext), or null if plaintext is empty.
 */
export function encryptTouchField(plaintext: string | undefined, key: Buffer): string | null {
  if (plaintext == null || plaintext === '') return null;
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALG, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

/**
 * Decrypt a value produced by encryptTouchField. Key must be 32 bytes.
 */
export function decryptTouchField(
  ciphertext: string | null | undefined,
  key: Buffer,
): string | null {
  if (ciphertext == null || ciphertext === '') return null;
  try {
    const buf = Buffer.from(ciphertext, 'base64');
    if (buf.length < IV_LEN + AUTH_TAG_LEN) return null;
    const iv = buf.subarray(0, IV_LEN);
    const authTag = buf.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
    const encrypted = buf.subarray(IV_LEN + AUTH_TAG_LEN);
    const decipher = crypto.createDecipheriv(ALG, key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8');
  } catch {
    return null;
  }
}

/** Parse TOUCH_MESSAGE_ENCRYPTION_KEY (64 hex chars = 32 bytes) into a Buffer, or null if invalid. */
export function parseEncryptionKey(key: string | undefined): Buffer | null {
  if (!key || key.length !== 64 || !/^[0-9a-fA-F]+$/.test(key)) return null;
  return Buffer.from(key, 'hex');
}
