"use client";

import { useEffect, useState } from "react";

/**
 * Hook to safely handle hydration mismatches between server and client rendering
 * Returns true once the component has hydrated on the client side
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Convenient hook to handle conditional rendering based on hydration state
 * Provides a way to render different content on server vs client
 */
export function useClientHydration<T>({
  clientContent,
  serverContent,
}: {
  clientContent: T;
  serverContent: T;
}): T {
  const isHydrated = useHydration();

  return isHydrated ? clientContent : serverContent;
}

/**
 * Component that conditionally renders client vs server content
 * to prevent hydration mismatch errors
 */
export function HydrationGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return fallback;
  }

  return children;
}
