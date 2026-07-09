import {BG_SURFACE, BG_SURFACE_MUTED, BG_CHART_OVERLAY} from '../styles/Color';
import {RADIUS_CARD, RADIUS_DETAIL} from '../styles/Sizing';
import {M_5} from '../styles/Spacing';

export const CARD: Record<
  'default' | 'compact' | 'flush' | 'figma' | 'detail',
  string
> = {
  default: [BG_SURFACE, RADIUS_CARD, 'p-6', M_5].join(' '),
  compact: [BG_SURFACE, RADIUS_CARD, 'p-4', M_5].join(' '),
  flush: [BG_SURFACE, RADIUS_CARD, M_5].join(' '),
  figma: [BG_CHART_OVERLAY, 'backdrop-blur-xl', RADIUS_CARD, 'p-6', M_5].join(
    ' ',
  ),
  detail: [BG_SURFACE_MUTED, RADIUS_DETAIL, 'p-3', 'items-center'].join(' '),
};
