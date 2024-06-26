import '@/styles/globals.css';
import { NavMenu } from '@/app/ui/nav-menu';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading  from './loading';


export const metadata: Metadata = {
  title: {
    default: 'Електронний облік',
    template: '%s | Електронний облік',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="bg-gray-1100 overflow-y-auto max-h-dvh]">
        <NavMenu />
        <Suspense fallback={<Loading />}>
          <div className="lg:pl-72">
            <div className="mx-auto space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
              <div className="bg-vc-border-gradient rounded-lg p-px shadow-lg shadow-black/20">
                <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
              </div>
            </div>
          </div>
        </Suspense>
      </body>
    </html>
  );
}
