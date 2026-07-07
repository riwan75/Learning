export const colors = {
  surface: 'bg-white/20',
  surfaceMuted: 'bg-white/15',
  surfacePressed: 'bg-white/30',
  textPrimary: 'text-white',
  textSecondary: 'text-white/80',
  textMuted: 'text-white/60',
  textSubtle: 'text-white/40',
  error: 'text-red-300',
  warningBg: 'bg-yellow-400/30',
  warningText: 'text-yellow-200',
  accentBg: 'bg-white/30',
  purpleBg: 'bg-[#48319D]',
  overlay: 'bg-black/10',
} as const;

export const radius = {
  card: 'rounded-3xl',
  cardFigma: 'rounded-[30px]',
  detail: 'rounded-[22px]',
  screen: 'rounded-[44px]',
  pill: 'rounded-full',
  input: 'rounded-xl',
} as const;

export const spacing = {
  cardGap: 'mb-5',
  screenPadding: 'px-4',
  headerPadding: 'px-6 py-3',
  sectionTitle: 'text-white font-semibold text-lg mb-3 px-1',
} as const;
