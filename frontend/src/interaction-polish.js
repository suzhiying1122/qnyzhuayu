export function initInteractionPolish() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.querySelector("#top");
  if (!root) return;
  let lastView = document.body.dataset.view;
  let pendingFrame;
  const animations = new Set();

  function enter(element, delay = 0) {
    if (!element || reducedMotion.matches || !element.getClientRects().length) return;
    const animation = element.animate(
      [{ opacity: 0, translate: "0 6px" }, { opacity: 1, translate: "0 0" }],
      { duration: 220, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
    );
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  }

  function syncNavigation() {
    const active = document.querySelector("#globalHeader .nav-link.is-active");
    const nav = active?.parentElement;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    const itemBox = active.getBoundingClientRect();
    const navBox = nav.getBoundingClientRect();
    if (itemBox.left < navBox.left || itemBox.right > navBox.right) {
      nav.scrollTo({
        left: nav.scrollLeft + itemBox.left - navBox.left - (nav.clientWidth - itemBox.width) / 2,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    }
  }

  const viewObserver = new MutationObserver(() => {
    const nextView = document.body.dataset.view;
    if (nextView === lastView) return;
    lastView = nextView;
    animations.forEach((animation) => animation.cancel());
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      const view = root.querySelector(".view.is-active");
      // Animate reading elements, never the ancestor of a fixed composer.
      const heading = view?.querySelector("h1, h2");
      enter(heading);
      enter(view?.querySelector(".forum-category-grid, .events-feed, .module-canvas, .reader-scroll"), 35);
      syncNavigation();
    });
  });
  viewObserver.observe(document.body, { attributes: true, attributeFilter: ["data-view"] });

  document.addEventListener("toggle", (event) => {
    if (event.target instanceof HTMLDetailsElement && event.target.open) {
      enter([...event.target.children].find((child) => child.tagName !== "SUMMARY"));
    }
  }, true);

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) animations.forEach((animation) => animation.cancel());
  });
  syncNavigation();
}
