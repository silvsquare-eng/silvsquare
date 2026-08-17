import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { getLenis } from './useLenis';

export const isModalOpen = atom(false);

export function openModal() {
  isModalOpen.set(true);
  const lenis = getLenis();
  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  isModalOpen.set(false);
  const lenis = getLenis();
  if (lenis) lenis.start();
  document.body.style.overflow = '';
}

export function useModal() {
  const isOpen = useStore(isModalOpen);
  return { isOpen, openModal, closeModal };
}
