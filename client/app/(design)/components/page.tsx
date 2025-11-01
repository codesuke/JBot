'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from '@/components/ui/Loader';

export default function ComponentsPage() {
  return (
    <div className="space-y-12">
      {/* Buttons Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Buttons</h2>
          <p className="mt-2 text-muted-foreground">Various button styles and states</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Primary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="default" disabled>
                Disabled
              </Button>
              <Button size="sm" variant="default">
                Small
              </Button>
              <Button size="lg" variant="default">
                Large
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Destructive Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="destructive">Delete</Button>
              <Button variant="destructive" disabled>
                Disabled
              </Button>
              <Button variant="destructive" size="sm">
                Small
              </Button>
              <Button variant="destructive" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Outline Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Outline</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Ghost Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghost" disabled>
                Disabled
              </Button>
              <Button variant="ghost" size="sm">
                Small
              </Button>
              <Button variant="ghost" size="lg">
                Large
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Cards Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cards</h2>
          <p className="mt-2 text-muted-foreground">Card component variations</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground">Basic Card</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a basic card component with default styling
            </p>
          </Card>

          <Card className="border-primary bg-primary/5 p-6">
            <h3 className="font-semibold text-primary">Highlighted Card</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This card has a subtle primary color highlight
            </p>
          </Card>

          <Card className="border-destructive bg-destructive/5 p-6">
            <h3 className="font-semibold text-destructive">Error Card</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This card is used for error or warning messages
            </p>
          </Card>

          <Card className="border-secondary bg-secondary/5 p-6">
            <h3 className="font-semibold text-secondary">Secondary Card</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This card uses secondary color styling
            </p>
          </Card>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Input Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inputs</h2>
          <p className="mt-2 text-muted-foreground">Input field variations</p>
        </div>

        <Card className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Default Input</label>
            <Input placeholder="Enter your text here..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">With Value</label>
            <Input placeholder="Placeholder..." defaultValue="Sample text" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Disabled</label>
            <Input placeholder="Disabled input..." disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </Card>
      </section>

      <div className="border-t border-border" />

      {/* Textarea Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Textareas</h2>
          <p className="mt-2 text-muted-foreground">Textarea component variations</p>
        </div>

        <Card className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Default Textarea</label>
            <Textarea placeholder="Enter your message here..." rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">With Value</label>
            <Textarea
              placeholder="Placeholder..."
              defaultValue="This is a sample message that shows how the textarea looks with content."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Disabled</label>
            <Textarea placeholder="Disabled textarea..." rows={3} disabled />
          </div>
        </Card>
      </section>

      <div className="border-t border-border" />

      {/* Typography Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Typography</h2>
          <p className="mt-2 text-muted-foreground">Text styles and hierarchy</p>
        </div>

        <Card className="space-y-6 p-6">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Heading 3 (Large)</h3>
            <p className="text-sm text-muted-foreground">Largest heading size</p>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-foreground">Heading 4</h4>
            <p className="text-sm text-muted-foreground">Large heading size</p>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-foreground">Heading 5</h5>
            <p className="text-sm text-muted-foreground">Medium heading size</p>
          </div>

          <div>
            <p className="text-lg text-foreground">Body Large</p>
            <p className="text-sm text-muted-foreground">Larger body text</p>
          </div>

          <div>
            <p className="text-base text-foreground">Body Regular</p>
            <p className="text-sm text-muted-foreground">Standard body text</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Body Small / Muted</p>
            <p className="text-xs text-muted-foreground">Smallest text size</p>
          </div>

          <div>
            <p className="font-mono text-sm text-foreground">Monospace Text</p>
            <p className="text-xs text-muted-foreground">Code and technical text</p>
          </div>
        </Card>
      </section>

      <div className="border-t border-border" />

      {/* Loader Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Loaders</h2>
          <p className="mt-2 text-muted-foreground">Loading state indicators</p>
        </div>

        <Card className="flex items-center justify-center gap-8 p-12">
          <Loader />
        </Card>
      </section>

      <div className="border-t border-border" />

      {/* Color States Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Color States</h2>
          <p className="mt-2 text-muted-foreground">Color utility classes</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-primary p-6 text-primary-foreground">
            <p className="font-semibold">Primary</p>
            <p className="text-sm opacity-90">Primary color state</p>
          </div>

          <div className="rounded-lg bg-secondary p-6 text-secondary-foreground">
            <p className="font-semibold">Secondary</p>
            <p className="text-sm opacity-90">Secondary color state</p>
          </div>

          <div className="rounded-lg bg-accent p-6 text-accent-foreground">
            <p className="font-semibold">Accent</p>
            <p className="text-sm opacity-90">Accent color state</p>
          </div>

          <div className="rounded-lg bg-muted p-6 text-muted-foreground">
            <p className="font-semibold">Muted</p>
            <p className="text-sm opacity-90">Muted color state</p>
          </div>

          <div className="rounded-lg bg-destructive p-6 text-destructive-foreground">
            <p className="font-semibold">Destructive</p>
            <p className="text-sm opacity-90">Destructive color state</p>
          </div>

          <div className="rounded-lg border border-input bg-background p-6 text-foreground">
            <p className="font-semibold">Background</p>
            <p className="text-sm text-muted-foreground">Background color state</p>
          </div>
        </div>
      </section>
    </div>
  );
}
