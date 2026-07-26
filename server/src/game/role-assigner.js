export function assignRoles(totalPlayers, impostorCount) {
  const roles = {};
  const players = Array.from({ length: totalPlayers }, (_, i) => i + 1);
  
  // Shuffle players
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  const machines = players.slice(0, impostorCount);
  const humans = players.slice(impostorCount);

  machines.forEach(p => roles[p] = 'machine');
  humans.forEach(p => roles[p] = 'human');

  return roles;
}
