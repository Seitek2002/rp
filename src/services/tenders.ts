import type { TenderList } from '../types/tender';

const DEFAULT_API_BASE = '';
const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;
const TENDERS_ENDPOINT = '/api/v1/tenders/';

export interface FetchTendersOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Fetch tenders from API with timeout and abort support
 */
export async function fetchTenders({
  signal,
  timeoutMs = 15000,
}: FetchTendersOptions = {}): Promise<TenderList> {
  const controller = new AbortController();

  // Propagate upstream abort to local controller
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }
  }

  // Timeout handling
  const timeoutId = setTimeout(() => {
    try {
      controller.abort(new DOMException('Request timed out', 'TimeoutError'));
    } catch {
      // ignore
    }
  }, timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${TENDERS_ENDPOINT}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      // Try to extract body for debugging (if available)
      let body = '';
      try {
        body = await res.text();
      } catch {
        // ignore
      }
      throw new Error(
        `API error: ${res.status} ${res.statusText}${body ? ` - ${body}` : ''}`
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('Неверный формат ответа API: ожидался массив');
    }

    return data as TenderList;
  } catch (err: unknown) {
    // Normalize error messages
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Запрос был отменен');
    }
    const message =
      err instanceof Error
        ? err.message
        : 'Неизвестная ошибка при запросе тендеров';
    throw new Error(message);
  } finally {
    clearTimeout(timeoutId);
  }
}
