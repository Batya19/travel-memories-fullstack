import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  IconButton,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import AppLogo from '../common/AppLogo';

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to }) => (
  <Link
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.100', 'gray.700'),
    }}
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      bg={bg}
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <Icon as={FaTimes} /> : <Icon as={FaBars} />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Box as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <AppLogo />
          </Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {currentUser && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/trips">My Trips</NavLink>
                <NavLink to="/trips/new">New Trip</NavLink>
              </>
            )}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {currentUser ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <HStack>
                  <Avatar
                    size="sm"
                    name={`${currentUser.firstName} ${currentUser.lastName}`}
                    bg="brand.500"
                  />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {currentUser.firstName}
                  </Text>
                  <Icon as={FaChevronDown} />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/settings">
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                colorScheme="brand"
                size="sm"
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="brand"
                size="sm"
              >
                Sign Up
              </Button>
            </HStack>
          )}
        </Flex>
      </Flex>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {currentUser ? (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/trips">My Trips</NavLink>
                <NavLink to="/trips/new">New Trip</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">Sign In</NavLink>
                <NavLink to="/register">Sign Up</NavLink>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;