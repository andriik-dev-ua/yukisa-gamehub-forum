import { Gamepad2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-neon-cyan bg-clip-text text-transparent">
                GameStopDev
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Forum gamingowe stworzone dla graczy, przez graczy.
              Dołącz do społeczności i dyskutuj o swoich ulubionych grach!
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Nawigacja</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-primary text-sm no-underline transition-colors">Strona główna</Link>
              <Link to="/forum" className="block text-gray-400 hover:text-primary text-sm no-underline transition-colors">Forum</Link>
              <Link to="/ranking" className="block text-gray-400 hover:text-primary text-sm no-underline transition-colors">Ranking</Link>
            </div>
          </div>

          {/* Author */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Autor / Twórca</h3>
            <div className="text-gray-400 text-sm space-y-1">
              <p className="text-primary-light font-medium">Andrii Kondratiuk</p>
              <p>CKZiU NR.2 &quot;Mechanik&quot; w Raciborzu</p>
              <p>Klasa 4cT, gr.1 — technik informatyk</p>
              <p className="text-neon-cyan font-medium">Zespół: Dev S.A. | A.K.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} GameStopDev — Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Stworzone z <Heart className="w-3 h-3 text-neon-pink" /> przez Andriia Kondratiuka | Dev S.A. | A.K.
          </p>
        </div>
      </div>
    </footer>
  );
}
