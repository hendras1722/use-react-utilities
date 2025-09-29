export function deleteDuplicate(data) {
    const seen = new Set();
    const uniqueData = [];
    for (const item of data) {
        const itemString = JSON.stringify(item);
        if (!seen.has(itemString)) {
            seen.add(itemString);
            uniqueData.push(item);
        }
    }
    return uniqueData;
}
