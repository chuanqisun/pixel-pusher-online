/**
ISC License (ISC)
Copyright (c) 2020, Mathis Bullinger <mathis@bullinger.dev>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR;
export type Fun = λ;

const { performance } = globalThis;
export const cancel = Symbol("throttle.cancel");

/**
 * Create a throttled function that invokes `fun` at most every `ms` milliseconds.
 *
 * `fun` is invoked with the last arguments passed to the throttled function.
 *
 * Calling `[throttle.cancel]()` on the throttled function will cancel the currently
 * scheduled invocation.
 */
export const throttle = Object.assign(
  (fun: λ, ms: number, { leading = true, trailing = true } = {}) => {
    let toId: any;
    let lastInvoke = -Infinity;
    let lastArgs: any[] | undefined;

    const invoke = () => {
      lastInvoke = performance.now();
      toId = undefined;
      fun(...lastArgs!);
    };

    return Object.assign(
      (...args: any[]) => {
        if (!leading && !trailing) return;
        lastArgs = args;
        const dt = performance.now() - lastInvoke;

        if (dt >= ms && toId === undefined && leading) invoke();
        else if (toId === undefined && trailing) {
          toId = setTimeout(invoke, dt >= ms ? ms : ms - dt);
        }
      },
      { [cancel]: () => clearTimeout(toId) }
    );
  },
  { cancel }
) as (<T extends λ>(fun: T, ms: number, opts?: { leading?: boolean; trailing: boolean }) => λ<Parameters<T>, void> & { [cancel](): void }) & {
  cancel: typeof cancel;
};
