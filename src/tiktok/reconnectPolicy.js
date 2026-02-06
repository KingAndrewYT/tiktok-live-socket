export class ReconnectPolicy {
  constructor({ initialDelayMs, maxDelayMs, multiplier = 2 }) {
    this.initialDelayMs = initialDelayMs;
    this.maxDelayMs = maxDelayMs;
    this.multiplier = multiplier;
    this.attempt = 0;
  }

  nextDelayMs() {
    const delay = Math.min(
      this.initialDelayMs * this.multiplier ** this.attempt,
      this.maxDelayMs,
    );

    this.attempt += 1;

    return delay;
  }

  reset() {
    this.attempt = 0;
  }
}
