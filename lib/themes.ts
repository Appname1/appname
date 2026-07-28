export interface Theme {
  key: string
  name: string
  paper: string
  canvas: string
  ink: string
  muted: string
  border: string
  white: string
  tagBg: string
  onInk: string
  accent: string
  accentDark: string
  accentBg: string
  green: string
  greenDark: string
  greenBg: string
  greenBorder: string
  isDark: boolean
}

export const THEMES: Theme[] = [
  { key: 'original', name: 'Original — Ochre & Forest', paper: '#FAF9F6', canvas: '#EDEBE3', ink: '#141312', muted: '#6b6a66', border: '#E4E2DA', white: '#FFFFFF', tagBg: '#F0EDE6', onInk: '#EDEBE3', accent: '#B8860B', accentDark: '#412402', accentBg: '#FAEEDA', green: '#2C4A3E', greenDark: '#173404', greenBg: '#EAF3DE', greenBorder: '#C0DD97', isDark: false },
  { key: 'sage', name: 'Sage & Cream', paper: '#FAF8F3', canvas: '#F0ECE2', ink: '#1A1A1A', muted: '#6E6B62', border: '#E3DFD3', white: '#FFFFFF', tagBg: '#EFEAE0', onInk: '#EDEBE3', accent: '#6E9B6E', accentDark: '#2F4A2F', accentBg: '#DCEAD4', green: '#6E9B6E', greenDark: '#2F4A2F', greenBg: '#DCEAD4', greenBorder: '#B7D3AC', isDark: false },
  { key: 'powderblue', name: 'Powder Blue & Linen', paper: '#F7F7F4', canvas: '#EBEBE6', ink: '#141B2E', muted: '#666A73', border: '#DEDEDA', white: '#FFFFFF', tagBg: '#EAEAE6', onInk: '#EDEBE3', accent: '#8CAFD6', accentDark: '#22354F', accentBg: '#DCE7F5', green: '#8CAFD6', greenDark: '#22354F', greenBg: '#DCE7F5', greenBorder: '#B9CFE8', isDark: false },
  { key: 'blush', name: 'Blush & Warm White', paper: '#FBF6F2', canvas: '#F0E6E0', ink: '#1E1414', muted: '#7A6E6A', border: '#E9DAD5', white: '#FFFFFF', tagBg: '#F3E4E1', onInk: '#EDEBE3', accent: '#D08B93', accentDark: '#5C2A2E', accentBg: '#F7DEE1', green: '#D08B93', greenDark: '#5C2A2E', greenBg: '#F7DEE1', greenBorder: '#E9BCC1', isDark: false },
  { key: 'honeyoat', name: 'Honey & Oat', paper: '#FAF6EC', canvas: '#EFE6D3', ink: '#1E1912', muted: '#7A7060', border: '#E6DBC3', white: '#FFFFFF', tagBg: '#F1E5CE', onInk: '#EDEBE3', accent: '#D2A24E', accentDark: '#5A431C', accentBg: '#F1E0BB', green: '#D2A24E', greenDark: '#5A431C', greenBg: '#F1E0BB', greenBorder: '#E3C583', isDark: false },
  { key: 'seafoam', name: 'Seafoam & Sand', paper: '#F5FAF7', canvas: '#E7EFE9', ink: '#131E1A', muted: '#647169', border: '#DCE7E1', white: '#FFFFFF', tagBg: '#E4EFE9', onInk: '#EDEBE3', accent: '#5FAF97', accentDark: '#1F4A3B', accentBg: '#D8F0E7', green: '#5FAF97', greenDark: '#1F4A3B', greenBg: '#D8F0E7', greenBorder: '#A9DBC8', isDark: false },
  { key: 'peachvanilla', name: 'Peach & Vanilla', paper: '#FCF7EE', canvas: '#F0E5D3', ink: '#221A12', muted: '#7D7061', border: '#EBDCC4', white: '#FFFFFF', tagBg: '#F5E5CD', onInk: '#EDEBE3', accent: '#E0985C', accentDark: '#5C3616', accentBg: '#F8E0C7', green: '#E0985C', greenDark: '#5C3616', greenBg: '#F8E0C7', greenBorder: '#EFC79A', isDark: false },
  { key: 'slatefog', name: 'Slate & Fog', paper: '#F6F7F8', canvas: '#E8EAEC', ink: '#171A1E', muted: '#686E77', border: '#DDE1E6', white: '#FFFFFF', tagBg: '#E9EBED', onInk: '#EDEBE3', accent: '#7E8CA3', accentDark: '#2C3646', accentBg: '#DEE2E9', green: '#7E8CA3', greenDark: '#2C3646', greenBg: '#DEE2E9', greenBorder: '#B9C2D0', isDark: false },
  { key: 'terracottabone', name: 'Terracotta Pastel & Bone', paper: '#FAF5EF', canvas: '#EEE2D3', ink: '#1E1712', muted: '#7C6F62', border: '#E7DAC8', white: '#FFFFFF', tagBg: '#F2E3D3', onInk: '#EDEBE3', accent: '#C17E5F', accentDark: '#502F1E', accentBg: '#F3DED0', green: '#C17E5F', greenDark: '#502F1E', greenBg: '#F3DED0', greenBorder: '#E2B79E', isDark: false },
  { key: 'terracotta', name: 'Terracotta & Olive', paper: '#FBF6EF', canvas: '#F1E9DC', ink: '#241C15', muted: '#7A6F60', border: '#E6DACB', white: '#FFFFFF', tagBg: '#F1E4D4', onInk: '#F6DFCF', accent: '#C4622D', accentDark: '#4A2211', accentBg: '#F6DFCF', green: '#6B7A3A', greenDark: '#2E3617', greenBg: '#E9EEDA', greenBorder: '#C7D19B', isDark: false },
  { key: 'inkblue', name: 'Ink Blue & Sage', paper: '#F7F8F5', canvas: '#E9EAE4', ink: '#14181F', muted: '#666C63', border: '#DDE0D8', white: '#FFFFFF', tagBg: '#E4E7DF', onInk: '#DCE2EC', accent: '#2B3A55', accentDark: '#0F1725', accentBg: '#DCE2EC', green: '#7A8B69', greenDark: '#333B29', greenBg: '#E7ECDF', greenBorder: '#C4D0B5', isDark: false },
  { key: 'plumgold', name: 'Plum & Gold', paper: '#FAF7F8', canvas: '#EFE7EA', ink: '#211018', muted: '#7A6A72', border: '#E7DBE1', white: '#FFFFFF', tagBg: '#EFE1E9', onInk: '#EAD9E5', accent: '#6B2D5C', accentDark: '#2E1027', accentBg: '#EAD9E5', green: '#C9A227', greenDark: '#4A3B0E', greenBg: '#F3ECD3', greenBorder: '#E4D08F', isDark: false },
  { key: 'rustteal', name: 'Rust & Teal', paper: '#F8F5F1', canvas: '#EDE7DD', ink: '#1E1A17', muted: '#7A7166', border: '#E2D9CA', white: '#FFFFFF', tagBg: '#EFE6D8', onInk: '#F2D9D0', accent: '#A6432A', accentDark: '#3D1810', accentBg: '#F2D9D0', green: '#1F6F6B', greenDark: '#0C2B29', greenBg: '#D9EEEC', greenBorder: '#9BD4CF', isDark: false },
  { key: 'coral', name: 'Charcoal & Coral', paper: '#F6F4F1', canvas: '#EAE7E1', ink: '#17181A', muted: '#6E7076', border: '#DCDAD4', white: '#FFFFFF', tagBg: '#E4E2DC', onInk: '#DDE3EA', accent: '#D9705B', accentDark: '#4A231A', accentBg: '#F6DFD8', green: '#35495E', greenDark: '#141C26', greenBg: '#DDE3EA', greenBorder: '#AFC0D0', isDark: false },
  { key: 'forestnight', name: 'Forest Night (dark)', paper: '#20241E', canvas: '#171A15', ink: '#F1EFE6', muted: '#A8AA9E', border: '#343A2E', white: '#2A2E24', tagBg: '#2C3226', onInk: '#F1EFE6', accent: '#8AA678', accentDark: '#101408', accentBg: '#33422C', green: '#C98A3B', greenDark: '#1B1305', greenBg: '#4A3A22', greenBorder: '#6E5A34', isDark: true },
  { key: 'berrymint', name: 'Berry & Mint (dark)', paper: '#221A1E', canvas: '#191315', ink: '#F3EDEE', muted: '#B0A0A4', border: '#3A2E32', white: '#2B2226', tagBg: '#2E2528', onInk: '#F3EDEE', accent: '#C9527A', accentDark: '#12070A', accentBg: '#472532', green: '#4E9E82', greenDark: '#0C1F17', greenBg: '#274A3B', greenBorder: '#3C6E5A', isDark: true },
]

export function getTheme(key: string): Theme {
  return THEMES.find((t) => t.key === key) ?? THEMES[0]
}