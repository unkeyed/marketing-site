'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { submitYcApplication } from '@/app/(website)/yc/actions';
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
import { Textarea } from '@/components/ui/textarea';

const ycFormSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  ycBatch: z.string().min(3, 'YC batch must be at least 3 characters'),
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

type TYcFormValues = z.infer<typeof ycFormSchema>;

export function YcApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TYcFormValues>({
    resolver: zodResolver(ycFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      ycBatch: '',
      workspaceId: '',
      migratingFrom: '',
      moreInfo: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (values: TYcFormValues) => {
    setServerErrors([]);
    startTransition(async () => {
      const result = await submitYcApplication(values);
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
            name="ycBatch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  YC Batch <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="YCW2025" {...field} />
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
