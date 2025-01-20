"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const pxValue = (value) => {
    if (typeof value === 'number')
        return value;
    return parseInt(value.replace('px', ''), 10);
};
const getValue = (breakpoints, k, delta) => {
    let v = breakpoints[k];
    if (delta != null) {
        v = typeof v === 'number' ? v + delta : pxValue(v) + delta;
    }
    return typeof v === 'number' ? `${v}px` : v;
};
function useBreakpoints(breakpoints, options = {}) {
    const { strategy = 'min-width' } = options;
    const [matches, setMatches] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const mediaQueries = Object.keys(breakpoints).reduce((acc, k) => {
            const query = strategy === 'min-width'
                ? `(min-width: ${getValue(breakpoints, k)})`
                : `(max-width: ${getValue(breakpoints, k)})`;
            const mql = window.matchMedia(query);
            const handler = (e) => {
                setMatches((prev) => ({
                    ...prev,
                    [k]: e.matches,
                }));
            };
            mql.addEventListener('change', handler);
            setMatches((prev) => ({
                ...prev,
                [k]: mql.matches,
            }));
            return {
                ...acc,
                [k]: { mql, handler },
            };
        }, {});
        // Cleanup
        return () => {
            Object.values(mediaQueries).forEach(({ mql, handler }) => {
                mql.removeEventListener('change', handler);
            });
        };
    }, [breakpoints, strategy]);
    const api = (0, react_1.useMemo)(() => {
        const greaterOrEqual = (k) => matches[k] ?? false;
        const smallerOrEqual = (k) => matches[k] ?? false;
        const greater = (k) => {
            const query = `(min-width: ${getValue(breakpoints, k, 0.1)})`;
            return window.matchMedia(query).matches;
        };
        const smaller = (k) => {
            const query = `(max-width: ${getValue(breakpoints, k, -0.1)})`;
            return window.matchMedia(query).matches;
        };
        const between = (a, b) => {
            const query = `(min-width: ${getValue(breakpoints, a)}) and (max-width: ${getValue(breakpoints, b, -0.1)})`;
            return window.matchMedia(query).matches;
        };
        const current = () => {
            const points = Object.keys(breakpoints)
                .map((k) => [k, matches[k], pxValue(getValue(breakpoints, k))])
                .sort((a, b) => a[2] - b[2])
                .filter(([, matches]) => matches)
                .map(([k]) => k);
            return points;
        };
        const active = () => {
            const currentPoints = current();
            return currentPoints.length === 0
                ? ''
                : currentPoints[strategy === 'min-width' ? currentPoints.length - 1 : 0];
        };
        // Create shortcut methods
        const shortcuts = Object.keys(breakpoints).reduce((acc, k) => ({
            ...acc,
            [k]: strategy === 'min-width'
                ? greaterOrEqual(k)
                : smallerOrEqual(k),
        }), {});
        return {
            ...shortcuts,
            greaterOrEqual,
            smallerOrEqual,
            greater,
            smaller,
            between,
            current,
            active,
        };
    }, [matches, breakpoints, strategy]);
    return api;
}
exports.default = useBreakpoints;
