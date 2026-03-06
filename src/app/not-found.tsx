import { MENUS } from '@/constants/menus';

import { Link } from '@/components/ui/link';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header menuItems={MENUS.header} />
      <main className="flex grow">
        <section className="not-found flex grow items-center justify-center px-5 py-20 md:px-8">
          <div className="flex max-w-md flex-col items-center justify-center md:max-w-lg">
            <h1 className="text-8xl leading-none font-semibold tracking-tighter text-foreground md:text-9xl md:leading-none">
              <span className="sr-only">Error</span>404
              <span className="sr-only">: Page Not Found</span>
            </h1>
            <p className="mt-2.5 text-center text-base leading-normal tracking-tight text-foreground md:text-lg md:leading-normal">
              We know this isn&apos;t where you intended to land, but we hope you have some fun
              while you&apos;re here.
            </p>
            <Link className="mt-6 xl:mt-8" href="/">
              Go to homepage
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
