'use client';

import React, { useState } from 'react';
import { ComicPanel } from '@/components/ui/ComicPanel';
import { ComicButton } from '@/components/ui/ComicButton';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate comic splash success state
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ComicPanel skewAngle="none" className="p-8 text-center bg-accent text-accent-foreground border-3 shadow-comic-lg">
        <h3 className="font-comic-header text-5xl uppercase tracking-wider mb-2 animate-wiggle select-none text-stroke-black">
          KABOOM!
        </h3>
        <p className="font-comic-title text-xl uppercase tracking-widest mb-4">
          Message Dispatched Successfully!
        </p>
        <p className="font-semibold text-sm leading-relaxed max-w-md mx-auto mb-6">
          Your transmission has been routed to Yogesh's communications terminal. Expect coordinates and follow-up data feeds shortly.
        </p>
        <ComicButton
          variant="primary"
          size="sm"
          onClick={() => {
            setName('');
            setEmail('');
            setMessage('');
            setSubmitted(false);
          }}
        >
          Send Another Directive
        </ComicButton>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel skewAngle="right" className="p-8">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-comic-title text-sm uppercase tracking-wider text-muted-foreground" htmlFor="name">
              Agent Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="E.G. T'CHALLA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-3 border-border-color p-3 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md text-foreground"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-comic-title text-sm uppercase tracking-wider text-muted-foreground" htmlFor="email">
              Agent Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="E.G. AVENGERS@SHIELD.GOV"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-3 border-border-color p-3 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md text-foreground"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-comic-title text-sm uppercase tracking-wider text-muted-foreground" htmlFor="message">
            Directive / Mission Details
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="DESCRIBE THE TARGET CRITICAL WORK OBJECTIVE..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-3 border-border-color p-3 bg-background focus:outline-none focus:bg-accent font-semibold placeholder-muted-foreground/60 shadow-comic-md resize-none text-foreground"
            required
          ></textarea>
        </div>

        <div className="flex justify-center mt-2">
          <ComicButton variant="primary" size="lg" type="submit" className="w-full sm:w-auto">
            LAUNCH DIRECTIVE!
          </ComicButton>
        </div>
      </form>
    </ComicPanel>
  );
}
export default ContactForm;
