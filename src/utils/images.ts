export const getImagePathByUrl = (url: string) => {
  return `${import.meta.env.BASE_URL || "/"}api/utils/static/${url}`;
};
