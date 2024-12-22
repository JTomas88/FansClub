
// src/serviceWorkerRegistration.js
export function register(config) {
    if ('serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (process.env.NODE_ENV === 'production') {
                navigator.serviceWorker.register(swUrl).then((registration) => {
                    if (registration.waiting) {
                        config && config.onUpdate && config.onUpdate(registration);
                    }

                    registration.onupdatefound = () => {
                        if (registration.installing) {
                            registration.installing.onstatechange = () => {
                                if (registration.installing.state === 'installed') {
                                    if (navigator.serviceWorker.controller) {
                                        config && config.onUpdate && config.onUpdate(registration);
                                    } else {
                                        config && config.onSuccess && config.onSuccess(registration);
                                    }
                                }
                            };
                        }
                    };
                });
            }
        });
    }
}