"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NativeAdSlot } from "./native-ad-slot";
import { ResponsiveBannerAd } from "./responsive-banner-ad";

export function FixedAdPortals() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [hosts, setHosts] = useState<{ banner: Element; native: Element } | null>(null);

  useEffect(() => {
    const markup = anchorRef.current?.previousElementSibling;
    const banner = markup?.querySelector("[data-fixed-banner-host]");
    const native = markup?.querySelector("[data-fixed-native-host]");
    if (banner && native) setHosts({ banner, native });
  }, []);

  return (
    <>
      {hosts ? createPortal(<ResponsiveBannerAd />, hosts.banner) : null}
      {hosts ? createPortal(<NativeAdSlot />, hosts.native) : null}
      <span ref={anchorRef} hidden data-fixed-ad-anchor />
    </>
  );
}
