type SlideSeed = {
  brand: string
  category: 'data' | 'email' | 'media' | 'social' | 'storage' | 'voice'
  line: string
  order: number
  title: string
}

// Content ported 1:1 from the design handoff's carousel data.
export const slides: SlideSeed[] = [
  {
    title: 'Gmail',
    brand: 'Google',
    category: 'email',
    line: 'The inbox that reads you back. Two billion correspondents, one model of attention.',
    order: 1,
  },
  {
    title: 'Instagram',
    brand: 'Meta',
    category: 'social',
    line: 'A mirror trained on the self. The feed decides what a life should look like.',
    order: 2,
  },
  {
    title: 'Alexa',
    brand: 'Amazon',
    category: 'voice',
    line: 'A voice in the kitchen, always listening for its name — and everything else.',
    order: 3,
  },
  {
    title: 'iCloud',
    brand: 'Apple',
    category: 'storage',
    line: 'Every photograph you have ever taken, held somewhere you will never stand.',
    order: 4,
  },
  {
    title: 'TikTok',
    brand: 'ByteDance',
    category: 'media',
    line: 'The algorithm that learned boredom faster than we learned restraint.',
    order: 5,
  },
  {
    title: 'Chrome',
    brand: 'Google',
    category: 'data',
    line: 'The window is also the observer. Browsing as a biography, written for someone else.',
    order: 6,
  },
]
