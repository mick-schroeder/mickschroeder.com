import * as React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";

/**
 * Interactive geometric grid ("flag") used on the landing page.
 * - Decorative only (non-focusable)
 * - Uses system motion + pointer media queries
 * - Colors: evenly distributed (1/3 each) then shuffled so placement changes on every load
 */
export const Flag: React.FC = () => {
  const { t } = useTranslation();
  // Grid + motion constants (3 equal vertical bands)
  const cols = 9; // divisible by 3 for clean bands
  const rows = 5;
  const strength = 30; // stronger rotation like original
  const ease = 0.12;

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

    // Fixed tricolor bands (vertical): green | white | orange
    const total = cols * rows;
    const greenEnd = Math.floor(cols / 3);       // exclusive
    const whiteEnd = Math.floor((2 * cols) / 3); // exclusive
    const colorVar = (idx: number) => (idx === 0 ? "var(--flag-green)" : idx === 1 ? "var(--flag-white)" : "var(--flag-orange)");
    const targetIndexForCol = (ccol: number) => (ccol < greenEnd ? 0 : ccol < whiteEnd ? 1 : 2);
    const state: number[] = new Array(total);

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

      // random base rotation for lively look
      const base = (Math.random() * 12 - 6).toFixed(2);
      tile.style.setProperty("--base", base + "deg");
      tile.style.setProperty("--delta", "0deg");
      tile.style.setProperty("--idle", "0deg");

      // set color by band (tricolor) and init game state
      const ccol = i % cols;
      const initial = targetIndexForCol(ccol);
      state[i] = initial;
      tile.style.backgroundColor = colorVar(initial);

      // store index for click handling
      (tile as HTMLDivElement).dataset.idx = String(i);

      // normalized offset from center for smooth parallax influence
      const col = i % cols;
      const row = Math.floor(i / cols);
      (tile as any)._ox = (col - (cols - 1) / 2) / ((cols - 1) / 2);
      (tile as any)._oy = (row - (rows - 1) / 2) / ((rows - 1) / 2);
      // phase offset for idle wave (based on grid position)
      ;(tile as any)._phase = (col / cols + row / rows) * Math.PI * 2;

      grid.appendChild(tile);
    }

    const tiles = Array.from(grid.children) as HTMLElement[];

    // Scramble: mark a small subset wrong (single-tile wrong colors)
    const scrambleFewWrong = () => {
      // reset to target first
      for (let i = 0; i < total; i++) {
        const want = targetIndexForCol(i % cols);
        state[i] = want;
        tiles[i].style.backgroundColor = colorVar(want);
      }
      const wrong = Math.max(4, Math.floor(total * 0.12));
      for (let s = 0; s < wrong; s++) {
        const idx = Math.floor(Math.random() * total);
        const want = targetIndexForCol(idx % cols);
        // choose a different color
        const delta = Math.random() < 0.5 ? 1 : 2;
        const next = (want + delta) % 3;
        state[idx] = next;
        tiles[idx].style.backgroundColor = colorVar(next);
      }
      // hide solved UI if visible
      // (these will be defined after HUD is created)
      try {
        const hudEl = (field as HTMLElement).querySelector('[data-flag-hud="1"]') as HTMLDivElement | null;
        const statusEl = hudEl?.querySelector('[data-flag-status="1"]') as HTMLSpanElement | null;
        const btnEl = hudEl?.querySelector('[data-flag-scramble="1"]') as HTMLButtonElement | null;
        if (statusEl) statusEl.textContent = '';
        if (btnEl) btnEl.style.display = 'none';
        if (hudEl) hudEl.style.display = 'none';
      } catch {}
    };
    scrambleFewWrong();

    const isSolved = () => {
      for (let i = 0; i < total; i++) {
        if (state[i] !== targetIndexForCol(i % cols)) return false;
      }
      return true;
    };

    // HUD elements (localized, hidden until solved)
    const hud = document.createElement("div");
    hud.setAttribute('data-flag-hud', '1');
    hud.className = "absolute right-4 top-4 z-10 flex items-center gap-3 text-base px-3 py-2 rounded-lg bg-black/60 text-white backdrop-blur-md shadow-lg";
    const statusEl = document.createElement("span");
    statusEl.setAttribute('data-flag-status', '1');
    const scrambleBtn = document.createElement("button");
    scrambleBtn.setAttribute('data-flag-scramble', '1');
    scrambleBtn.className = "px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-colors";
    scrambleBtn.textContent = t("flag_scramble");
    scrambleBtn.style.display = "none";
    hud.appendChild(statusEl);
    hud.appendChild(scrambleBtn);
    hud.style.display = 'none';
    (field as HTMLElement).appendChild(hud);

    const onGridClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const host = target.closest('.tile') as HTMLElement | null;
      if (!host) return;
      const idx = Number((host as any).dataset?.idx ?? -1);
      if (idx < 0) return;
      state[idx] = (state[idx] + 1) % 3;
      host.style.backgroundColor = colorVar(state[idx]);
      if (isSolved()) {
        // Celebrate with a staggered pop animation and show controls
        tiles.forEach((el, k) => {
          el.animate([
            { transform: el.style.transform + ' scale(1)' },
            { transform: el.style.transform + ' scale(1.15)' },
            { transform: el.style.transform + ' scale(1)' },
          ], { duration: 260, easing: 'ease-out', delay: (k % cols) * 18 + Math.floor(k / cols) * 18 });
        });
        statusEl.textContent = t("flag_solved");
        scrambleBtn.style.display = "inline-block";
        hud.style.display = 'flex';
        hud.animate([
          { transform: 'scale(0.9)', opacity: 0.8 },
          { transform: 'scale(1.05)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1 },
        ], { duration: 240, easing: 'ease-out' });
      }
    };
    grid.addEventListener('click', onGridClick);
    scrambleBtn.addEventListener('click', () => {
      scrambleFewWrong();
    });
    let targetX = 0, targetY = 0, mx = 0, my = 0;

    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;

    function onMove(e: MouseEvent) {
      if (!field) return;
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
      const now = performance.now();
      // idle wave parameters
      const amp = prefersReduced ? 0 : 3; // degrees
      const period = 4000; // ms
      const omega = (Math.PI * 2) / period;
      for (const t of tiles) {
        const influence = ((t as any)._ox * mx) + ((t as any)._oy * my);
        t.style.setProperty("--delta", (influence * strength).toFixed(2) + "deg");
        const phase = (t as any)._phase as number;
        const idle = amp * Math.sin(omega * now + phase);
        t.style.setProperty("--idle", idle.toFixed(2) + "deg");
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
      grid.removeEventListener('click', onGridClick);
      scrambleBtn.onclick = null;
      if (hud && hud.parentElement) hud.parentElement.removeChild(hud);
      if (field) {
        field.removeEventListener("mousemove", onMove as any);
        field.removeEventListener("mouseleave", onLeave as any);
      }
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
        .tile { will-change: transform; transform: rotate(calc(var(--base, 0deg) + var(--delta, 0deg) + var(--idle, 0deg))) translateZ(0); transition: background-color 200ms ease, box-shadow 200ms ease; }
        #grid { will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .tile { transition: none; } }
      `}</style>
      <div ref={gridRef} id="grid" className="relative grid h-full w-full p-6 md:p-10 gap-2.5 md:gap-4" />
    </section>
  );
};
