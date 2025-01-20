import { Locale } from 'date-fns';
export type DateLike = Date | number | string | undefined;
export interface UseDateFormatOptions {
    /**
     * The locale to be used for formatting
     * See date-fns documentation for available locales
     */
    locale?: Locale;
}
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
declare const useDateFormat: (date: DateLike, formatString?: string, options?: UseDateFormatOptions) => string;
declare const useRelativeDate: (date: DateLike, options?: UseDateFormatOptions) => string;
declare const useRelativeDateBetween: (date: DateLike, baseDate: DateLike, options?: UseDateFormatOptions) => string;
export { useDateFormat, useRelativeDate, useRelativeDateBetween };
