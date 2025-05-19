import React from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputProps,
    FormControlProps
} from '@chakra-ui/react';

interface FormInputProps extends InputProps {
    name: string;
    label?: string;
    error?: string;
    formControlProps?: FormControlProps;
    isRequired?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    error,
    formControlProps,
    isRequired = false,
    ...rest
}) => {
    return (
        <FormControl
            isInvalid={!!error}
            isRequired={isRequired}
            {...formControlProps}
        >
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <Input
                id={name}
                name={name}
                {...rest}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default FormInput;