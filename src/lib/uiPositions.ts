// simple shared mutable store
export const uiPositions = {
  selectedCoinRect: null as DOMRect | null,
  cabinRects: {} as Record<number, DOMRect>,
};
