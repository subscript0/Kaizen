'use client';

import { useState, useEffect } from 'react';
import BusinessIdeaForm from './BusinessIdeaForm';

export default function IdeaFloatingButton() {
  const [open,    setOpen]    = useState(false);
  const [visible, setVisible] = useState(false);

  // Show after scrolling 400px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <BusinessIdeaForm open={open} onClose={() => setOpen(false)} />

      {/* Floating button — bottom-left, above WhatsApp button */}
      <div
        className="fixed bottom-6 left-6 z-[300] transition-all duration-300"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl shadow-black/40 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
          }}
          aria-label="Drop your project idea"
        >
          <span className="text-base">💡</span>
          <span className="hidden xs:block">Drop Your Idea</span>
        </button>
      </div>
    </>
  );
}