export const encouragementPhrases = [
  "Storm's clearing.",
  "Done is allowed.",
  "You don't owe anyone 24/7 access.",
  "Relax. That's tomorrow's problem.",
  "Honest > perfect.",
  "You're allowed to stop here.",
  "Say it ugly, not pretty.",
  "It's fine if today was 4/10. 4 is data.",
  "One less cloud.",
  "Brain's getting clearer.",
];

export const taskDropMessages = [
  "One less cloud.",
  "Brain's getting clearer.",
  "Done is allowed.",
  "That's one thing handled.",
  "Storm's clearing.",
];

export const reflectionPlaceholders = {
  yes: "make hard choices",
  no: "don't overthink it",
  feelings: "three words, no pressure",
  tomorrow: "what to do",
};

export const habitLabels = {
  slept: "Slept 8+ hrs",
  ate: "Ate good got enough protein",
  trained: "Trained with intent",
  water: "Fill up water begin day, check where you're at now",
  timeRespect: "Time mgmt",
  noScroll: "No rotting don't bum (phone control)",
};

export const getRandomPhrase = (phrases: string[]): string => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

