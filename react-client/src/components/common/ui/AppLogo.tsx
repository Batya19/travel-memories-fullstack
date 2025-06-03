import React from "react";
import { Flex, Box, Text, useColorModeValue } from "@chakra-ui/react";

interface AppLogoProps {
  size?: string;
  showText?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = "40px",
  showText = true,
}) => {
  const logoColor = useColorModeValue("brand.500", "brand.300");
  const textColor = useColorModeValue("brand.500", "brand.300");

  return (
    <Flex align="center">
      <Box
        h={size}
        w={size}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        color="white"
        bg={logoColor}
        borderRadius="md"
      >
        TM
      </Box>

      {showText && (
        <Text fontWeight="bold" fontSize="lg" color={textColor} ml={2}>
          TravelMemories
        </Text>
      )}
    </Flex>
  );
};

export default AppLogo;