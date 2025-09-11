import * as React from "react";

/**
 * Interactive geometric grid ("flag") used on the landing page.
 * - Decorative only (non-focusable)
 * - Uses system motion + pointer media queries
 * - Colors: evenly distributed (1/3 each) then shuffled so placement changes on every load
 */
export const Flag: React.FC = () => {
  // Grid + motion constants
  const cols = 10;
  const rows = 5;
  const strength = 30; // stronger rotation like original
  const ease = 0.12;   // smoother but responsive

  const fieldRef = React.useRef<HTMLElement | null>(null);
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const field = fieldRef.current;
    const grid = gridRef.current;
    if (!field || !grid) return;

    // Build grid structure
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    grid.style.gridAutoRows = "1fr";

    // Clear any existing children (hot reload safety)
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    // Prepare shuffled color assignments with equal thirds
    const total = cols * rows;
    const colors: ("white" | "green" | "orange")[] = [];
    for (let i = 0; i < total; i++) {
      if (i % 3 === 0) colors.push("white");
      else if (i % 3 === 1) colors.push("green");
      else colors.push("orange");
    }
    // Fisher-Yates shuffle for new layout each load
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    // Create tiles
    for (let i = 0; i < total; i++) {
      const tile = document.createElement("div");
      tile.setAttribute("aria-hidden", "true");
      tile.className = [
        "tile",
        "relative",
        "aspect-square",
        "rounded-[10%]",
        "shadow",
        "shadow-black/30",
        "dark:shadow-black/50",
        "hover:shadow-md",
      ].join(" ");

      // random base rotation
      const base = (Math.random() * 12 - 6).toFixed(2);
      tile.style.setProperty("--base", base + "deg");
      tile.style.setProperty("--delta", "0deg");

      // set shuffled color
      const c = colors[i];
      if (c === "white") tile.style.backgroundColor = "var(--flag-white)";
      else if (c === "green") tile.style.backgroundColor = "var(--flag-green)";
      else tile.style.backgroundColor = "var(--flag-orange)";

      // normalized offset from center for smooth parallax influence
      const col = i % cols;
      const row = Math.floor(i / cols);
      (tile as any)._ox = (col - (cols - 1) / 2) / ((cols - 1) / 2);
      (tile as any)._oy = (row - (rows - 1) / 2) / ((rows - 1) / 2);

      grid.appendChild(tile);
    }

    const tiles = Array.from(grid.children) as HTMLElement[];
    let targetX = 0, targetY = 0, mx = 0, my = 0;

    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;

    function onMove(e: MouseEvent) {
      const rect = field.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    }
    function onLeave() { targetX = 0; targetY = 0; }
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      mx = lerp(mx, targetX, ease);
      my = lerp(my, targetY, ease);
      for (const t of tiles) {
        const influence = ((t as any)._ox * mx) + ((t as any)._oy * my);
        t.style.setProperty("--delta", (influence * strength).toFixed(2) + "deg");
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    if (!prefersReduced && finePointer) {
      field.addEventListener("mousemove", onMove as any, { passive: true });
      field.addEventListener("mouseleave", onLeave as any, { passive: true });
      rafRef.current = requestAnimationFrame(loop);
    }

    // Cleanup
    return () => {
      field.removeEventListener("mousemove", onMove as any);
      field.removeEventListener("mouseleave", onLeave as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={fieldRef as any}
      className={[
        "relative",
        "aspect-[3/2]",
        "w-full",
        "rounded-3xl",
        "overflow-hidden",
        "bg-card",
        "border",
        "border-border",
      ].join(" ")}
    >
      {/* Self-contained CSS so transforms work without relying on global styles */}
      <style>{`
        .tile { will-change: transform; transform: rotate(calc(var(--base, 0deg) + var(--delta, 0deg))) translateZ(0); transition: background-color 200ms ease, box-shadow 200ms ease; }
        #grid { will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .tile { transition: none; } }
      `}</style>
      <div ref={gridRef} id="grid" className="relative grid h-full w-full p-6 md:p-10 gap-2.5 md:gap-4" />
    </section>
  );
};
