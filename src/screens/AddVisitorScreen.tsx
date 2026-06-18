import React from 'react';

import {CheckInWizard} from '../features/checkin/CheckInWizard';

type Props = {
  onBack: () => void;
  onSuccess: () => void;
  variant?: 'fullscreen' | 'panel';
};

export function AddVisitorScreen({onBack, onSuccess}: Props) {
  return <CheckInWizard onClose={onBack} onSuccess={onSuccess} />;
}
