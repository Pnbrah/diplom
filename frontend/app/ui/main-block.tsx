import clsx from 'clsx';
import React from 'react';


export const GeneralBlock = ({
  children,
  size = 'default',
}: {
  children: React.ReactNode;
  labels?: string[];
  size?: 'small' | 'default';
}) => {
  return (
    <div
      className={clsx('relative rounded-lg border border-dashed', {
        'p-3 lg:p-5': size === 'small',
        'p-4 lg:p-9': size === 'default',
      })}
    >
      {children}
    </div>
  );
};
