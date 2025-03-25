import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Collapse,
  Link,
  useColorModeValue,
  useDisclosure,
  Container,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import DarkModeToggle from '../common/DarkModeToggle';

const Header: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const backgroundColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <Box
      as="header"
      bg={backgroundColor}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      boxShadow={'sm'}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} align={'center'} justify={'space-between'}>
          <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
            <Link as={RouterLink} to={'/'} fontWeight={'bold'} fontSize={'xl'} color={brandColor}>
              TravelMemories
            </Link>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={4} align={'center'}>
                {currentUser && (
                  <>
                    <Link as={RouterLink} to={'/trips'} color={textColor} fontWeight={500}>
                      My Trips
                    </Link>
                    {/* יכולים להוסיף עוד לינקים כאן */}
                  </>
                )}
              </Stack>
            </Flex>
          </Flex>

          {currentUser ? (
            <HStack spacing={4}>
              {/* כפתור מצב אפל נוסף כאן */}
              <DarkModeToggle />

              <Button
                as={RouterLink}
                to="/trips/new"
                size="sm"
                colorScheme="brand"
                leftIcon={<FaPlus />}
                display={{ base: 'none', md: 'inline-flex' }}
              >
                New Trip
              </Button>

              <Menu>
                <MenuButton 
                  as={Button} 
                  variant="ghost" 
                  rightIcon={<ChevronDownIcon />}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                >
                  <HStack>
                    <Avatar
                      size={'xs'}
                      name={currentUser.firstName + ' ' + currentUser.lastName}
                      bg={'brand.500'}
                    />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {currentUser.firstName}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList bg={backgroundColor} borderColor={borderColor}>
                  <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>

              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
              />
            </HStack>
          ) : (
            <HStack spacing={4}>
              <DarkModeToggle /> {/* כפתור מצב אפל נוסף כאן גם למצב לא מחובר */}
              <Button as={RouterLink} to="/login" variant={'ghost'} fontWeight={400}>
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                colorScheme={'brand'}
              >
                Sign Up
              </Button>
            </HStack>
          )}
        </Flex>

        {/* תפריט נייד שנפתח */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            pb={4}
            display={{ md: 'none' }}
            borderBottomWidth={1}
            borderColor={borderColor}
          >
            <Stack as={'nav'} spacing={4}>
              {currentUser ? (
                <>
                  <Link as={RouterLink} to={'/trips'} fontWeight={500}>
                    My Trips
                  </Link>
                  <Button
                    as={RouterLink}
                    to="/trips/new"
                    size="sm"
                    colorScheme="brand"
                    leftIcon={<FaPlus />}
                  >
                    New Trip
                  </Button>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme={'brand'}
                  w="full"
                >
                  Sign Up
                </Button>
              )}
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Header;