import Navbar from './Navbar';
import Footer from './Footer';

export default function Cadre({ children }) {
  return (
    <div className="mx-auto max-w-[1320px] px-3 pt-5 sm:px-6 sm:pt-7">
      <div className="px-2">
        <Navbar />
      </div>
      <main className="mt-6">{children}</main>
      <Footer />
    </div>
  );
}
