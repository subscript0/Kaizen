import type { Metadata } from 'next';
import GuestbookSection from '@/components/sections/GuestbookSection';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Leave a message or read what others have to say.',
};

export default function GuestbookPage() {
  /* No wrapper padding: the mobile tab bar is at the BOTTOM of the viewport and
     the desktop header floats at `top-4`, so the section owns its own top space
     (`pt-10 md:pt-16`). The extra `pt-16` here was pure dead scroll on mobile. */
  return <GuestbookSection />;
}
