export const formatSeconds = (seconds: number): string => {
  seconds = seconds < 0 ? 0 : seconds;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? 0 : ""}${mins}:${secs < 10 ? 0 : ""}${secs}`;
};
