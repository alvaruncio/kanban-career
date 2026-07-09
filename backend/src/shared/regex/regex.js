export const RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    COMPLEXITY: [
      { regex: /[A-Z]/, message: '1 mayúscula' },
      { regex: /[a-z]/, message: '1 minúscula' },
      { regex: /[0-9]/, message: '1 número' },
      { regex: /[^A-Za-z0-9]/, message: '1 símbolo' },
    ],
  },
  NAME: {
    MIN_LENGTH: 3,
  },
}
