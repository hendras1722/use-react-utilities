interface UseBase64Options {
    dataUrl?: boolean;
}
interface UseBase64Return {
    base64: string;
    loading: boolean;
    error: Error | null;
    execute: () => Promise<string>;
}
declare function useBase64(target: string | Blob | ArrayBuffer | HTMLCanvasElement | HTMLImageElement, options?: UseBase64Options): UseBase64Return;
export default useBase64;
