"use client";

import { useEffect, useRef } from "react";

export function TideTimesWidget({
  scriptSrc,
  cssHref,
}: {
  scriptSrc: string;
  cssHref: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const existingCss = document.querySelector(
      `link[data-tidetimes-css="${cssHref}"]`,
    );
    if (!existingCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      link.setAttribute("data-tidetimes-css", cssHref);
      document.head.appendChild(link);
    }

    const originalWrite = document.write.bind(document);
    document.write = ((markup?: string) => {
      if (typeof markup === "string") {
        container.insertAdjacentHTML("beforeend", markup);
      }
    }) as typeof document.write;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;

    const restoreWrite = () => {
      document.write = originalWrite;
    };

    script.addEventListener("load", restoreWrite);
    script.addEventListener("error", restoreWrite);
    container.appendChild(script);

    return () => {
      restoreWrite();
      script.remove();
      container.replaceChildren();
    };
  }, [cssHref, scriptSrc]);

  return (
    <div
      ref={containerRef}
      className="mt-4 overflow-x-auto [&_.tidetimes-widget]:mx-auto [&_.tidetimes-widget]:w-full [&_.tidetimes-widget]:max-w-full"
    />
  );
}
