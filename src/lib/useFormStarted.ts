import { useEffect, useState } from 'react';
import { trackEvent } from './amplitude';

export const useFormStarted = (formName: string, journeyName?: string) => {
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            if (!started) {
                trackEvent('Form Started', {
                    form_name: formName,
                    ...(journeyName && { journey_name: journeyName })
                });
                setStarted(true);
            }
        };

        const formElements = document.querySelectorAll('form input, form select, form textarea');
        formElements.forEach(el => {
            el.addEventListener('focus', handleInteraction, { once: true });
            el.addEventListener('change', handleInteraction, { once: true });
        });

        return () => {
            formElements.forEach(el => {
                el.removeEventListener('focus', handleInteraction);
                el.removeEventListener('change', handleInteraction);
            });
        };
    }, [started, formName, journeyName]);

    return started;
};
