interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
}

export function validateLength(value: string, fieldName: string, min: number, max: number): ValidationResult {
  if (value.length < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min} characters` };
  }
  if (value.length > max) {
    return { isValid: false, message: `${fieldName} cannot exceed ${max} characters` };
  }
  return { isValid: true };
}

export async function submitToWeb3Forms(formData: Record<string, any>) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  
  if (!accessKey) {
    throw new Error('Web3Forms access key is not configured');
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        ...formData
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Form submission failed');
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}