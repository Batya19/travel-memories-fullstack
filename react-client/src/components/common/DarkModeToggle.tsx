import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const DarkModeToggle: React.FC = () => {
    const { toggleColorMode } = useColorMode();
    const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
    const buttonText = useColorModeValue('Switch to Dark Mode', 'Switch to Light Mode');

    return (
        <Tooltip label={buttonText} hasArrow placement="bottom">
            <IconButton
                aria-label={buttonText}
                icon={<SwitchIcon />}
                variant="ghost"
                onClick={toggleColorMode}
                size="md"
                borderRadius="md"
                _hover={{
                    bg: useColorModeValue('gray.200', 'gray.700'),
                }}
            />
        </Tooltip>
    );
};

export default DarkModeToggle;