export const SESSION_EXPIRED_EVENT =
  "sistema-vendas:session-expired";

export function dispararSessaoExpirada() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(SESSION_EXPIRED_EVENT)
  );
}

export function observarSessaoExpirada(
  callback: () => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(
    SESSION_EXPIRED_EVENT,
    callback
  );

  return () => {
    window.removeEventListener(
      SESSION_EXPIRED_EVENT,
      callback
    );
  };
}
