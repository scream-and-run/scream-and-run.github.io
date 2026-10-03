"use client";

import { useEffect, useState } from "react";

// The GET CODE inside each frame is kept verbatim. The frame contains any
// document.write performed by Adsterra's invoke.js after client hydration.
const desktopCode = `<script>
  atOptions = {
    'key' : '928ac2fa1432357b98961b396e19b57a',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/928ac2fa1432357b98961b396e19b57a/invoke.js"></script>`;

const mobileCode = `<script>
  atOptions = {
    'key' : '977d9c80c9de50b5e0f727c542abb641',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/977d9c80c9de50b5e0f727c542abb641/invoke.js"></script>`;

export function ResponsiveBannerAd() {
  const [size, setSize] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    // Choose once per page mount so a resize cannot run both GET CODEs.
    const timer = window.setTimeout(() => {
      setSize(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <aside className="ad-placement ad-placement-banner" aria-label="Advertisement" data-ad-banner-slot>
      <span className="ad-label">Advertisement</span>
      <div className="ad-banner-frame-wrap">
        {size ? (
          <iframe
            title="Advertisement"
            srcDoc={`<!doctype html><html><head><style>html,body{margin:0;overflow:hidden}</style></head><body>${size === "mobile" ? mobileCode : desktopCode}</body></html>`}
            width={size === "mobile" ? 320 : 728}
            height={size === "mobile" ? 50 : 90}
            scrolling="no"
            className="ad-banner-frame"
          />
        ) : null}
      </div>
    </aside>
  );
}
