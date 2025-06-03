import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Divider,
    List,
    ListItem,
    ListIcon,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const TermsOfServicePage: React.FC = () => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
    const brandColor = useColorModeValue('brand.500', 'brand.400');

    return (
        <Container maxW="container.lg" py={12}>
            {/* Header Section */}
            <VStack spacing={6} align="stretch" mb={8}>
                <Box textAlign="center">
                    <Heading size="2xl" color={headingColor} mb={4}>
                        Terms of Service
                    </Heading>
                    <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
                        Please read these Terms of Service carefully before using TravelMemories.
                    </Text>
                </Box>

                <HStack justify="center" spacing={4}>
                    <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                        <HStack spacing={2}>
                            <FaCalendarAlt />
                            <Text>Last Updated: January 1, 2024</Text>
                        </HStack>
                    </Badge>
                </HStack>
            </VStack>

            <Divider mb={8} />

            {/* Terms Content */}
            <VStack spacing={8} align="stretch">
                {/* Introduction */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>1. Introduction</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            Welcome to TravelMemories ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website and services. By accessing or using TravelMemories, you agree to be bound by these Terms and our Privacy Policy.
                        </Text>
                    </CardBody>
                </Card>

                {/* Acceptance of Terms */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>2. Acceptance of Terms</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7" mb={4}>
                            By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
                        </Text>
                        <List spacing={2}>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                You must be at least 13 years old to use our services
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                You must provide accurate and complete information
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                You are responsible for maintaining account security
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* User Accounts */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>3. User Accounts</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7" mb={4}>
                            To access certain features of TravelMemories, you must create an account. You are responsible for:
                        </Text>
                        <List spacing={2}>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Maintaining the confidentiality of your account credentials
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                All activities that occur under your account
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Notifying us immediately of any unauthorized use
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* Content and Usage */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>4. Content and Usage</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Heading size="md" color={headingColor} mb={2}>Your Content</Heading>
                                <Text color={textColor} lineHeight="1.7">
                                    You retain ownership of all content you upload to TravelMemories, including photos, trip descriptions, and other materials. By uploading content, you grant us a non-exclusive license to display, store, and process your content for the purpose of providing our services.
                                </Text>
                            </Box>
                            
                            <Box>
                                <Heading size="md" color={headingColor} mb={2}>Prohibited Content</Heading>
                                <Text color={textColor} lineHeight="1.7" mb={3}>
                                    You may not upload or share content that:
                                </Text>
                                <List spacing={2}>
                                    <ListItem color={textColor}>
                                        <ListIcon as={FaCheckCircle} color="red.500" />
                                        Violates any applicable laws or regulations
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={FaCheckCircle} color="red.500" />
                                        Infringes on intellectual property rights
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={FaCheckCircle} color="red.500" />
                                        Contains harmful, offensive, or inappropriate material
                                    </ListItem>
                                    <ListItem color={textColor}>
                                        <ListIcon as={FaCheckCircle} color="red.500" />
                                        Violates privacy rights of others
                                    </ListItem>
                                </List>
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>

                {/* AI Image Generation */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>5. AI Image Generation Service</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7" mb={4}>
                            Our AI image generation feature is subject to usage limits and acceptable use policies:
                        </Text>
                        <List spacing={2}>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Free accounts receive limited AI generation credits
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Generated images must comply with our content policies
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                We reserve the right to moderate AI-generated content
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* Storage and Data */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>6. Storage and Data</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7" mb={4}>
                            We provide storage for your travel memories with the following terms:
                        </Text>
                        <List spacing={2}>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Free accounts have storage limits as specified in your account
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                We will make reasonable efforts to maintain your data
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Regular backups are recommended for important content
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* Service Availability */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>7. Service Availability</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            While we strive to provide reliable service, we cannot guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue any part of our service with reasonable notice. We are not liable for any interruption or loss of service.
                        </Text>
                    </CardBody>
                </Card>

                {/* Privacy */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>8. Privacy</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our services, you consent to the collection and use of information as described in our Privacy Policy.
                        </Text>
                    </CardBody>
                </Card>

                {/* Limitation of Liability */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>9. Limitation of Liability</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            TravelMemories is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid for our services in the past 12 months.
                        </Text>
                    </CardBody>
                </Card>

                {/* Termination */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>10. Termination</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7" mb={4}>
                            Either party may terminate this agreement at any time:
                        </Text>
                        <List spacing={2}>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                You may delete your account at any time
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                We may suspend or terminate accounts for violations
                            </ListItem>
                            <ListItem color={textColor}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Upon termination, access to your data may be limited
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* Changes to Terms */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>11. Changes to Terms</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our service. Your continued use of TravelMemories after changes constitutes acceptance of the new Terms.
                        </Text>
                    </CardBody>
                </Card>

                {/* Contact Information */}
                <Card bg={bgColor} boxShadow="md" borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="lg" color={brandColor}>12. Contact Information</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                        <Text color={textColor} lineHeight="1.7">
                            If you have any questions about these Terms of Service, please contact us at:
                        </Text>
                        <Box mt={4} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                            <Text color={textColor}>
                                <strong>Email:</strong> legal@travelmemories.com<br />
                                <strong>Address:</strong> TravelMemories Legal Department<br />
                                123 Memory Lane, Travel City, TC 12345
                            </Text>
                        </Box>
                    </CardBody>
                </Card>
            </VStack>

            <Divider my={8} />

            <Box textAlign="center" py={6}>
                <Text color={textColor} fontSize="sm">
                    These Terms of Service are effective as of January 1, 2024.
                </Text>
            </Box>
        </Container>
    );
};

export default TermsOfServicePage;