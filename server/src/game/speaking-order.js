export function generateSpeakingOrder(roles) {
  const humans = Object.keys(roles).filter(p => roles[p] === 'human').map(Number);
  const machines = Object.keys(roles).filter(p => roles[p] === 'machine').map(Number);

  // Shuffle arrays
  const shuffle = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  const shuffledHumans = shuffle(humans);
  const firstSpeaker = shuffledHumans.pop();
  const secondSpeaker = shuffledHumans.pop();

  const remaining = shuffle([...shuffledHumans, ...machines]);
  
  return [firstSpeaker, secondSpeaker, ...remaining];
}
