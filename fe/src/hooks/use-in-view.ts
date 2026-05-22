import { useEffect, useRef, useState } from "react";

export function useInViewOnce(margin = "-60px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);

  return { ref, inView };
}
