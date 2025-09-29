export const colorFromName = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return 'hsl(' + (hash % 360) + ', ' + 30 + '%, ' + 80 + '%)'
}
