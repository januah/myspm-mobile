// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation: min 8 chars, uppercase, lowercase, number, special char
export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Password confirmation
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

// Required field
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Get password strength feedback
export const getPasswordStrengthFeedback = (password: string): string => {
  if (!password) return "";

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  if (passedChecks === 5) return "Strong password";
  if (passedChecks >= 3) return "Good password";
  if (passedChecks >= 2) return "Fair password";
  return "Weak password";
};

// Validation error messages
export const validationMessages = {
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  passwordRequired: "Password is required",
  passwordWeak:
    "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  passwordMismatch: "Passwords do not match",
  fieldRequired: (fieldName: string) => `${fieldName} is required`,
};