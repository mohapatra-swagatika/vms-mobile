import {useCallback, useState} from 'react';

import {strings} from '../../constants';
import {validateEmail} from '../../utils/validation';
import {
  CHECK_IN_STEPS,
  CheckInFormData,
  INITIAL_CHECK_IN_FORM,
} from './constants';

export function useCheckInWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<CheckInFormData>(INITIAL_CHECK_IN_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const step = CHECK_IN_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === CHECK_IN_STEPS.length - 1;

  const updateField = useCallback(
    <K extends keyof CheckInFormData>(key: K, value: CheckInFormData[K]) => {
      setForm(current => ({...current, [key]: value}));
      setErrors(current => {
        if (!current[key]) {
          return current;
        }
        const next = {...current};
        delete next[key];
        return next;
      });
    },
    [],
  );

  const validateStep = useCallback((): boolean => {
    const nextErrors: Record<string, string> = {};

    if (step === 'contact') {
      if (!form.phone.trim() && !form.email.trim()) {
        nextErrors.phone = strings.checkIn.contactRequired;
      }
      if (form.email.trim() && validateEmail(form.email)) {
        nextErrors.email = validateEmail(form.email)!;
      }
    }

    if (step === 'personal' && !form.name.trim()) {
      nextErrors.name = strings.addVisitor.nameRequired;
    }

    if (step === 'host') {
      if (!form.purpose) {
        nextErrors.purpose = strings.checkIn.purposeRequired;
      }
      if (!form.hostName.trim()) {
        nextErrors.hostName = strings.checkIn.hostRequired;
      }
      if (form.hostEmail.trim() && validateEmail(form.hostEmail)) {
        nextErrors.hostEmail = strings.addVisitor.invalidHostEmail;
      }
    }

    if (step === 'photo' && !form.photoUri) {
      nextErrors.photo = strings.checkIn.photoRequired;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, step]);

  const goNext = useCallback(() => {
    if (!validateStep()) {
      return false;
    }
    setStepIndex(current => Math.min(current + 1, CHECK_IN_STEPS.length - 1));
    return true;
  }, [validateStep]);

  const goBack = useCallback(() => {
    setStepIndex(current => Math.max(current - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setForm(INITIAL_CHECK_IN_FORM);
    setErrors({});
  }, []);

  return {
    step,
    stepIndex,
    totalSteps: CHECK_IN_STEPS.length,
    form,
    errors,
    isFirstStep,
    isLastStep,
    updateField,
    goNext,
    goBack,
    reset,
    setErrors,
  };
}
