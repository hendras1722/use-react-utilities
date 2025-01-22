export default function useIdle(timeout?: number): {
    idle: boolean;
    lastActive: number;
    reset: () => void;
};
