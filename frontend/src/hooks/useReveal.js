import { useEffect, useRef, useState } from 'react';

// Révèle un élément (transition CSS déclenchée par la classe "visible")
// dès qu'il entre dans la zone visible, une seule fois.
export function useReveal({ seuil = 0.18 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true);
          observateur.unobserve(el);
        }
      },
      { threshold: seuil, rootMargin: '0px 0px -8% 0px' }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [seuil]);

  return [ref, visible];
}
