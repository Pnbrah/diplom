import React from 'react';


const title = 'Додаток 46';

export const metadata = {
  title,
  openGraph: {
    title,
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    
    <div className="space-y-9">
      <h1 className="text-xl font-bold">Додаток 46</h1>
      {children}
    </div>
  );
}
