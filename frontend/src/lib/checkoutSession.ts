const DRAFT_KEY = 'tasty-fingers-checkout-draft';
const PENDING_ORDER_KEY = 'tasty-fingers-pending-order';

export function saveCheckoutDraft<T extends object>(data: T) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function loadCheckoutDraft<T extends object>(): T | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function savePendingOrder(orderNumber: string) {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, orderNumber);
  } catch {
    // ignore
  }
}

export function getPendingOrder(): string | null {
  try {
    return sessionStorage.getItem(PENDING_ORDER_KEY);
  } catch {
    return null;
  }
}

export function clearCheckoutSession() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    // ignore
  }
}
