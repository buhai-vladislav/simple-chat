export const getFullDate = (date: string): { date: string; time: string } => {
  return {
    date: new Date(date).toDateString(),
    time: `${new Date(date).getHours()}:${new Date(date).getMinutes()}`,
  };
};
