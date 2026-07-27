type BridgeMethod = "auth.open" | "device.haptic" | "navigation.close";

type BridgeRequest<T = unknown> = {
  version: 1;
  id: string;
  method: BridgeMethod;
  payload: T;
};

type BridgeResponse<T = unknown> = {
  version: 1;
  id: string;
  ok: boolean;
  result?: T;
  error?: { code: string; message: string };
};

const pending = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}>();

export function requestNative<TPayload, TResult>(
  method: BridgeMethod,
  payload: TPayload,
  timeoutMs = 5000,
): Promise<TResult> {
  const id = crypto.randomUUID();
  const message: BridgeRequest<TPayload> = { version: 1, id, method, payload };

  return new Promise<TResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Native bridge timeout: ${method}`));
    }, timeoutMs);

    pending.set(id, { resolve: resolve as (value: unknown) => void, reject, timer });

    // React Native WebView. 다른 네이티브 셸에서는 이 전송부만 교체한다.
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  });
}

export function receiveNative(raw: string) {
  const response = JSON.parse(raw) as BridgeResponse;
  if (response.version !== 1 || typeof response.id !== "string") return;

  const request = pending.get(response.id);
  if (!request) return;

  clearTimeout(request.timer);
  pending.delete(response.id);

  if (response.ok) request.resolve(response.result);
  else request.reject(new Error(response.error?.message ?? "Unknown native error"));
}

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage(message: string): void };
  }
}
