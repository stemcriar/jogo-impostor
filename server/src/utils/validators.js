export function validateGameConfig({ totalPlayers, impostorCount }) {
  if (totalPlayers < 3) return { valid: false, error: 'Total players must be at least 3.' };
  if (impostorCount < 1) return { valid: false, error: 'Must have at least 1 impostor.' };
  if (totalPlayers < impostorCount + 2) return { valid: false, error: 'Total players must be >= impostors + 2.' };
  return { valid: true };
}
