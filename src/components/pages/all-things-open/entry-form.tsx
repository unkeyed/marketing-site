'use client';

import { useRef, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitGiveawayEntry } from '@/app/(website)/all-things-open/actions';
import {
  DESCRIPTION_MAX,
  giveawayFieldsSchema,
  MIN_SUBMIT_MS,
  TOO_FAST_MESSAGE,
  type TGiveawayFormValues,
} from '@/app/(website)/all-things-open/schema';

const emptyValues: TGiveawayFormValues = {
  projectUrl: '',
  workspaceId: '',
  description: '',
  name: '',
  email: '',
};

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

export function GiveawayEntryForm() {
  const [isPending, startTransition] = useTransition();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef(Date.now());
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<TGiveawayFormValues>({
    resolver: zodResolver(giveawayFieldsSchema),
    defaultValues: emptyValues,
    mode: 'onBlur',
  });

  const descriptionValue = form.watch('description');
  const descriptionCount = descriptionValue.trim().length;

  const onSubmit = (values: TGiveawayFormValues) => {
    setServerErrors([]);

    if (Date.now() - startedAtRef.current < MIN_SUBMIT_MS) {
      setServerErrors([TOO_FAST_MESSAGE]);
      return;
    }

    startTransition(async () => {
      const result = await submitGiveawayEntry({
        ...values,
        companyWebsite: honeypotRef.current?.value ?? '',
        startedAt: startedAtRef.current,
      });

      if (result.status === 'success') {
        setSubmitted(true);
        form.reset(emptyValues);
        requestAnimationFrame(() => {
          successHeadingRef.current?.focus();
        });
        return;
      }

      setServerErrors(result.errors);
    });
  };

  return (
    <div className="relative rounded-lg border border-border bg-panel p-6 md:p-8">
      <div className={submitted ? 'invisible' : undefined} inert={submitted || undefined}>
        <h2 className="font-display text-3xl leading-tight text-foreground">Submit your project</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Every field is required. We email you if you win.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-y-10"
            noValidate
          >
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company-website">Website</label>
              <input
                ref={honeypotRef}
                id="company-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <FormField
              control={form.control}
              name="projectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project URL <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      inputMode="url"
                      placeholder="https://my-project.example.com"
                      autoComplete="url"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Workspace ID <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ws_dYuyGV3qMKve"
                      autoComplete="off"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>From the dashboard. It starts with ws_.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What does it do? <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn(
                      'min-h-5 text-right tabular-nums',
                      descriptionCount > DESCRIPTION_MAX && 'text-destructive',
                    )}
                  >
                    {descriptionCount}/{DESCRIPTION_MAX}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ada Lovelace" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="ada@example.com"
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-sm leading-normal text-muted-foreground">
              By entering, you agree to the{' '}
              {/* TODO: James has not written the official rules yet. Replace href="#" with the rules URL. */}
              <a
                href="#"
                className="text-foreground underline decoration-gray-40 decoration-dashed decoration-[1px] underline-offset-[0.26em] transition-colors duration-300 hover:decoration-gray-70"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                official rules
              </a>
              .
            </p>

            {/* Reserved so an error or the success handoff does not push the button. */}
            <div className="min-h-16" aria-live="polite">
              {serverErrors.length > 0 ? (
                <div
                  role="alert"
                  className="rounded-md border border-red-glow/40 bg-red-glow/10 p-3 text-sm text-red-dot"
                >
                  {serverErrors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-11 w-full text-sm"
              disabled={isPending || form.formState.isSubmitting}
            >
              {isPending ? 'Submitting…' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>

      {submitted ? (
        <div className="absolute inset-0 flex flex-col justify-center rounded-lg bg-panel p-6 md:p-8">
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-display text-3xl leading-tight text-foreground outline-none"
          >
            You&apos;re in.
          </h2>
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            Thanks for entering. If you win, we&apos;ll email you.
          </p>
        </div>
      ) : null}
    </div>
  );
}
