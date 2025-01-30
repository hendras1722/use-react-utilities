import { useState, useEffect } from 'react';
export function useObjectUrl(object) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        // Release the previous object URL if it exists
        if (url) {
            URL.revokeObjectURL(url);
        }
        // Create new object URL if object exists
        if (object) {
            const newUrl = URL.createObjectURL(object);
            setUrl(newUrl);
        }
        else {
            setUrl(null);
        }
        // Cleanup function to revoke object URL when component unmounts
        // or when object changes
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [object]); // Re-run effect when object changes
    return url;
}
