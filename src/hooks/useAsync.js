import React from 'react'

/**
 * A custom hook for retrieving asynchronous data.
 *
 * @param {Function} asyncFunction - An asynchronous function that performs a fetch or other async task.
 * @param {Array} deps - Dependency array for when to rerun the fetch.
 *
 * @returns {Object} An object with { data, loading, error }.
 */
export function useAsync (asyncFunction, deps = []) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        let isMounted = true

            ; (async () => {
                setLoading(true);
                setError(null);
                try {
                    const result = await asyncFunction();
                    if (isMounted) {
                        setData(result);
                    }
                } catch (err) {
                    if (isMounted) {
                        setError(err);
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            })();

        return () => {
            isMounted = false;
        };
    }, deps);

    return { data, loading, error };
}
