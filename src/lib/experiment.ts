// @ts-ignore
import { Experiment } from '@amplitude/experiment-js-client';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from 'react';

const DEPLOYMENT_KEY = import.meta.env.VITE_AMPLITUDE_DEPLOYMENT_KEY;

export const experiment = Experiment.initializeWithAmplitudeAnalytics(
    DEPLOYMENT_KEY || 'dummy_key',
    { fetchOnStart: true, automaticExposureTracking: true }
);

export function useFeatureFlag(flagKey: string, defaultValue: string | boolean = 'control') {
    const [variant, setVariant] = useState(defaultValue);

    useEffect(() => {
        if (!DEPLOYMENT_KEY || DEPLOYMENT_KEY === 'YOUR_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY') {
            return;
        }
        const val = experiment.variant(flagKey);
        if (val && val.value) {
            setVariant(val.value);
        }
    }, [flagKey]);

    return variant;
}
