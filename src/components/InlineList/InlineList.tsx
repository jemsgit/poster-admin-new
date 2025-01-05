import React, { PropsWithChildren } from "react";

function InlineList(props: PropsWithChildren) {
  const { children } = props;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {children}
    </section>
  );
}

export default InlineList;
