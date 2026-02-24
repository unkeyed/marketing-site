'use client';

import * as React from 'react';
import { ChevronRight, Mail, Search, Settings, Star, Trash2, User, X, Zap } from 'lucide-react';

import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  SnapSlider,
  SnapSliderContent,
  SnapSliderItem,
  SnapSliderNext,
  SnapSliderPrevious,
} from '@/components/ui/snap-slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <Separator className="mb-6" />
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ShowcasePage() {
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Component Showcase</h1>
        <p className="text-muted-foreground">
          All shared UI components and their variants in one place.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BUTTON                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Button">
        <Row label="variant">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="size">
          <Button size="xs">XSmall</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="default">Default</Button>
          <Button size="icon" aria-label="settings">
            <Settings />
          </Button>
        </Row>
        <Row label="with icons">
          <Button>
            <Zap /> Get started
          </Button>
          <Button variant="outline">
            <Mail /> Send email
          </Button>
          <Button variant="secondary">
            <Star /> Star
          </Button>
        </Row>
        <Row label="disabled">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled outline
          </Button>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* BADGE                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Badge">
        <Row label="variant">
          <Badge variant="default">Default</Badge>
          <Badge variant="uppercase">Uppercase</Badge>
          <Badge variant="filled">Filled</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
        <Row label="size — filled">
          <Badge variant="filled" size="sm">Small</Badge>
          <Badge variant="filled" size="md">Medium</Badge>
          <Badge variant="filled" size="lg">Large</Badge>
        </Row>
        <Row label="size — outline">
          <Badge variant="outline" size="sm">Small</Badge>
          <Badge variant="outline" size="md">Medium</Badge>
          <Badge variant="outline" size="lg">Large</Badge>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* LINK                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Link">
        <Row label="variant (dark bg for contrast)">
          <div className="flex items-center gap-3 rounded-lg bg-black/80 p-4">
            <Link href="#" variant="primary">Primary</Link>
            <Link href="#" variant="secondary">Secondary</Link>
          </div>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* INPUT / TEXTAREA / LABEL / CHECKBOX / SELECT                        */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Form Controls">
        <Row label="Input">
          <div className="w-72 space-y-2">
            <Label htmlFor="demo-input">Email</Label>
            <Input id="demo-input" placeholder="you@example.com" type="email" />
          </div>
          <div className="w-72 space-y-2">
            <Label htmlFor="demo-input-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="demo-input-search" className="pl-9" placeholder="Search…" />
            </div>
          </div>
        </Row>
        <Row label="Textarea">
          <div className="w-72 space-y-2">
            <Label htmlFor="demo-textarea">Message</Label>
            <Textarea id="demo-textarea" placeholder="Write something…" rows={3} />
          </div>
        </Row>
        <Row label="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox
              id="demo-checkbox"
              checked={checkboxChecked}
              onCheckedChange={(v) => setCheckboxChecked(Boolean(v))}
            />
            <Label htmlFor="demo-checkbox">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-checkbox-disabled" disabled />
            <Label htmlFor="demo-checkbox-disabled" className="opacity-50">
              Disabled
            </Label>
          </div>
        </Row>
        <Row label="Select">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pick a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="nuxt">Nuxt</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* SEPARATOR                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Separator">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">horizontal</p>
            <Separator />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">vertical (inside flex)</p>
            <div className="flex h-8 items-center gap-4">
              <span className="text-sm">Left</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Middle</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Right</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* ACCORDION                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Accordion">
        <Accordion type="single" collapsible className="w-full max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Unkey?</AccordionTrigger>
            <AccordionContent>
              Unkey is an open source API key management platform. Generate, validate, update, and
              revoke API keys with a single request.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it open source?</AccordionTrigger>
            <AccordionContent>
              Yes, the entire project is available on GitHub under the MIT license.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Create a free account, generate a root key, and start issuing API keys in minutes.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* COLLAPSIBLE                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Collapsible">
        <Collapsible className="w-full max-w-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Advanced options</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="toggle">
                <ChevronRight className="transition-transform duration-200 [[data-state=open]_&]:rotate-90" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">Option A</div>
            <div className="rounded-md border px-4 py-3 text-sm">Option B</div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* TABS                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Tabs">
        <Tabs defaultValue="overview" className="w-full max-w-lg">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="rounded-md border p-4 text-sm">
            Overview content goes here.
          </TabsContent>
          <TabsContent value="analytics" className="rounded-md border p-4 text-sm">
            Analytics content goes here.
          </TabsContent>
          <TabsContent value="settings" className="rounded-md border p-4 text-sm">
            Settings content goes here.
          </TabsContent>
        </Tabs>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* TOOLTIP                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Tooltip">
        <Row>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <User />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View profile</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete item</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">I am a tooltip below</TooltipContent>
          </Tooltip>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* DIALOG                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Dialog">
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to perform this action? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* SHEET                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Sheet">
        <Row>
          {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Sheet ({side})</SheetTitle>
                  <SheetDescription>
                    A panel that slides in from the {side} of the screen.
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button size="sm">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* DRAWER                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Drawer">
        <Row>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bottom drawer</DrawerTitle>
                <DrawerDescription>Drag down or click outside to dismiss.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Content inside the drawer goes here.
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* SCROLL AREA                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Section title="ScrollArea">
        <Row label="vertical">
          <ScrollArea className="h-48 w-80 rounded-md border p-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="py-1.5 text-sm">
                Item {i + 1} — scrollable content row
              </div>
            ))}
          </ScrollArea>
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* CAROUSEL                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Carousel">
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {Array.from({ length: 5 }, (_, i) => (
              <CarouselItem key={i}>
                <div className="flex h-32 items-center justify-center rounded-lg border bg-muted text-lg font-semibold">
                  Slide {i + 1}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* SNAP SLIDER                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Section title="SnapSlider">
        <SnapSlider className="relative w-full max-w-lg">
          <SnapSliderContent className="gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <SnapSliderItem key={i} className="min-w-[160px]">
                <div className="flex h-24 items-center justify-center rounded-lg border bg-muted text-sm font-medium">
                  Card {i + 1}
                </div>
              </SnapSliderItem>
            ))}
          </SnapSliderContent>
          <SnapSliderPrevious />
          <SnapSliderNext />
        </SnapSlider>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* ICONS                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Icons (social)">
        <Row>
          {(['twitter', 'github', 'linkedin', 'discord', 'youtube', 'slack', 'producthunt'] as const).map(
            (name) => {
              const Icon = Icons[name];
              return (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex size-8 cursor-default items-center justify-center rounded-md border">
                      <Icon size={18} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              );
            },
          )}
        </Row>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* TYPOGRAPHY / COLORS                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Typography">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Heading 1 — text-4xl bold</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2 — text-3xl semibold</h2>
          <h3 className="text-2xl font-semibold">Heading 3 — text-2xl semibold</h3>
          <h4 className="text-xl font-medium">Heading 4 — text-xl medium</h4>
          <p className="text-base text-foreground">
            Body — text-base. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-muted-foreground">
            Muted — text-sm text-muted-foreground. Secondary information, captions, helpers.
          </p>
          <p className="font-mono text-sm text-foreground">
            Mono — font-mono text-sm. Used for code, IDs, keys.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* COLOR PALETTE                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Color Tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[
            { label: 'background', cls: 'bg-background border' },
            { label: 'foreground', cls: 'bg-foreground' },
            { label: 'muted', cls: 'bg-muted' },
            { label: 'muted-foreground', cls: 'bg-muted-foreground' },
            { label: 'primary', cls: 'bg-primary' },
            { label: 'primary-foreground', cls: 'bg-primary-foreground border' },
            { label: 'secondary', cls: 'bg-secondary' },
            { label: 'secondary-foreground', cls: 'bg-secondary-foreground' },
            { label: 'accent', cls: 'bg-accent' },
            { label: 'accent-foreground', cls: 'bg-accent-foreground' },
            { label: 'destructive', cls: 'bg-destructive' },
            { label: 'border', cls: 'bg-border' },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`size-6 shrink-0 rounded ${cls}`} />
              <span className="font-mono text-xs">{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
