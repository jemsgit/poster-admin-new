import useMediaQuery from "./useMediaQuery";

const useDesktopMode = () => {
  return useMediaQuery("(min-width: 820px)");
};

export default useDesktopMode;
