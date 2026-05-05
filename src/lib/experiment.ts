// @ts-ignore
import { Experiment } from '@amplitude/experiment-js-client';
import { useEffect, useState } from 'react';

const DEPLOYMENT_KEY = import.meta.env.VITE_AMPLITUDE_DEPLOYMENT_KEY;
const isExperimentEnabled =
  !!DEPLOYMENT_KEY && DEPLOYMENT_KEY !== 'YOUR_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY';

// Only create a real client when a real deployment key is configured
let _experiment: any = null;

if (isExperimentEnabled) {
  _experiment = Experiment.initializeWithAmplitudeAnalytics(DEPLOYMENT_KEY!, {
    fetchOnStart: true,
    automaticExposureTracking: true,
    debug: !import.meta.env.PROD,
  });
}

export const experiment = _experiment;

/**
 * Force a variant fetch. Useful to call after identifyUser() so variants
 * targeted by user properties are refreshed.
 */
export const fetchExperiments = async () => {
  if (!_experiment) return;
  try {
    await _experiment.fetch();
  } catch (e) {
    console.warn('[Experiment] fetch failed', e);
  }
};

/**
 * Manually track exposure. Call this when the user actually SEES the variant
 * (not when it's read into state).
 */
export const trackExposure = (flagKey: string) => {
  if (!_experiment) return;
  try {
    _experiment.exposure(flagKey);
  } catch (e) {
    console.warn('[Experiment] exposure failed', e);
  }
};

/**
 * Simple hook — returns the variant value (or default until fetch completes).
 * Backwards-compatible signature.
 */
export function useFeatureFlag(
  flagKey: string,
  defaultValue: string | boolean = 'control'
): string | boolean {
  const { variant } = useExperiment(flagKey, defaultValue);
  return variant;
}

/**
 * Richer hook — returns variant value, optional payload, and isReady flag.
 */
export function useExperiment<T extends string | boolean = string>(
  flagKey: string,
  defaultValue: T = 'control' as T
): { variant: T; payload: unknown; isReady: boolean } {
  const [variant, setVariant] = useState<T>(defaultValue);
  const [payload, setPayload] = useState<unknown>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!_experiment) {
      setIsReady(true);
      return;
    }

    const read = () => {
      if (cancelled) return;
      const v = _experiment.variant(flagKey);
      if (v && v.value !== undefined) setVariant(v.value as T);
      if (v && v.payload !== undefined) setPayload(v.payload);
      setIsReady(true);
    };

    // Read immediately (fetch may already be done)
    read();
    // Re-read once fetch completes
    _experiment
      .fetch()
      .then(read)
      .catch(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [flagKey]);

  return { variant, payload, isReady };
}
