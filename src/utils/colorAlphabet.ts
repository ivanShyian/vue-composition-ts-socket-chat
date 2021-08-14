const colorMap: {
  [key: string]: string
} = {
  A: 'bg-indigo-400',
  B: 'bg-gray-700',
  C: 'bg-yellow-200',
  D: 'bg-indigo-900',
  E: 'bg-yellow-500',
  F: 'bg-emerald-600',
  G: 'bg-indigo-600',
  H: 'bg-red-500',
  I: 'bg-emerald-300',
  J: 'bg-blue-200',
  K: 'bg-emerald-500',
  L: 'bg-indigo-500',
  M: 'bg-indigo-600',
  N: 'bg-red-700',
  O: 'bg-yellow-800',
  P: 'bg-blue-400',
  Q: 'bg-yellow-700',
  R: 'bg-blue-600',
  S: 'bg-yellow-900',
  T: 'bg-blue-500',
  V: 'bg-indigo-300',
  U: 'bg-red-100',
  W: 'bg-blue-300',
  X: 'bg-yellow-400',
  Y: 'bg-gray-900',
  Z: 'bg-pink-400'
}
export const getColorByWord = (word: string): string => word ? colorMap[extractFirstLetterFromWord(word).toUpperCase()] : ''

const extractFirstLetterFromWord = (word: string) => word[0]
