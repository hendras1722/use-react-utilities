export function deleteDuplicate<T>(data: T[]): T[] {
  const seen = new Set()

  const uniqueData: T[] = []

  for (const item of data) {
    const itemString = JSON.stringify(item)

    if (!seen.has(itemString)) {
      seen.add(itemString)
      uniqueData.push(item)
    }
  }

  return uniqueData
}
