interface UseTimestampOptions<Controls extends boolean = false> {
    /**
     * Expose more controls
     *
     * @default false
     */
    controls?: Controls;
    /**
     * Offset value adding to the value
     *
     * @default 0
     */
    offset?: number;
    /**
     * Update the timestamp immediately
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * Update interval, or use requestAnimationFrame
     *
     * @default requestAnimationFrame
     */
    interval?: 'requestAnimationFrame' | number;
    /**
     * Callback on each update
     */
    callback?: (timestamp: number) => void;
}
interface Pausable {
    pause: () => void;
    resume: () => void;
    isActive: boolean;
}
declare function useTimestamp<Controls extends boolean = false>(options?: UseTimestampOptions<Controls>): Controls extends true ? {
    timestamp: number;
} & Pausable : number;
export type UseTimestampReturn = ReturnType<typeof useTimestamp>;
export default useTimestamp;
