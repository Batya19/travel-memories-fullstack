import { useState, ChangeEvent, FormEvent } from 'react';

type FormErrors = Record<string, string>;
type Validator<T> = (values: T) => FormErrors;

interface UseFormProps<T> {
    initialValues: T;
    validate: Validator<T>;
    onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit
}: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const setValue = (name: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));

        // Clear error if exists
        if (errors[name as string]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as string];
                return newErrors;
            });
        }
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValue
    };
}