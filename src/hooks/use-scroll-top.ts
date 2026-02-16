/**
 * Custom hook for managing scroll-to-top functionality
 *
 * @param threshold - Scroll position (in pixels) at which to show the button
 * @returns Object with showButton state and scrollToTop function
 *
 * @example
 * ```tsx
 * const { showButton, scrollToTop } = useScrollTop(400)
 *
 * {showButton && (
 *   <Button onClick={scrollToTop}>Back to Top</Button>
 * )}
 * ```
 */

import { useState, useEffect } from "react";

interface UseScrollTopReturn {
  showButton: boolean;
  scrollToTop: () => void;
}

export function useScrollTop(threshold: number = 400): UseScrollTopReturn {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { showButton, scrollToTop };
}
