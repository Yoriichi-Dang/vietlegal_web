import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Custom hook that detects clicks outside of the specified element(s)
 * @param refs Reference(s) to the element(s) to detect clicks outside of
 * @param handler Function to call when a click outside is detected
 * @param enabled Optional flag to enable/disable the hook
 */
function useOutsideClick(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  handler: Handler,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Convert to array if single ref
      const refsArray = Array.isArray(refs) ? refs : [refs];

      // Check if click was outside all provided refs
      const isOutside = refsArray.every((ref) => {
        // If ref or ref.current is null, consider it "outside"
        if (!ref || !ref.current) return true;

        // Check if click target is inside the element
        return !ref.current.contains(event.target as Node);
      });

      if (isOutside) {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [refs, handler, enabled]);
}

export default useOutsideClick;
