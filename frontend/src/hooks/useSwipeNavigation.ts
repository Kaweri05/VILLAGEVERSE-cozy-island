import { useEffect } from "react";
import { useRouter } from "next/router";

const routes = ["/", "/shop", "/inventory", "/quests", "/admin"];

export function useSwipeNavigation() {
  const router = useRouter();

  useEffect(() => {
    let touchStartX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 70) return;

      const currentIndex = routes.indexOf(router.pathname);
      if (currentIndex === -1) return;

      const nextIndex = delta < 0 ? Math.min(currentIndex + 1, routes.length - 1) : Math.max(currentIndex - 1, 0);
      void router.push(routes[nextIndex]);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [router]);
}
