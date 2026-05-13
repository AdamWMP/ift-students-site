'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, User } from 'lucide-react';
import type { ContactData } from './onboarding-content';

const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry / L\'Derry', 'Donegal',
  'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
  'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
];

const REFERRAL_SOURCES = [
  'Instagram', 'Facebook', 'TikTok', 'Google', 'Friend/Family Referral',
  'Current/Past Student Referral', 'Gym', 'Other',
];

const MOTIVATIONS = [
  'Career Change', 'Upskilling', 'Passion for Fitness',
  'Help Others', 'Start a Business', 'Other',
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const TSHIRT_SIZES = [
  'Mens XS', 'Womens XS',
  'Mens Small', 'Womens Small',
  'Mens Medium', 'Womens Medium',
  'Mens Large', 'Womens Large',
  'Mens XL', 'Womens XL',
  'Mens XXL', 'Womens XXL',
];

interface StudentProfileFormProps {
  contact: ContactData;
  onComplete: () => void;
  isCompleted: boolean;
}

export function StudentProfileForm({ contact, onComplete, isCompleted }: StudentProfileFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    certificateFirstName: contact.firstName,
    certificateLastName: contact.lastName,
    phone: contact.phone,
    shippingFullName: `${contact.firstName} ${contact.lastName}`,
    shippingLine1: '',
    shippingLine2: '',
    shippingCity: '',
    shippingCounty: '',
    shippingEircode: '',
    dateOfBirth: '',
    gender: '',
    tshirtSize: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    medicalConditions: '',
    industry: '',
    occupation: '',
    referralSource: '',
    referralName: '',
    motivation: '',
    additionalNotes: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const isReferral = form.referralSource.includes('Referral');

  if (isCompleted) {
    return (
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6 text-center">
        <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-semibold">Profile Complete</p>
        <p className="text-zinc-500 text-sm mt-1">Your details have been saved successfully.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!form.certificateFirstName || !form.certificateLastName) {
      setError('Certificate name is required');
      return;
    }
    if (!form.shippingLine1 || !form.shippingCity || !form.shippingCounty) {
      setError('Shipping address is required for your welcome pack and certificate');
      return;
    }
    if (!form.nextOfKinName || !form.nextOfKinPhone) {
      setError('Emergency contact details are required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id, ...form }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-sm text-zinc-400 mb-1';
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-5 h-5 text-gold" />
        <h3 className="text-white font-semibold">Student Profile</h3>
      </div>

      {/* Certificate Details */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Certificate Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First Name (on certificate)</label>
            <input type="text" value={form.certificateFirstName} onChange={e => update('certificateFirstName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name (on certificate)</label>
            <input type="text" value={form.certificateLastName} onChange={e => update('certificateLastName', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Contact</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={contact.email} readOnly className={`${inputClass} opacity-50 cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Shipping Address (Welcome Pack & Certificate)</p>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" value={form.shippingFullName} onChange={e => update('shippingFullName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address Line 1 *</label>
            <input type="text" value={form.shippingLine1} onChange={e => update('shippingLine1', e.target.value)} className={inputClass} placeholder="Street address" />
          </div>
          <div>
            <label className={labelClass}>Address Line 2</label>
            <input type="text" value={form.shippingLine2} onChange={e => update('shippingLine2', e.target.value)} className={inputClass} placeholder="Apt, suite, etc. (optional)" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>City *</label>
              <input type="text" value={form.shippingCity} onChange={e => update('shippingCity', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>County *</label>
              <select value={form.shippingCounty} onChange={e => update('shippingCounty', e.target.value)} className={selectClass}>
                <option value="">Select...</option>
                {IRISH_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Eircode</label>
              <input type="text" value={form.shippingEircode} onChange={e => update('shippingEircode', e.target.value)} className={inputClass} placeholder="e.g. D01 AB12" />
            </div>
          </div>
        </div>
      </div>

      {/* Personal */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Personal</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>T-Shirt Size</label>
            <select value={form.tshirtSize} onChange={e => update('tshirtSize', e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {TSHIRT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Emergency Contact</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Next of Kin *</label>
            <input type="text" value={form.nextOfKinName} onChange={e => update('nextOfKinName', e.target.value)} className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input type="tel" value={form.nextOfKinPhone} onChange={e => update('nextOfKinPhone', e.target.value)} className={inputClass} placeholder="+353..." />
          </div>
          <div>
            <label className={labelClass}>Relationship</label>
            <input type="text" value={form.nextOfKinRelationship} onChange={e => update('nextOfKinRelationship', e.target.value)} className={inputClass} placeholder="e.g. Parent, Partner" />
          </div>
        </div>
      </div>

      {/* Medical */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">Medical</p>
        <label className={labelClass}>Do you have any medical conditions?</label>
        <textarea value={form.medicalConditions} onChange={e => update('medicalConditions', e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="List any conditions, allergies, or medications..." />
      </div>

      {/* About You */}
      <div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">About You</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Industry You Work In</label>
              <input type="text" value={form.industry} onChange={e => update('industry', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Occupation (Optional)</label>
              <input type="text" value={form.occupation} onChange={e => update('occupation', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Where did you hear about us?</label>
            <select value={form.referralSource} onChange={e => update('referralSource', e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {isReferral && (
            <div>
              <label className={labelClass}>Referral Name</label>
              <input type="text" value={form.referralName} onChange={e => update('referralName', e.target.value)} className={inputClass} placeholder="Who referred you?" />
            </div>
          )}
          <div>
            <label className={labelClass}>What motivated you to do the course?</label>
            <select value={form.motivation} onChange={e => update('motivation', e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {MOTIVATIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Anything else you think we should know?</label>
            <textarea value={form.additionalNotes} onChange={e => update('additionalNotes', e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Optional..." />
          </div>
        </div>
      </div>

      {/* Submit */}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 bg-gold text-black font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Save Profile
      </motion.button>
    </div>
  );
}
