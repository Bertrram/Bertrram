// The link buttons under the header.

import { sprite, rect, svg } from '../lib/pixel.mjs';
import { text, textWidth } from '../lib/font.mjs';
import { ICON_OMOIO, ICON_OMOIO_P, LINKEDIN, LINKEDIN_P, CHAT, CHAT_P } from '../lib/sprites.mjs';

function button(label, icon, pal, iconScale) {
  const iw = icon[0].length * iconScale;
  const ih = icon.length * iconScale;
  const w = 18 + iw + 12 + textWidth(label, 2) + 20;
  const h = 48;
  const body = `
${rect(3, 0, w - 6, h, '#1f2b4d')}${rect(0, 3, w, h - 6, '#1f2b4d')}
${rect(3, 3, w - 6, h - 6, '#111a35')}
${rect(3, 3, w - 6, 2, '#2a3a66')}
${sprite(icon, pal, 18, Math.round((h - ih) / 2), iconScale)}
${text(label, 18 + iw + 12, 15, 2, '#ffffff')}`;
  return svg({ w, h, title: label, body });
}

export function buttons(cfg) {
  return {
    'btn-omoio.svg': button('omoio.app', ICON_OMOIO, ICON_OMOIO_P, 2),
    'btn-linkedin.svg': button('LinkedIn', LINKEDIN, LINKEDIN_P, 3),
    'btn-discord.svg': button(`Discord: ${cfg.links.discord}`, CHAT, CHAT_P, 3),
  };
}
