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
  yes: "say it ugly, not pretty",
  no: "don't overthink it",
  feelings: "three words, no pressure",
  tomorrow: "one thing you care about",
};

export const habitLabels = {
  slept: "Slept 7+ hrs",
  ate: "Ate like I care about myself",
  trained: "Trained or stretched",
  timeRespect: "Time respect (wasn't late, managed schedule)",
  noScroll: "No-scroll zone (phone control)",
};

export const getRandomPhrase = (phrases: string[]): string => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

