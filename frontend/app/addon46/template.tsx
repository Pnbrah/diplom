import { GeneralBlock } from '@/app/ui/main-block';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return <GeneralBlock>{children}</GeneralBlock>;
}