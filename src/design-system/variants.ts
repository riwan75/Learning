import {colors, radius, spacing} from './tokens';

export interface CardVariants {
  container: string;
}

export const CARD: Record<'default' | 'compact' | 'flush' | 'figma' | 'detail', string> = {
  default: [colors.surface, radius.cardFigma, 'p-6', spacing.cardGap].join(' '),
  compact: [colors.surface, radius.cardFigma, 'p-4', spacing.cardGap].join(' '),
  flush: [colors.surface, radius.cardFigma, spacing.cardGap].join(' '),
  figma: ['bg-white/10', 'backdrop-blur-xl', radius.cardFigma, 'p-6', spacing.cardGap].join(' '),
  detail: [colors.surfaceMuted, radius.detail, 'p-3', 'items-center'].join(' '),
};
