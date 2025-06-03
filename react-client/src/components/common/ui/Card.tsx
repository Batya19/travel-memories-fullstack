import React, { ReactNode } from "react";
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  children: ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  ...rest
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      borderColor={borderColor}
      transition={hoverable ? "all 0.3s ease" : undefined}
      _hover={
        hoverable
          ? {
              transform: "translateY(-5px)",
              boxShadow: "lg",
              borderColor: "brand.300",
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;