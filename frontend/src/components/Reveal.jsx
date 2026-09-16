import { useReveal } from '../hooks/useReveal';

// Fait apparaître son contenu (fondu + légère montée) à l'entrée dans l'écran.
// `groupe` : les enfants directs apparaissent l'un après l'autre.
export default function Reveal({ as: Tag = 'div', groupe = false, className = '', children, ...props }) {
  const [ref, visible] = useReveal();
  const base = groupe ? 'reveal-groupe' : 'reveal';
  return (
    <Tag ref={ref} className={`${base}${visible ? ' visible' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
