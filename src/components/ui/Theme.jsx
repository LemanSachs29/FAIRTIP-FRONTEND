// Fairtip theme overlay. Renders a single <style> tag scoped to :root.

import React from 'react';

const FT_PALETTES = {
  clay: {
    label: 'Clay (current)',
    swatch: ['#B85C38', '#FAF8F5', '#1A1714'],
    vars: {
      '--bg':            '#FAF8F5',
      '--bg-hover':      '#F4F1EB',
      '--surface':       '#FFFFFF',
      '--surface-sunken':'#F7F4EF',
      '--fg':            '#1A1714',
      '--fg-strong':     '#0E0C0A',
      '--fg-muted':      '#6B6660',
      '--fg-subtle':     '#9A938A',
      '--border':        '#EAE6E0',
      '--border-strong': '#D5CFC7',
      '--accent':        '#B85C38',
      '--accent-hover':  '#A04E2E',
      '--accent-press':  '#8B4226',
      '--accent-soft':   '#F6EBE4',
      '--accent-ring':   'rgba(184, 92, 56, 0.18)',
      '--success':       '#2F7D5B',
      '--success-soft':  '#E6F1EC',
      '--warning':       '#B57A1D',
      '--warning-soft':  '#F5ECDA',
      '--danger':        '#B04444',
      '--danger-soft':   '#F4E4E2',
      '--info':          '#4A6B8A',
      '--info-soft':     '#E6ECF3',
      '--shadow-tint':   '20, 14, 5',
    },
  },
  blue: {
    label: 'Cool Blue',
    swatch: ['#2D5BE3', '#F6F8FB', '#0E1730'],
    vars: {
      '--bg':            '#F6F8FB',
      '--bg-hover':      '#EEF2F8',
      '--surface':       '#FFFFFF',
      '--surface-sunken':'#F1F4F9',
      '--fg':            '#0E1730',
      '--fg-strong':     '#060C1F',
      '--fg-muted':      '#5A6377',
      '--fg-subtle':     '#8A93A6',
      '--border':        '#E4E8F0',
      '--border-strong': '#CFD5E2',
      '--accent':        '#2D5BE3',
      '--accent-hover':  '#244BCB',
      '--accent-press':  '#1B3CAC',
      '--accent-soft':   '#E6EBFA',
      '--accent-ring':   'rgba(45, 91, 227, 0.20)',
      '--success':       '#1E7A55',
      '--success-soft':  '#E2F1EB',
      '--warning':       '#A56A14',
      '--warning-soft':  '#F4EAD4',
      '--danger':        '#B23A3A',
      '--danger-soft':   '#F4DFDF',
      '--info':          '#2D5BE3',
      '--info-soft':     '#E6EBFA',
      '--shadow-tint':   '14, 23, 48',
    },
  },
  green: {
    label: 'Sage Green',
    swatch: ['#1F7A5C', '#F4F7F4', '#0F1A14'],
    vars: {
      '--bg':            '#F4F7F4',
      '--bg-hover':      '#ECF1EC',
      '--surface':       '#FFFFFF',
      '--surface-sunken':'#EFF3EF',
      '--fg':            '#0F1A14',
      '--fg-strong':     '#070F0A',
      '--fg-muted':      '#566660',
      '--fg-subtle':     '#869490',
      '--border':        '#E2EAE3',
      '--border-strong': '#CCD7CE',
      '--accent':        '#1F7A5C',
      '--accent-hover':  '#19684E',
      '--accent-press':  '#13533F',
      '--accent-soft':   '#E2EFE9',
      '--accent-ring':   'rgba(31, 122, 92, 0.20)',
      '--success':       '#1F7A5C',
      '--success-soft':  '#E2EFE9',
      '--warning':       '#A86A18',
      '--warning-soft':  '#F2E7D4',
      '--danger':        '#A8403E',
      '--danger-soft':   '#F1DFDE',
      '--info':          '#3C6B82',
      '--info-soft':     '#E2ECF2',
      '--shadow-tint':   '15, 26, 20',
    },
  },
  charcoal: {
    label: 'Charcoal + Amber',
    swatch: ['#D97817', '#F5F4F1', '#15171A'],
    vars: {
      '--bg':            '#F5F4F1',
      '--bg-hover':      '#EDECE7',
      '--surface':       '#FFFFFF',
      '--surface-sunken':'#F0EFEA',
      '--fg':            '#15171A',
      '--fg-strong':     '#0A0B0D',
      '--fg-muted':      '#5C5F66',
      '--fg-subtle':     '#8A8C92',
      '--border':        '#E6E4DE',
      '--border-strong': '#CFCCC4',
      '--accent':        '#D97817',
      '--accent-hover':  '#BF6810',
      '--accent-press':  '#9E550A',
      '--accent-soft':   '#FBEBD7',
      '--accent-ring':   'rgba(217, 120, 23, 0.22)',
      '--success':       '#2E7457',
      '--success-soft':  '#E3EFE9',
      '--warning':       '#B07219',
      '--warning-soft':  '#F3E8D4',
      '--danger':        '#B14040',
      '--danger-soft':   '#F2DFDF',
      '--info':          '#3F5C73',
      '--info-soft':     '#E4EAEF',
      '--shadow-tint':   '21, 23, 26',
    },
  },
};

const FT_FONTS = {
  geist: {
    label: 'Geist',
    sub: 'Modern, slightly geometric',
    sans: '"Geist", -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
    import: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap',
  },
  plex: {
    label: 'IBM Plex Sans',
    sub: 'Neutral, highly readable',
    sans: '"IBM Plex Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace',
    import: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
  },
  public: {
    label: 'Public Sans',
    sub: 'Clean, government-grade legibility',
    sans: '"Public Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    import: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
};

const FtTheme = ({ palette = 'clay', font = 'geist' }) => {
  const p = FT_PALETTES[palette] || FT_PALETTES.clay;
  const f = FT_FONTS[font] || FT_FONTS.geist;

  const css = React.useMemo(() => {
    const lines = Object.entries(p.vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    const t = p.vars['--shadow-tint'] || '20, 14, 5';
    return `
@import url('${f.import}');
:root {
${lines}
  --font-sans: ${f.sans};
  --font-mono: ${f.mono};
  --shadow-xs: 0 1px 0 rgba(${t}, 0.04);
  --shadow-sm: 0 1px 2px rgba(${t}, 0.06), 0 1px 1px rgba(${t}, 0.04);
  --shadow-md: 0 4px 12px rgba(${t}, 0.06), 0 1px 3px rgba(${t}, 0.04);
  --shadow-lg: 0 16px 32px rgba(${t}, 0.10), 0 4px 8px rgba(${t}, 0.05);
}
.modal-backdrop { background: rgba(${t}, 0.32) !important; }
`;
  }, [palette, font]);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export {FtTheme};
