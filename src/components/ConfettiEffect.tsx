import React from 'react';
import { CelebrationEffect } from './CelebrationEffect';

interface ConfettiEffectProps {
  show: boolean;
  xpEarned?: number;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = (props) => {
  return <CelebrationEffect {...props} />;
};

export { CelebrationEffect };

