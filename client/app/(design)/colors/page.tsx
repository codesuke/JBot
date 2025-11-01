'use client';

const lightTheme = {
  Primary: [
    { name: 'Primary', value: 'oklch(0.5417 0.1790 288.0332)' },
    { name: 'Primary Foreground', value: 'oklch(1.0000 0 0)' },
  ],
  Secondary: [
    { name: 'Secondary', value: 'oklch(0.9174 0.0435 292.6901)' },
    { name: 'Secondary Foreground', value: 'oklch(0.4143 0.1039 288.1742)' },
  ],
  Accent: [
    { name: 'Accent', value: 'oklch(0.9221 0.0373 262.1410)' },
    { name: 'Accent Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
  ],
  Background: [
    { name: 'Background', value: 'oklch(0.9730 0.0133 286.1503)' },
    { name: 'Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
    { name: 'Card', value: 'oklch(1.0000 0 0)' },
    { name: 'Card Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
    { name: 'Popover', value: 'oklch(1.0000 0 0)' },
    { name: 'Popover Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
  ],
  Utility: [
    { name: 'Muted', value: 'oklch(0.9580 0.0133 286.1454)' },
    { name: 'Muted Foreground', value: 'oklch(0.5426 0.0465 284.7435)' },
    { name: 'Destructive', value: 'oklch(0.6861 0.2061 14.9941)' },
    { name: 'Destructive Foreground', value: 'oklch(1.0000 0 0)' },
    { name: 'Border', value: 'oklch(0.9115 0.0216 285.9625)' },
    { name: 'Input', value: 'oklch(0.9115 0.0216 285.9625)' },
  ],
  Charts: [
    { name: 'Chart 1', value: 'oklch(0.5417 0.1790 288.0332)' },
    { name: 'Chart 2', value: 'oklch(0.7042 0.1602 288.9880)' },
    { name: 'Chart 3', value: 'oklch(0.5679 0.2113 276.7065)' },
    { name: 'Chart 4', value: 'oklch(0.6356 0.1922 281.8054)' },
    { name: 'Chart 5', value: 'oklch(0.4509 0.1758 279.3838)' },
  ],
  Sidebar: [
    { name: 'Sidebar', value: 'oklch(0.9580 0.0133 286.1454)' },
    { name: 'Sidebar Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
    { name: 'Sidebar Primary', value: 'oklch(0.5417 0.1790 288.0332)' },
    { name: 'Sidebar Primary Foreground', value: 'oklch(1.0000 0 0)' },
    { name: 'Sidebar Accent', value: 'oklch(0.9221 0.0373 262.1410)' },
    { name: 'Sidebar Accent Foreground', value: 'oklch(0.3015 0.0572 282.4176)' },
    { name: 'Sidebar Border', value: 'oklch(0.9115 0.0216 285.9625)' },
    { name: 'Sidebar Ring', value: 'oklch(0.5417 0.1790 288.0332)' },
  ],
};

const darkTheme = {
  Primary: [
    { name: 'Primary', value: 'oklch(0.7162 0.1597 290.3962)' },
    { name: 'Primary Foreground', value: 'oklch(0.1743 0.0227 283.7998)' },
  ],
  Secondary: [
    { name: 'Secondary', value: 'oklch(0.3139 0.0736 283.4591)' },
    { name: 'Secondary Foreground', value: 'oklch(0.8367 0.0849 285.9111)' },
  ],
  Accent: [
    { name: 'Accent', value: 'oklch(0.3354 0.0828 280.9705)' },
    { name: 'Accent Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
  ],
  Background: [
    { name: 'Background', value: 'oklch(0.1743 0.0227 283.7998)' },
    { name: 'Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
    { name: 'Card', value: 'oklch(0.2284 0.0384 282.9324)' },
    { name: 'Card Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
    { name: 'Popover', value: 'oklch(0.2284 0.0384 282.9324)' },
    { name: 'Popover Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
  ],
  Utility: [
    { name: 'Muted', value: 'oklch(0.2710 0.0621 281.4377)' },
    { name: 'Muted Foreground', value: 'oklch(0.7166 0.0462 285.1741)' },
    { name: 'Destructive', value: 'oklch(0.6861 0.2061 14.9941)' },
    { name: 'Destructive Foreground', value: 'oklch(1.0000 0 0)' },
    { name: 'Border', value: 'oklch(0.3261 0.0597 282.5832)' },
    { name: 'Input', value: 'oklch(0.3261 0.0597 282.5832)' },
  ],
  Charts: [
    { name: 'Chart 1', value: 'oklch(0.7162 0.1597 290.3962)' },
    { name: 'Chart 2', value: 'oklch(0.6382 0.1047 274.9117)' },
    { name: 'Chart 3', value: 'oklch(0.7482 0.1235 244.7492)' },
    { name: 'Chart 4', value: 'oklch(0.7124 0.0977 186.6761)' },
    { name: 'Chart 5', value: 'oklch(0.7546 0.1831 346.8124)' },
  ],
  Sidebar: [
    { name: 'Sidebar', value: 'oklch(0.2284 0.0384 282.9324)' },
    { name: 'Sidebar Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
    { name: 'Sidebar Primary', value: 'oklch(0.7162 0.1597 290.3962)' },
    { name: 'Sidebar Primary Foreground', value: 'oklch(0.1743 0.0227 283.7998)' },
    { name: 'Sidebar Accent', value: 'oklch(0.3354 0.0828 280.9705)' },
    { name: 'Sidebar Accent Foreground', value: 'oklch(0.9185 0.0257 285.8834)' },
    { name: 'Sidebar Border', value: 'oklch(0.3261 0.0597 282.5832)' },
    { name: 'Sidebar Ring', value: 'oklch(0.7162 0.1597 290.3962)' },
  ],
};

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className="space-y-2">
    <div
      className="h-24 w-full rounded-lg border border-border shadow-sm"
      style={{ backgroundColor: value }}
    />
    <div className="text-center">
      <p className="font-medium text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{value}</p>
    </div>
  </div>
);

const ColorSection = ({
  title,
  colors,
}: {
  title: string;
  colors: Array<{ name: string; value: string }>;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {colors.map((color) => (
        <ColorSwatch key={color.name} name={color.name} value={color.value} />
      ))}
    </div>
  </div>
);

export default function ColorsPage() {
  return (
    <div className="space-y-12">
      {/* Light Theme */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Light Theme</h2>
          <p className="mt-2 text-muted-foreground">
            Complete color palette for the light theme
          </p>
        </div>

        {Object.entries(lightTheme).map(([category, colors]) => (
          <ColorSection key={category} title={category} colors={colors} />
        ))}
      </section>

      <div className="border-t border-border py-8" />

      {/* Dark Theme */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dark Theme</h2>
          <p className="mt-2 text-muted-foreground">
            Complete color palette for the dark theme
          </p>
        </div>

        {Object.entries(darkTheme).map(([category, colors]) => (
          <ColorSection key={category} title={category} colors={colors} />
        ))}
      </section>

      {/* Typography Section */}
      <section className="space-y-6 border-t border-border pt-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Typography</h2>
          <p className="mt-2 text-muted-foreground">Available fonts in the design system</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Font Sans</h3>
            <p className="mt-4 text-2xl font-semibold" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Geist
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Font Serif</h3>
            <p className="mt-4 text-2xl font-semibold" style={{ fontFamily: 'Source Serif 4' }}>
              Source Serif 4
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Font Mono</h3>
            <p
              className="mt-4 text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Geist Mono
            </p>
          </div>
        </div>
      </section>

      {/* Others Section */}
      <section className="space-y-6 border-t border-border pt-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Others</h2>
          <p className="mt-2 text-muted-foreground">Additional design properties</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Border Radius</h3>
            <p className="mt-2 text-muted-foreground">Base Radius: 0.5 rem</p>
            <div className="mt-4 flex gap-4">
              <div
                className="h-20 w-20 border border-border bg-primary"
                style={{ borderRadius: 'calc(0.5rem - 4px)' }}
              />
              <div
                className="h-20 w-20 border border-border bg-primary"
                style={{ borderRadius: 'calc(0.5rem - 2px)' }}
              />
              <div className="h-20 w-20 border border-border bg-primary" style={{ borderRadius: '0.5rem' }} />
              <div
                className="h-20 w-20 border border-border bg-primary"
                style={{ borderRadius: 'calc(0.5rem + 4px)' }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Shadow</h3>
            <div className="mt-4 flex gap-4">
              <div className="h-20 w-20 rounded-lg bg-card shadow-sm" />
              <div className="h-20 w-20 rounded-lg bg-card shadow-md" />
              <div className="h-20 w-20 rounded-lg bg-card shadow-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
