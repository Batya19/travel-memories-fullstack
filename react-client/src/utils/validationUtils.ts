export const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
};

export const validatePassword = (
    password: string,
    minLength: number = 8,
    maxLength: number = 30
): string | null => {
    if (!password) return 'Password is required';
    if (password.length < minLength) return `Password must be at least ${minLength} characters`;
    if (password.length > maxLength) return `Password must be ${maxLength} characters or less`;
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Email is invalid';
    return null;
};

export const validateRequired = (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || !value.trim()) return `${fieldName} is required`;
    return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
};

