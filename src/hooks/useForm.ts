import { useState } from 'react';
import { validateEmail, validateRequired, validateLength, submitToWeb3Forms } from '@/utils/form-validation';
import { useAnalyticsTracker } from '@/hooks/useAnalyticsTracker';

interface UseFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  formType: 'newsletter' | 'contact' | 'feedback' | 'quiz' | 'contributor';
  trackingCategory?: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export function useForm({ onSuccess, onError, formType, trackingCategory }: UseFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const { trackEvent } = useAnalyticsTracker();

  const handleSubmit = async (formData: Record<string, any>) => {
    setFormState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      // Validate email if present
      if (formData.email) {
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
          throw new Error(emailValidation.message);
        }
      }

      // Validate required fields
      const requiredFields = ['email'];
      if (formType === 'contact' || formType === 'contributor') {
        requiredFields.push('name', 'message');
      }

      for (const field of requiredFields) {
        if (formData[field]) {
          const validation = validateRequired(formData[field], field);
          if (!validation.isValid) {
            throw new Error(validation.message);
          }
        }
      }

      // Submit the form
      const result = await submitToWeb3Forms({
        ...formData,
        form_type: formType,
        timestamp: new Date().toISOString(),
      });

      // Track successful submission
      trackEvent(trackingCategory || 'forms', `${formType}_submit_success`);

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        error: null
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: errorMessage
      });

      // Track error
      trackEvent(trackingCategory || 'forms', `${formType}_submit_error`, { error: errorMessage });

      onError?.(errorMessage);
    }
  };

  const resetForm = () => {
    setFormState({
      isSubmitting: false,
      isSuccess: false,
      error: null
    });
  };

  return {
    formState,
    handleSubmit,
    resetForm
  };
}