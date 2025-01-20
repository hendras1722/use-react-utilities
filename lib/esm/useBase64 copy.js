import { useState, useEffect, useCallback } from 'react';
// Helper to process in chunks
const processInChunks = async (blob, chunkSize = 1024 * 1024) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let offset = 0;
        const reader = new FileReader();
        reader.onload = (e) => {
            chunks.push((e.target?.result).split(',')[1] || '');
            offset += chunkSize;
            if (offset >= blob.size) {
                // All chunks are processed
                resolve(`data:${blob.type};base64,${chunks.join('')}`);
            }
            else {
                // Process next chunk
                readNextChunk();
            }
        };
        reader.onerror = (e) => reject(e);
        const readNextChunk = () => {
            const chunk = blob.slice(offset, offset + chunkSize);
            reader.readAsDataURL(chunk);
        };
        readNextChunk();
    });
};
// Main hook
function useBase64(target, options) {
    const [base64, setBase64] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const execute = useCallback(async () => {
        if (!target) {
            setBase64('');
            return '';
        }
        setLoading(true);
        setError(null);
        try {
            let result;
            if (target instanceof Blob) {
                result = await processInChunks(target);
            }
            else if (typeof target === 'string') {
                result = await processInChunks(new Blob([target]));
            }
            else if (target instanceof ArrayBuffer) {
                result = await processInChunks(new Blob([target]));
            }
            else if (target instanceof HTMLCanvasElement) {
                const blob = await new Promise((resolve) => {
                    target.toBlob((b) => resolve(b));
                });
                result = await processInChunks(blob);
            }
            else if (target instanceof HTMLImageElement) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    throw new Error('Failed to get canvas context');
                canvas.width = target.width;
                canvas.height = target.height;
                ctx.drawImage(target, 0, 0);
                const blob = await new Promise((resolve) => {
                    canvas.toBlob((b) => resolve(b));
                });
                result = await processInChunks(blob);
            }
            else {
                throw new Error('Target is of unsupported type');
            }
            const finalResult = options?.dataUrl === false
                ? result.replace(/^data:.*?;base64,/, '')
                : result;
            setBase64(finalResult);
            setLoading(false);
            return finalResult;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            setError(error);
            setLoading(false);
            throw error;
        }
    }, [target, options]);
    useEffect(() => {
        execute().catch(() => { });
    }, [execute]);
    return {
        base64,
        loading,
        error,
        execute,
    };
}
export default useBase64;
