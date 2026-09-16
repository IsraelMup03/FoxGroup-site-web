import { Facebook, Instagram, MessageCircle, Phone } from 'lucide-react';
import Logo from './Logo';
import { useLangue } from '../context/LangueContext';
import { SITE } from '../config/site';

export default function Footer() {
  const { t } = useLangue();
  return (
    <footer className="mt-3 flex flex-col gap-6 px-2 py-8 text-sm text-gris sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5 text-encre">
        <Logo className="h-6 w-6" />
        <span className="text-lg font-normal">FoxGroup</span>
        <span className="ml-2 text-gris">{t.footer.slogan} · {SITE.ville}</span>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <a href={`tel:${SITE.telephone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-encre">
          <Phone className="h-4 w-4" strokeWidth={1.6} /> {SITE.telephone}
        </a>
        <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-encre">
          <MessageCircle className="h-4 w-4" strokeWidth={1.6} /> WhatsApp
        </a>
        <a href={SITE.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-encre">
          <Facebook className="h-4 w-4" strokeWidth={1.6} /> Facebook
        </a>
        <a href={SITE.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-encre">
          <Instagram className="h-4 w-4" strokeWidth={1.6} /> Instagram
        </a>
      </div>
    </footer>
  );
}
