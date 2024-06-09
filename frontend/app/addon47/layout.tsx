import React from 'react';

const title = 'Додаток 47';

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
      
      <h1 className="text-xl font-bold">Додаток 47</h1>
      {children}
    
    </div>
  );
}
