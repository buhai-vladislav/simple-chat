export const getFullDate = (date: string): { date: string; time: string } => {
  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();
  return {
    date: new Date(date).toDateString(),
    time: `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`,
  };
};
