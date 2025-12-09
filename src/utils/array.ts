export const getRandomItem = <T>(arr: readonly T[]): T | undefined => {
  if (!arr.length) {
    return undefined;
  }
  const index = Math.floor(Math.random() * arr.length);

  return arr[index];
};
