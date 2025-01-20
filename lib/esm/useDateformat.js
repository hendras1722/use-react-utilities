import { useMemo } from 'react';
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
const DATE_REGEX = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i;
/**
 * Normalizes various date input formats into a Date object
 */
const normalizeDate = (date) => {
    if (date === null) {
        return new Date(Number.NaN); // null is invalid
    }
    if (date === undefined) {
        return new Date();
    }
    if (date instanceof Date) {
        return new Date(date);
    }
    if (typeof date === 'string' && !/Z$/i.test(date)) {
        const matches = DATE_REGEX.exec(date);
        if (matches) {
            const [, year, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0,] = matches;
            return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Number(String(millisecond).substring(0, 3)));
        }
    }
    return new Date(date);
};
/**
 * React hook for formatting dates using date-fns
 *
 * @param date - The date to format (Date object, timestamp, or string)
 * @param formatString - date-fns format string
 * @param options - Formatting options including locale
 * @returns Formatted date string
 *
 * @example
 * ```tsx
 * const formattedDate = useDateFormat(new Date(), 'MM/dd/yyyy');
 * const formattedWithLocale = useDateFormat(new Date(), 'PPPP', { locale: fr });
 * ```
 */
const useDateFormat = (date, formatString = 'HH:mm:ss', options = {}) => {
    return useMemo(() => {
        const normalizedDate = normalizeDate(date);
        if (isNaN(normalizedDate.getTime())) {
            return '';
        }
        try {
            return format(normalizedDate, formatString, {
                locale: options.locale,
            });
        }
        catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    }, [date, formatString, options.locale]);
};
// Additional utility hooks built on top of date-fns
const useRelativeDate = (date, options = {}) => {
    return useMemo(() => {
        const normalizedDate = normalizeDate(date);
        if (isNaN(normalizedDate.getTime())) {
            return '';
        }
        try {
            return formatDistanceToNow(normalizedDate, {
                addSuffix: true,
                locale: options.locale,
            });
        }
        catch (error) {
            console.error('Error formatting relative date:', error);
            return '';
        }
    }, [date, options.locale]);
};
const useRelativeDateBetween = (date, baseDate, options = {}) => {
    return useMemo(() => {
        const normalizedDate = normalizeDate(date);
        const normalizedBaseDate = normalizeDate(baseDate);
        if (isNaN(normalizedDate.getTime()) ||
            isNaN(normalizedBaseDate.getTime())) {
            return '';
        }
        try {
            return formatDistance(normalizedDate, normalizedBaseDate, {
                addSuffix: true,
                locale: options.locale,
            });
        }
        catch (error) {
            console.error('Error formatting relative date between:', error);
            return '';
        }
    }, [date, baseDate, options.locale]);
};
export { useDateFormat, useRelativeDate, useRelativeDateBetween };
