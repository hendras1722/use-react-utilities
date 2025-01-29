interface UseAnimateOptions extends KeyframeAnimationOptions {
    immediate?: boolean;
    commitStyles?: boolean;
    persist?: boolean;
    onReady?: (animate: Animation) => void;
    onError?: (error: unknown) => void;
}
type UseAnimateKeyframes = Keyframe[] | PropertyIndexedKeyframes | null;
interface UseAnimateReturn {
    isSupported: boolean;
    animate: Animation | undefined;
    play: () => void;
    pause: () => void;
    reverse: () => void;
    finish: () => void;
    cancel: () => void;
    pending: boolean;
    playState: AnimationPlayState;
    replaceState: AnimationReplaceState;
    startTime: number | null;
    setStartTime: (time: number | null) => void;
    currentTime: number | null;
    setCurrentTime: (time: number | null) => void;
    timeline: AnimationTimeline | null;
    setTimeline: (timeline: AnimationTimeline | null) => void;
    playbackRate: number;
    setPlaybackRate: (rate: number) => void;
}
export default function useAnimate(target: React.RefObject<HTMLElement>, keyframes: UseAnimateKeyframes, options?: number | UseAnimateOptions): UseAnimateReturn;
export {};
