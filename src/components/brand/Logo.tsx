export function LogoMark({ size = 40 }: { size?: number }) {
  const gid = `logo-g-${size}`;
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-700 to-navy-950 shadow-lg shadow-blue-700/35"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        {/* Pallet icon: a stylized pallet shape */}
        <rect
          x="4"
          y="8"
          width="16"
          height="12"
          rx="2"
          fill={`url(#${gid})`}
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        <rect x="6" y="11" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
        <rect x="6" y="15" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
        <path
          d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <defs>
          <linearGradient id={gid} x1="4" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-white" />
    </div>
  );
}

export function LogoWordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={36} />
      <div>
        <p
          className={`font-display text-base font-bold leading-none tracking-tight ${
            light ? "text-white" : "text-navy-900"
          }`}
        >
          PalletTrack Pro
        </p>
        <p
          className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            light ? "text-sky-200/85" : "text-muted"
          }`}
        >
          Pallet Operations
        </p>
      </div>
    </div>
  );
}
