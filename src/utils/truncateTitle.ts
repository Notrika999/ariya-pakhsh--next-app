export const truncateTitle = (title: string, maxLength = 20) => {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
};
