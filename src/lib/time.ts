export const formatSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? 0 : ""}${mins}:${secs < 10 ? 0 : ""}${secs}`;
};

export const secondsStringToNumber = (secondsString: string): number | null => {
  if (secondsString.length === 0) {
    return null;
  }
  return parseInt(secondsString, 10);
};

export const minutesToSeconds = (minuteString: string): string => {
  const dict = {
    "1": "60",
    "5": "300"
  };
  return dict[minuteString];
};
