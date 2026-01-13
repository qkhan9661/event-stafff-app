import { trpc } from '@/lib/client/trpc';

/**
 * Hook to get column labels for a page
 * Returns saved labels from the database, falling back to defaults
 */
export function useColumnLabels(page: string, defaults: Record<string, string>) {
    const { data: allLabels } = trpc.settings.getLabels.useQuery();

    // Merge saved labels with defaults
    const labels: Record<string, string> = { ...defaults };

    if (allLabels?.pages?.[page]) {
        const pageLabels = allLabels.pages[page];
        Object.keys(defaults).forEach((key) => {
            const savedValue = pageLabels[`columns.${key}`];
            if (savedValue) {
                labels[key] = savedValue;
            }
        });
    }

    return labels;
}
