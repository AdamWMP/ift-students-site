'use client';

import { useState } from 'react';
import { CheckoutContent } from '@/components/checkout/checkout-content';
import { PilatesCheckoutContent } from '@/components/checkout/pilates-checkout-content';
import { packages as ptPackages } from '@/lib/course-data';

type Track = 'pt' | 'pilates';

// /enrol-only minimum deposit override for the three flagship packages.
// ptcheckout.imageft.ie keeps the €500 floor defined in lib/course-data.ts.
const ENROL_PT_MIN_DEPOSIT_OVERRIDES: Record<string, number> = {
  'pro-coach': 200,
  'complete-coach': 200,
  'fitness-business-coach': 200,
};

const enrolPtPackages = ptPackages.map((p) =>
  ENROL_PT_MIN_DEPOSIT_OVERRIDES[p.id] !== undefined
    ? { ...p, minDeposit: ENROL_PT_MIN_DEPOSIT_OVERRIDES[p.id] }
    : p,
);

export function UnifiedCheckout() {
  const [track, setTrack] = useState<Track>('pt');

  return (
    <div>
      <div className="bg-charcoal-950 pt-28 pb-2">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Choose course type"
              className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-charcoal-900/60 p-1 backdrop-blur"
            >
              <TabButton
                active={track === 'pt'}
                onClick={() => setTrack('pt')}
                label="Personal Training"
                sub="PT · Group · Business"
              />
              <TabButton
                active={track === 'pilates'}
                onClick={() => setTrack('pilates')}
                label="Pilates"
                sub="Mat · Reformer · Studio"
              />
            </div>
          </div>
        </div>
      </div>

      {track === 'pt' ? (
        // /enrol uses an overridden package list: Cert/Career/Business min
        // deposit dropped to €200 here only; standalone PT/Group/Bundles keep €300.
        <CheckoutContent packageList={enrolPtPackages} />
      ) : (
        <PilatesCheckoutContent />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'px-5 sm:px-7 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all',
        active
          ? 'bg-gold-500 text-charcoal-950 shadow-lg shadow-gold-500/30'
          : 'text-gold-100/80 hover:text-white hover:bg-charcoal-800',
      ].join(' ')}
    >
      <span className="block leading-tight">{label}</span>
      <span
        className={[
          'block text-[10px] sm:text-xs font-normal leading-tight mt-0.5',
          active ? 'text-charcoal-900/80' : 'text-gold-100/50',
        ].join(' ')}
      >
        {sub}
      </span>
    </button>
  );
}
