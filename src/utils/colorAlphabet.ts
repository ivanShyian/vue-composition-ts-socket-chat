const colorMap: {
  [key: string]: string
} = {
  A: 'indigo-400',
  B: 'gray-700',
  C: 'yellow-200',
  D: 'indigo-900',
  E: 'yellow-500',
  F: 'emerald-600',
  G: 'indigo-600',
  H: 'red-500',
  I: 'emerald-300',
  J: 'blue-200',
  K: 'emerald-500',
  L: 'indigo-500',
  M: 'indigo-600',
  N: 'red-700',
  O: 'yellow-800',
  P: 'blue-400',
  Q: 'yellow-700',
  R: 'blue-600',
  S: 'yellow-900',
  T: 'blue-500',
  V: 'indigo-300',
  U: 'red-100',
  W: 'blue-300',
  X: 'yellow-400',
  Y: 'gray-900',
  Z: 'pink-400'
}
export const getColorByWord = (word: string) => word ? colorMap[extractFirstLetterFromWord(word).toUpperCase()] : ''

const extractFirstLetterFromWord = (word: string) => word[0]
