import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

let openDialogCount = 0;
let previousBodyOverflow = '';

interface DialogProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Dialog({ title, eyebrow, description, children, onClose, className = '' }: DialogProps) {
  const titleId = useId();
  const container = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    if (openDialogCount === 0) previousBodyOverflow = document.body.style.overflow;
    openDialogCount += 1;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => container.current?.querySelector<HTMLButtonElement>('button')?.focus(), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs[dialogs.length - 1] !== container.current) return;
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab' || !container.current) return;
      const elements = Array.from(container.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, [tabindex="0"]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      openDialogCount = Math.max(0, openDialogCount - 1);
      if (openDialogCount === 0) document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (openDialogCount === 0) previous?.focus();
    };
  }, []);

  return createPortal(
    <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={container} className={`dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
        <button className="icon-button dialog-close" onClick={onClose} aria-label="Close dialog"><X size={20}/></button>
        <div className="dialog-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id={titleId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {children}
      </motion.div>
    </motion.div>, document.fullscreenElement ?? document.body,
  );
}