/* Custom flat-style SVG illustrations for tool landing pages.
   Self-contained (no external image assets) so they load instantly and
   never break on the VPS — colors are fixed via gradients so they read
   correctly in both light and dark mode inside their card container. */

export function GrammarIllustration() {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-auto" role="img" aria-label="Document being corrected from messy to clean text">
      <defs>
        <linearGradient id="gDoc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
        <linearGradient id="gCheck" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <rect x="16" y="18" width="150" height="164" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="2"/>
      <rect x="34" y="42" width="90" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="34" y="60" width="114" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="34" y="74" width="70" height="6" rx="3" fill="#fecaca"/>
      <path d="M34 80 L104 80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 3"/>
      <rect x="34" y="92" width="100" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="34" y="106" width="60" height="6" rx="3" fill="#fecaca"/>
      <path d="M34 112 L94 112" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 3"/>
      <rect x="34" y="124" width="90" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="34" y="138" width="80" height="6" rx="3" fill="#e2e8f0"/>
      <circle cx="204" cy="100" r="58" fill="url(#gDoc)" opacity="0.08"/>
      <rect x="150" y="56" width="112" height="128" rx="12" fill="#fff" stroke="#c7d2fe" strokeWidth="2"/>
      <rect x="166" y="78" width="72" height="7" rx="3.5" fill="#a7f3d0"/>
      <rect x="166" y="96" width="80" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="166" y="110" width="76" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="166" y="124" width="64" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="166" y="138" width="70" height="6" rx="3" fill="#e2e8f0"/>
      <circle cx="238" cy="152" r="22" fill="url(#gCheck)"/>
      <path d="M228 152l7 7 15-15" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function PlagiarismIllustration() {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-auto" role="img" aria-label="Magnifying glass scanning a document against the web">
      <defs>
        <linearGradient id="pGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
      <circle cx="140" cy="100" r="76" fill="#8b5cf6" opacity="0.06"/>
      <rect x="60" y="40" width="110" height="140" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="2"/>
      <rect x="76" y="60" width="60" height="7" rx="3.5" fill="#c4b5fd"/>
      <rect x="76" y="78" width="78" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="76" y="92" width="70" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="76" y="106" width="78" height="6" rx="3" fill="#fecaca"/>
      <rect x="76" y="120" width="50" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="76" y="134" width="66" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="76" y="148" width="74" height="6" rx="3" fill="#e2e8f0"/>
      {/* globe (web) */}
      <circle cx="196" cy="70" r="26" fill="#fff" stroke="#c7d2fe" strokeWidth="2"/>
      <ellipse cx="196" cy="70" rx="26" ry="10" fill="none" stroke="#a5b4fc" strokeWidth="1.4"/>
      <ellipse cx="196" cy="70" rx="10" ry="26" fill="none" stroke="#a5b4fc" strokeWidth="1.4"/>
      <line x1="170" y1="70" x2="222" y2="70" stroke="#a5b4fc" strokeWidth="1.4"/>
      {/* magnifying glass */}
      <circle cx="182" cy="118" r="34" fill="none" stroke="url(#pGlass)" strokeWidth="9"/>
      <line x1="206" y1="142" x2="238" y2="174" stroke="url(#pGlass)" strokeWidth="11" strokeLinecap="round"/>
      <path d="M108 108 L182 118" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 4" opacity="0.7"/>
    </svg>
  );
}

export function AIDetectorIllustration() {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-auto" role="img" aria-label="Waveform comparing human and AI writing patterns">
      <defs>
        <linearGradient id="dHuman" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="dAI" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
      </defs>
      <circle cx="140" cy="100" r="80" fill="#3b82f6" opacity="0.06"/>
      <rect x="30" y="30" width="220" height="140" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="2"/>

      <text x="50" y="58" fontSize="11" fontWeight="700" fill="#059669" fontFamily="system-ui">HUMAN</text>
      <path d="M50 80 L64 68 L78 92 L92 72 L106 88 L120 62 L134 84 L148 70 L162 90 L176 74 L190 86"
        fill="none" stroke="url(#dHuman)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

      <text x="50" y="118" fontSize="11" fontWeight="700" fill="#2563eb" fontFamily="system-ui">AI</text>
      <path d="M50 140 L64 136 L78 140 L92 136 L106 140 L120 136 L134 140 L148 136 L162 140 L176 136 L190 140"
        fill="none" stroke="url(#dAI)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

      <circle cx="222" cy="110" r="26" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="2"/>
      <path d="M212 110h4m4 0h4m4 0h4" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="222" cy="98" r="3" fill="#6366f1"/>
      <circle cx="222" cy="122" r="3" fill="#6366f1"/>
    </svg>
  );
}
