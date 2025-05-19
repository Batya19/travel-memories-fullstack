// src/hooks/useFormValidation.ts

import { useState } from 'react';

type ValidationRule<T> = (value: any, formValues: T) => string | null;

export interface FieldValidation<T> {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    match?: keyof T;
    custom?: ValidationRule<T>;
}

export type FormValidationSchema<T> = {
    [K in keyof T]?: FieldValidation<T>;
};

export function useFormValidation<T extends Record<string, any>>(validationSchema: FormValidationSchema<T>) {
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const validateField = (name: keyof T, value: any, formValues: T): string | null => {
        const fieldValidation = validationSchema[name];
        if (!fieldValidation) return null;

        // Required validation
        if (fieldValidation.required && !value) {
            return `${String(name)} is required`;
        }

        // Skip further validation if value is empty and not required
        if (!value) return null;

        // Min length validation
        if (fieldValidation.minLength && value.length < fieldValidation.minLength) {
            return `${String(name)} must be at least ${fieldValidation.minLength} characters`;
        }

        // Max length validation
        if (fieldValidation.maxLength && value.length > fieldValidation.maxLength) {
            return `${String(name)} must be ${fieldValidation.maxLength} characters or less`;
        }

        // Email validation
        if (fieldValidation.email && !/\S+@\S+\.\S+/.test(value)) {
            return 'Email is invalid';
        }

        // Pattern validation
        if (fieldValidation.pattern && !fieldValidation.pattern.test(value)) {
            return `${String(name)} format is invalid`;
        }

        // Match validation (e.g., password confirmation)
        if (fieldValidation.match && value !== formValues[fieldValidation.match]) {
            return `${String(name)} does not match ${String(fieldValidation.match)}`;
        }

        // Custom validation
        if (fieldValidation.custom) {
            return fieldValidation.custom(value, formValues);
        }

        return null;
    };

    const validateForm = (values: T): boolean => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        // Validate each field
        for (const field in validationSchema) {
            const error = validateField(field as keyof T, values[field as keyof T], values);
            if (error) {
                newErrors[field as keyof T] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const clearFieldError = (field: keyof T) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    return {
        errors,
        validateForm,
        validateField,
        clearFieldError,
        setErrors
    };
}