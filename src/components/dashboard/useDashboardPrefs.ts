"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hirely-personal-dashboard-v1";

export type ChartWidgetId = "line" | "bar" | "pie";

export type DashboardPrefs = {
  widgetOrder: ChartWidgetId[];
  hidden: ChartWidgetId[];
  compactCharts: boolean;
};

const DEFAULT_PREFS: DashboardPrefs = {
  widgetOrder: ["line", "bar", "pie"],
  hidden: [],
  compactCharts: false,
};

function mergePrefs(raw: unknown): DashboardPrefs {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFS;
  const o = raw as Record<string, unknown>;
  const order = o.widgetOrder;
  const hidden = o.hidden;
  const compact = o.compactCharts;
  const valid: ChartWidgetId[] = ["line", "bar", "pie"];
  let widgetOrder = DEFAULT_PREFS.widgetOrder;
  if (Array.isArray(order)) {
    const filtered = order.filter((x): x is ChartWidgetId =>
      valid.includes(x as ChartWidgetId),
    );
    const missing = valid.filter((id) => !filtered.includes(id));
    widgetOrder = [...filtered, ...missing];
  }
  return {
    widgetOrder,
    hidden: Array.isArray(hidden)
      ? hidden.filter((x): x is ChartWidgetId => valid.includes(x as ChartWidgetId))
      : [],
    compactCharts: typeof compact === "boolean" ? compact : false,
  };
}

export function useDashboardPrefs() {
  const [prefs, setPrefsState] = useState<DashboardPrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefsState(mergePrefs(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setPrefs = (next: DashboardPrefs) => {
    setPrefsState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggleHidden = (id: ChartWidgetId) => {
    setPrefs({
      ...prefs,
      hidden: prefs.hidden.includes(id)
        ? prefs.hidden.filter((x) => x !== id)
        : [...prefs.hidden, id],
    });
  };

  const moveWidget = (id: ChartWidgetId, dir: -1 | 1) => {
    const idx = prefs.widgetOrder.indexOf(id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= prefs.widgetOrder.length) return;
    const copy = [...prefs.widgetOrder];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setPrefs({ ...prefs, widgetOrder: copy });
  };

  return { prefs, hydrated, setPrefs, toggleHidden, moveWidget };
}
