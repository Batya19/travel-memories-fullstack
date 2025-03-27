import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Divider,
    useToast,
    Avatar,
    Flex,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    Progress,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaCheck, FaTimes, FaEye, FaEyeSlash, FaServer, FaBrain } from 'react-icons/fa';
import LoadingSpinner from '../components/common/feedback/LoadingSpinner';
import authService from '../services/authService';

interface UserQuota {
    storageQuotaMB: number;
    storageUsedMB: number;
    storageRemainingMB: number;
    aiQuotaTotal: number;
    aiQuotaUsed: number;
    aiQuotaRemaining: number;
}

const ProfilePage: React.FC = () => {
    const { currentUser, loading, updateProfile, changePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    // מצב לטופס שינוי סיסמה
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [quota, setQuota] = useState<UserQuota | null>(null);
    const [quotaLoading, setQuotaLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const statBgColor = useColorModeValue('brand.50', 'gray.700');
    const progressBgColor = useColorModeValue('gray.100', 'gray.600');

    // כאשר המשתמש מתקבל, מעדכנים את הטופס עם הנתונים שלו
    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
            });

            // טען מידע על הקצאת האחסון והקוואנטה
            fetchUserQuota();
        }
    }, [currentUser]);

    // פונקציה לטעינת מידע על קווטה של המשתמש
    // עדכון לפונקציית fetchUserQuota
    const fetchUserQuota = async () => {
        if (!currentUser) return;

        setQuotaLoading(true);
        try {
            // נסה לקבל קווטה, אבל אם יש שגיאה - הצג ערכים מחושבים מהמשתמש עצמו
            const quotaData = await authService.getUserQuota() as UserQuota;
            setQuota(quotaData);
        } catch (error) {
            console.error('Error fetching user quota:', error);

            // במקרה של שגיאה, השתמש במידע מהמשתמש המחובר כדי ליצור אובייקט קווטה ברירת מחדל
            setQuota({
                storageQuotaMB: currentUser.storageQuota,
                storageUsedMB: 0,
                storageRemainingMB: currentUser.storageQuota,
                aiQuotaTotal: currentUser.aiQuota,
                aiQuotaUsed: 0,
                aiQuotaRemaining: currentUser.aiQuota
            });

            // הצג הודעה למשתמש רק אם נראה לך מתאים
            // toast({
            //   title: 'Quota information',
            //   description: 'Using default quota values. Some usage information may not be available.',
            //   status: 'info',
            //   duration: 3000,
            //   isClosable: true,
            // });
        } finally {
            setQuotaLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // ניקוי שגיאות בעת הקלדה
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });

        // ניקוי שגיאות בעת הקלדה
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateProfileForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!passwordForm.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordForm.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
        }

        if (!passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateProfileForm()) return;

        setIsSaving(true);
        try {
            // שימוש בפונקציה מהקונטקסט לעדכון הפרופיל
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Error in profile update:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) return;

        setIsChangingPassword(true);
        try {
            // שימוש בפונקציה מהקונטקסט לשינוי הסיסמה
            const success = await changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );

            if (success) {
                // איפוס טופס הסיסמה
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Error in password change:', error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleCancel = () => {
        // החזרת הנתונים למצב המקורי
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
            });
        }
        setIsEditing(false);
    };

    // חישוב אחוזי ניצול משאבים
    const calculateStoragePercentage = () => {
        if (!quota) return 0;
        return Math.round((quota.storageUsedMB / quota.storageQuotaMB) * 100);
    };

    const calculateAiPercentage = () => {
        if (!quota) return 0;
        return Math.round((quota.aiQuotaUsed / quota.aiQuotaTotal) * 100);
    };

    if (loading) {
        return <LoadingSpinner text="Loading profile..." />;
    }

    if (!currentUser) {
        return (
            <Container maxW="container.xl" py={12}>
                <Text>You must be logged in to view this page.</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={12}>
            <Heading size="xl" mb={8}>My Profile</Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {/* User info card */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader bg="brand.500" py={6}>
                        <Flex direction="column" align="center">
                            <Avatar
                                size="xl"
                                name={`${currentUser.firstName} ${currentUser.lastName}`}
                                bg="white"
                                color="brand.500"
                                mb={3}
                            />
                            <Heading size="md" color="white">
                                {isEditing
                                    ? `${formData.firstName} ${formData.lastName}`
                                    : `${currentUser.firstName} ${currentUser.lastName}`}
                            </Heading>
                            <Badge mt={2} bg="white" color="brand.500">
                                {currentUser.role === 'SYSTEM_ADMIN' ? 'Administrator' : 'User'}
                            </Badge>
                        </Flex>
                    </CardHeader>

                    <CardBody>
                        <Tabs colorScheme="brand" variant="enclosed">
                            <TabList>
                                <Tab>Profile</Tab>
                                <Tab>Password</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Profile Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch">
                                        {isEditing ? (
                                            // Form for editing
                                            <Box as="form">
                                                <VStack spacing={4}>
                                                    <FormControl isInvalid={!!errors.firstName}>
                                                        <FormLabel>First Name</FormLabel>
                                                        <Input
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleInputChange}
                                                        />
                                                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                                                    </FormControl>

                                                    <FormControl isInvalid={!!errors.lastName}>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <Input
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleInputChange}
                                                        />
                                                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                                                    </FormControl>

                                                    <FormControl>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input
                                                            name="email"
                                                            value={formData.email}
                                                            isReadOnly={true}
                                                            bg="gray.100"
                                                        />
                                                    </FormControl>

                                                    <HStack spacing={4} pt={2} width="100%">
                                                        <Button
                                                            leftIcon={<FaCheck />}
                                                            colorScheme="brand"
                                                            onClick={handleSaveProfile}
                                                            isLoading={isSaving}
                                                            loadingText="Saving"
                                                            flex="1"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            leftIcon={<FaTimes />}
                                                            variant="outline"
                                                            onClick={handleCancel}
                                                            isDisabled={isSaving}
                                                            flex="1"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </HStack>
                                                </VStack>
                                            </Box>
                                        ) : (
                                            // Display user info
                                            <VStack spacing={4} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text color="gray.500">First Name:</Text>
                                                    <Text fontWeight="medium">{currentUser.firstName}</Text>
                                                </HStack>

                                                <HStack justify="space-between">
                                                    <Text color="gray.500">Last Name:</Text>
                                                    <Text fontWeight="medium">{currentUser.lastName}</Text>
                                                </HStack>

                                                <HStack justify="space-between">
                                                    <Text color="gray.500">Email:</Text>
                                                    <Text fontWeight="medium">{currentUser.email}</Text>
                                                </HStack>

                                                <Button
                                                    leftIcon={<FaEdit />}
                                                    colorScheme="brand"
                                                    onClick={() => setIsEditing(true)}
                                                    mt={2}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </VStack>
                                        )}
                                    </VStack>
                                </TabPanel>

                                {/* Password Tab */}
                                <TabPanel px={0}>
                                    <VStack spacing={4} align="stretch" as="form">
                                        <FormControl isInvalid={!!errors.currentPassword}>
                                            <FormLabel>Current Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordInputChange}
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                                        icon={showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.newPassword}>
                                            <FormLabel>New Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordInputChange}
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                                        icon={showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.confirmPassword}>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordInputChange}
                                                />
                                                <InputRightElement>
                                                    <IconButton
                                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                                        </FormControl>

                                        <Button
                                            colorScheme="brand"
                                            onClick={handleChangePassword}
                                            isLoading={isChangingPassword}
                                            loadingText="Changing Password"
                                            mt={2}
                                        >
                                            Change Password
                                        </Button>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </CardBody>
                </Card>

                {/* Account stats */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor} gridColumn={{ base: "1", md: "span 2" }}>
                    <CardHeader pb={2}>
                        <Heading size="md">Account Statistics</Heading>
                    </CardHeader>

                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Heading size="sm">Resource Usage</Heading>

                            {quotaLoading ? (
                                <Flex justify="center" py={6}>
                                    <LoadingSpinner text="Loading quota information..." size="md" />
                                </Flex>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    {/* Storage Quota */}
                                    <Box>
                                        <HStack mb={2} justify="space-between">
                                            <HStack>
                                                <FaServer />
                                                <Text fontWeight="medium">Storage Usage</Text>
                                            </HStack>
                                            <Text>
                                                {quota ? `${quota.storageUsedMB} MB / ${quota.storageQuotaMB} MB` : 'N/A'}
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={calculateStoragePercentage()}
                                            colorScheme={calculateStoragePercentage() > 90 ? 'red' : 'brand'}
                                            bg={progressBgColor}
                                            borderRadius="full"
                                            height="8px"
                                        />
                                    </Box>

                                    {/* AI Quota */}
                                    <Box>
                                        <HStack mb={2} justify="space-between">
                                            <HStack>
                                                <FaBrain />
                                                <Text fontWeight="medium">AI Generation Credits</Text>
                                            </HStack>
                                            <Text>
                                                {quota ? `${quota.aiQuotaUsed} / ${quota.aiQuotaTotal}` : 'N/A'}
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={calculateAiPercentage()}
                                            colorScheme={calculateAiPercentage() > 90 ? 'red' : 'brand'}
                                            bg={progressBgColor}
                                            borderRadius="full"
                                            height="8px"
                                        />
                                    </Box>
                                </SimpleGrid>
                            )}

                            <Divider />

                            <StatGroup>
                                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} width="100%">
                                    <Stat bg={statBgColor} p={4} borderRadius="md">
                                        <StatLabel>Storage Used</StatLabel>
                                        <StatNumber>
                                            {quota
                                                ? `${(quota.storageUsedMB / 1024).toFixed(2)} GB`
                                                : `${(currentUser.storageQuota / 1024).toFixed(2)} GB`}
                                        </StatNumber>
                                    </Stat>

                                    <Stat bg={statBgColor} p={4} borderRadius="md">
                                        <StatLabel>AI Credits</StatLabel>
                                        <StatNumber>{quota ? quota.aiQuotaRemaining : currentUser.aiQuota}</StatNumber>
                                    </Stat>

                                    <Stat bg={statBgColor} p={4} borderRadius="md">
                                        <StatLabel>Account Type</StatLabel>
                                        <StatNumber fontSize="lg">Free</StatNumber>
                                    </Stat>

                                    <Stat bg={statBgColor} p={4} borderRadius="md">
                                        <StatLabel>Member Since</StatLabel>
                                        <StatNumber fontSize="lg">2023</StatNumber>
                                    </Stat>
                                </SimpleGrid>
                            </StatGroup>

                            <Divider my={2} />

                            <Heading size="sm" mb={2}>Upgrade Options</Heading>
                            <Text color="gray.500" mb={4}>
                                Want more storage or AI image credits? Upgrade your account to access premium features.
                            </Text>
                            <Button colorScheme="brand" variant="outline">
                                View Upgrade Plans
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            </SimpleGrid>

            {/* Recent activity section */}
            <Card bg={bgColor} boxShadow="md" mt={8} borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                    <Heading size="md">Recent Activity</Heading>
                </CardHeader>

                <CardBody>
                    <Text color="gray.500">
                        Your recent trips and actions will appear here.
                    </Text>
                </CardBody>
            </Card>
        </Container>
    );
};

export default ProfilePage;