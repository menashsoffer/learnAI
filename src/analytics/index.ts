/**
 * Analytics is an interface with a Null default. No network sink is ever committed here
 * (invariant: the offline artifact phones home to nobody). Full sink selection lands in M6.
 */
export interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  ts: number;
}

export interface AnalyticsSink {
  track(event: string, data?: Record<string, unknown>): void;
  flush?(): void;
}

export const NullSink: AnalyticsSink = {
  track: () => {},
};

export const ConsoleSink: AnalyticsSink = {
  track: (event, data) => {
    if (import.meta.env.DEV) console.debug('[analytics]', event, data ?? {});
  },
};

export const defaultSink: AnalyticsSink = import.meta.env.DEV ? ConsoleSink : NullSink;
