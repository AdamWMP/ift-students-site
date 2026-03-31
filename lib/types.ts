export interface Location {
  id: string;
  name: string;
  slug: string;
  region: string;
  address: string;
}

export interface Schedule {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  icon: string;
  times: string;
  locationId: string;
}

export interface StartDate {
  id: string;
  date: string;
  spotsLeft: number;
  scheduleId: string;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  price: number;
  fundedPrice?: number;
  description?: string;
  features: string[];
  popular: boolean;
}

export interface Tutor {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  location?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  content: string;
  imageUrl?: string;
  rating: number;
}

export interface WizardState {
  step: number;
  locationId: string | null;
  scheduleId: string | null;
  packageId: string | null;
  startDateId: string | null;
}

export interface PaymentDetails {
  totalAmount: number;
  depositAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  paymentMonths: number;
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageId: string;
  startDateId: string;
  depositAmount: number;
}
