const STORAGE_KEY = 'lenormand.deviceId';

/** A random id persisted in localStorage so a device can retrieve its own reading history. No account, no PII. */
export function getDeviceId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
