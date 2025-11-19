import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

type StoreState = Record<string, any>;

interface UseUrlSyncOptions {
  /** Keys to sync with URL params */
  keys: string[];
  /** Transform function for values before setting in URL */
  transform?: (key: string, value: any) => string | null;
}

/**
 * Syncs store state with URL query parameters
 * @param store - Zustand store state
 * @param options - Configuration options
 */
export function useUrlSync(store: StoreState, options: UseUrlSyncOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const previousUrlRef = useRef<string>("");

  useEffect(() => {
    const params = new URLSearchParams();

    // Build URL params from store state
    options.keys.forEach((key) => {
      const value = store[key];

      // Apply custom transform if provided
      const transformedValue = options.transform
        ? options.transform(key, value)
        : defaultTransform(value);

      if (transformedValue !== null && transformedValue !== "") {
        params.set(key, transformedValue);
      }
    });

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    // Only update if URL has actually changed
    if (newUrl !== previousUrlRef.current) {
      previousUrlRef.current = newUrl;
      router.replace(newUrl, { scroll: false });
    }
  }, [router, pathname, store, options.keys, options.transform]);
}

/**
 * Default transform function for common value types
 */
function defaultTransform(value: any): string | null {
  // Skip default/empty values
  if (value === undefined || value === null || value === "" || value === "ALL" || value === "all") {
    return null;
  }

  // Convert booleans to strings
  if (typeof value === "boolean") {
    return value.toString();
  }

  // Convert numbers to strings
  if (typeof value === "number") {
    return value.toString();
  }

  // Return strings as-is
  if (typeof value === "string") {
    return value;
  }

  // Skip objects and arrays
  return null;
}

/**
 * Initialize store from URL search params
 * @param searchParams - Next.js searchParams object
 * @param defaults - Default values for store
 */
export function initFromSearchParams<T extends StoreState>(
  searchParams: URLSearchParams,
  defaults: T
): Partial<T> {
  const state: Partial<T> = {};

  Object.keys(defaults).forEach((key) => {
    const urlValue = searchParams.get(key);
    const defaultValue = defaults[key];

    if (urlValue !== null) {
      state[key as keyof T] = parseUrlValue(urlValue, defaultValue) as T[keyof T];
    }
  });

  return state;
}

/**
 * Parse URL value based on the type of the default value
 */
function parseUrlValue(urlValue: string, defaultValue: any): any {
  // Boolean values
  if (typeof defaultValue === "boolean") {
    return urlValue === "true";
  }

  // Number values
  if (typeof defaultValue === "number") {
    const num = Number(urlValue);
    return isNaN(num) ? defaultValue : num;
  }

  // String values (including special cases like "ALL")
  return urlValue;
}
