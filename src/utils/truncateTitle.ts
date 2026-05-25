export const truncateTitle = (
  title: string | undefined | null,
  maxLength = 20,
): string => {
  // اگر title مقدار نداشت، یک رشته خالی برگردان تا برنامه به خطا نخورد
  const safeTitle = title ?? "";

  if (safeTitle.length <= maxLength) return safeTitle;
  return `${safeTitle.slice(0, maxLength)}...`;
};
