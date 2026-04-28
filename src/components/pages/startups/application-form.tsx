'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { submitStartupsApplication } from '@/app/(website)/startups/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export const VC_ACCELERATOR_OPTIONS = [
  'Arc',
  'Essence',
  'Homebrew',
  'Preston Werner Ventures',
  'Seedcamp',
  'Sunflower Capital',
  'Techstars',
  'Uncork',
  'Vercel OSS',
  'YC',
  'Other',
] as const;

const startupsFormSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  workingWith: z.string().min(1, 'Please select your VC or accelerator'),
  workspaceId: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.startsWith('ws_'),
      "Workspace ID must start with 'ws_'",
    ),
  migratingFrom: z.string().optional(),
  moreInfo: z.string().optional(),
});

type TStartupsFormValues = z.infer<typeof startupsFormSchema>;

export function StartupsApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TStartupsFormValues>({
    resolver: zodResolver(startupsFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      workingWith: '',
      workspaceId: '',
      migratingFrom: '',
      moreInfo: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (values: TStartupsFormValues) => {
    setServerErrors([]);
    startTransition(async () => {
      const result = await submitStartupsApplication(values);
      if (result.status === 'success') {
        setSubmitted(true);
        form.reset();
      } else {
        setServerErrors(result.errors);
      }
    });
  };

  return (
    <div className="rounded-lg border border-border bg-panel p-6 md:p-8">
      <h2 className="font-display text-3xl leading-tight text-foreground">Apply now</h2>
      <p className="mt-2 text-base text-muted-foreground">
        Complete the fields below and we&apos;ll be in touch.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-y-7">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Bruce Wayne" autoComplete="name" {...field} />
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
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="bruce.wayne@gotham.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingWith"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Working With <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your VC or accelerator" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VC_ACCELERATOR_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workspaceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace ID</FormLabel>
                <FormControl>
                  <Input placeholder="ws_123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="migratingFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Migrating From</FormLabel>
                <FormControl>
                  <Input placeholder="we are coming from Railway" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moreInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>More Info</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitted && (
            <p className="rounded-md border border-green-glow/40 bg-green-glow/10 p-3 text-sm text-green-dot">
              Thank you for your submission! We&apos;ll be in touch soon.
            </p>
          )}

          {serverErrors.length > 0 && (
            <div className="rounded-md border border-red-glow/40 bg-red-glow/10 p-3 text-sm text-red-dot">
              {serverErrors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

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
  );
}
