export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export function validateTrail({ name, location, difficulty, length, imageUrl, description }) {
  if (name.trim().length < 3) return 'Name must be at least 3 characters.'
  if (!location.trim()) return 'Location is required.'
  if (!DIFFICULTIES.includes(difficulty)) return 'Please choose a difficulty.'
  if (!(Number(length) > 0)) return 'Length must be a number greater than 0.'
  if (!/^https?:\/\//.test(imageUrl)) return 'Image URL must start with http:// or https://'
  if (description.trim().length < 10) return 'Description must be at least 10 characters.'
  return ''
}