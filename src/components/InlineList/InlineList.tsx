import { PropsWithChildren } from "react";
import useDesktopMode from "../../hooks/useDesktopMode";

function InlineList(props: PropsWithChildren) {
  const { children } = props;
  const isDesktop = useDesktopMode();

  return (
    <section
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {children}
    </section>
  );
}

export default InlineList;
