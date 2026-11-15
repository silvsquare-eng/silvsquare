import { useEffect, useState } from 'react';
import { SITE_CONFIG, getRepNumber, normalizeSaudiPhone } from '@/config/site';

/**
 * Returns the active sales rep WhatsApp number, keeping SSR hydration safe
 * while immediately syncing with URL/localStorage and Layout rep updates on the client.
 */
export function useRepNumber(): string {
  const [phoneNumber, setPhoneNumber] = useState<string>(() =>
    normalizeSaudiPhone(SITE_CONFIG.links?.whatsapp || '966542966582')
  );

  useEffect(() => {
    const syncRepNumber = () => {
      setPhoneNumber(getRepNumber());
    };

    syncRepNumber();
    window.addEventListener('sales-rep-updated', syncRepNumber);
    window.addEventListener('storage', syncRepNumber);
    return () => {
      window.removeEventListener('sales-rep-updated', syncRepNumber);
      window.removeEventListener('storage', syncRepNumber);
    };
  }, []);

  return phoneNumber;
}
