"use client";

import { useEffect, useRef } from "react";

const containerId = "container-2679dff4845ab7e66cbc5ce02152750b";
const scriptUrl = "https://pl31582258.profitableratecpmnetwork.com/2679dff4845ab7e66cbc5ce02152750b/invoke.js";

export function NativeAdSlot() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    // Delay insertion by one task. React's development effect replay cancels
    // the first task instead of executing the third-party script twice.
    const timer = window.setTimeout(() => {
      if (!slot.isConnected || slot.querySelector("script")) return;
      const script = document.createElement("script");
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = scriptUrl;
      slot.insertBefore(script, slot.firstChild);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      slot.querySelector("script")?.remove();
      slot.querySelector(`#${containerId}`)?.replaceChildren();
    };
  }, []);

  return (
    <aside className="ad-placement ad-placement-native" aria-label="Advertisement" data-ad-native-slot>
      <span className="ad-label">Advertisement</span>
      <div ref={slotRef} className="ad-native-content">
        <div id={containerId} />
      </div>
    </aside>
  );
}
