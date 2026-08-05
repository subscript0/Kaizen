'use client';

import { useState, useEffect } from 'react';
import { personalInfo } from '@/lib/data';

export default function WhatsAppCTA() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show after 8 seconds, only if not already dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('wa-dismissed')) return;
    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Auto-expand after appearing
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setExpanded(true), 600);
    return () => clearTimeout(t);
  }, [visible]);

  const dismiss = () => {
    setExpanded(false);
    setTimeout(() => {
      setVisible(false);
      setDismissed(true);
      sessionStorage.setItem('wa-dismissed', '1');
    }, 300);
  };

  if (dismissed) return null;

  return (
    <section
      className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-2 pointer-events-auto"
      data-reveal
      aria-live="polite"
    >
      {/* Expanded card */}
      <div
        className="flex w-[280px] flex-col rounded-xl border border-border/30 shadow-lg shadow-black/40 bg-background-light/30 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] opacity-0 translate-y-4 pointer-events-none"
        style={{
          opacity: expanded && visible ? 1 : 0,
          pointerEvents: expanded && visible ? 'auto' : 'none',
          transform: expanded && visible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        {/* Green header */}
        <div className="flex items-center justify-between px-4 py-3 rounded-t-xl bg-primary">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.855L0 24l6.338-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.519-5.18-1.423l-.37-.222-3.836.91.974-3.72-.242-.382A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <span className="text-sm font-semibold text-primary-foreground">Learning Group</span>
          </div>
          <button onClick={dismiss} className="text-primary-foreground/80 hover:text-primary-foreground text-lg leading-none" aria-label="Close">×</button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-sm font-semibold mb-1 text-foreground">
            Join the Dev Circle 👋
          </p>
          <p className="text-xs leading-relaxed mb-4 text-muted-foreground/70">
            A WhatsApp group for developers — sharing resources, project feedback, job leads, and accountability. Free to join.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={personalInfo.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:shadow-sm"
              onClick={dismiss}
              data-magnetic
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.855L0 24l6.338-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.519-5.18-1.423l-.37-.222-3.836.91.974-3.72-.242-.382A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Join WhatsApp Group
            </a>
            <button onClick={dismiss}
              className="text-xs py-1.5 w-full text-center text-muted-foreground/60 hover:text-muted-foreground/80 transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>

      {/* Floating button */}
      {visible && (
        <button
          onClick={() => setExpanded(v => !v)}
          aria-label="Open WhatsApp learning group invite"
          className="w-14 h-14 rounded flex items-center justify-center shadow-2xl shadow-black/40 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.855L0 24l6.338-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.519-5.18-1.423l-.37-.222-3.836.91.974-3.72-.242-.382A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          {/* Pulse ring */}
          <span className="absolute -z-10 w-14 h-14 rounded animate-ping opacity-30" style={{ backgroundColor: '#25D366' }} />
        </button>
      )}
    </section>
  );
}