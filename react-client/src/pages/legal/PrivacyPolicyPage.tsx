import React from "react";
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
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";

const PrivacyPolicyPage: React.FC = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  return (
    <Container maxW="container.lg" py={12}>
      {/* Header Section */}
      <VStack spacing={6} align="stretch" mb={8}>
        <Box textAlign="center">
          <Heading size="2xl" color={headingColor} mb={4}>
            Privacy Policy
          </Heading>
          <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information on TravelMemories.
          </Text>
        </Box>

        <HStack justify="center" spacing={4} flexWrap="wrap">
          <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
            <HStack spacing={2}>
              <FaCalendarAlt />
              <Text>Last Updated: January 1, 2024</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="green" px={3} py={1} borderRadius="full">
            <HStack spacing={2}>
              <FaShieldAlt />
              <Text>GDPR Compliant</Text>
            </HStack>
          </Badge>
        </HStack>
      </VStack>

      <Divider mb={8} />

      {/* Privacy Content */}
      <VStack spacing={8} align="stretch">
        {/* Information We Collect */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              1. Information We Collect
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  Personal Information
                </Heading>
                <Text color={textColor} lineHeight="1.7" mb={3}>
                  When you create an account with TravelMemories, we collect:
                </Text>
                <List spacing={2}>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Name and email address
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Profile information you provide
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Account preferences and settings
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  Content and Media
                </Heading>
                <Text color={textColor} lineHeight="1.7" mb={3}>
                  We store the travel content you create and upload:
                </Text>
                <List spacing={2}>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Photos and images you upload
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Trip descriptions, notes, and memories
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Location data associated with your trips
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    AI-generated images and prompts
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  Usage Information
                </Heading>
                <Text color={textColor} lineHeight="1.7" mb={3}>
                  We automatically collect certain information about your use of
                  our service:
                </Text>
                <List spacing={2}>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Log data and IP addresses
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Browser type and version
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Pages visited and features used
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Device information and screen resolution
                  </ListItem>
                </List>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* How We Use Information */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              2. How We Use Your Information
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              We use the information we collect to provide and improve our
              services:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Create and maintain your account
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Store and organize your travel memories
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Process AI image generation requests
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Provide customer support and respond to inquiries
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Improve our services and develop new features
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Send important updates about your account
              </ListItem>
            </List>
          </CardBody>
        </Card>

        {/* Information Sharing */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              3. Information Sharing
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              We do not sell, trade, or rent your personal information. We may
              share information only in the following circumstances:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="orange.500" />
                With your explicit consent for trip sharing features
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="orange.500" />
                With service providers who help us operate our platform
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="orange.500" />
                When required by law or to protect our legal rights
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="orange.500" />
                In connection with a business transfer or merger
              </ListItem>
            </List>
          </CardBody>
        </Card>

        {/* Data Security */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <HStack>
              <FaLock color={brandColor} />
              <Heading size="lg" color={brandColor}>
                4. Data Security
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              We implement industry-standard security measures to protect your
              information:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                SSL encryption for all data transmission
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Secure cloud storage with regular backups
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Access controls and authentication requirements
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Regular security audits and updates
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Employee training on data protection practices
              </ListItem>
            </List>
          </CardBody>
        </Card>

        {/* Your Rights */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              5. Your Privacy Rights
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              You have the following rights regarding your personal information:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="purple.500" />
                <strong>Access:</strong> Request a copy of your personal data
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="purple.500" />
                <strong>Rectification:</strong> Correct inaccurate or incomplete
                data
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="purple.500" />
                <strong>Erasure:</strong> Request deletion of your account and
                data
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="purple.500" />
                <strong>Portability:</strong> Export your data in a common
                format
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="purple.500" />
                <strong>Objection:</strong> Opt-out of certain data processing
                activities
              </ListItem>
            </List>
          </CardBody>
        </Card>

        {/* Cookies and Tracking */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              6. Cookies and Tracking
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <Text color={textColor} lineHeight="1.7">
                We use cookies and similar technologies to enhance your
                experience on TravelMemories:
              </Text>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  Essential Cookies
                </Heading>
                <List spacing={2}>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="red.500" />
                    Authentication and session management
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="red.500" />
                    Security and fraud prevention
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading size="md" color={headingColor} mb={2}>
                  Analytics Cookies
                </Heading>
                <List spacing={2}>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Usage statistics and performance monitoring
                  </ListItem>
                  <ListItem color={textColor}>
                    <ListIcon as={FaCheckCircle} color="blue.500" />
                    Feature usage and optimization data
                  </ListItem>
                </List>
              </Box>

              <Text color={textColor} lineHeight="1.7" fontSize="sm">
                You can manage cookie preferences through your browser settings.
                Note that disabling certain cookies may affect the functionality
                of our service.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Data Retention */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              7. Data Retention
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              We retain your information for as long as necessary to provide our
              services:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Account data: Until you delete your account
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Travel content: As long as your account is active
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Usage logs: Up to 2 years for security purposes
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="blue.500" />
                Support communications: Up to 3 years
              </ListItem>
            </List>
          </CardBody>
        </Card>

        {/* Third-Party Services */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              8. Third-Party Services
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              TravelMemories integrates with third-party services to provide
              enhanced functionality:
            </Text>
            <List spacing={2}>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Cloud storage providers for secure data backup
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                AI image generation services
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Map and location services
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Analytics and performance monitoring
              </ListItem>
            </List>
            <Text color={textColor} lineHeight="1.7" mt={4} fontSize="sm">
              These services have their own privacy policies, and we encourage
              you to review them.
            </Text>
          </CardBody>
        </Card>

        {/* Children's Privacy */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              9. Children's Privacy
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7">
              TravelMemories is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If we discover that a child under 13 has provided us
              with personal information, we will promptly delete it. If you
              believe a child has provided us with personal information, please
              contact us immediately.
            </Text>
          </CardBody>
        </Card>

        {/* International Transfers */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              10. International Data Transfers
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your data when it crosses borders, including adherence
              to international data protection frameworks and contractual
              protections with our service providers.
            </Text>
          </CardBody>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              11. Changes to This Privacy Policy
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable laws. We will notify you of
              any material changes via email or through our service. Your
              continued use of TravelMemories after any changes constitutes
              acceptance of the updated Privacy Policy.
            </Text>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card
          bg={bgColor}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading size="lg" color={brandColor}>
              12. Contact Us
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Text color={textColor} lineHeight="1.7" mb={4}>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </Text>
            <Box
              p={4}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="md"
            >
              <Text color={textColor}>
                <strong>Privacy Officer:</strong> privacy@travelmemories.com
                <br />
                <strong>General Support:</strong> support@travelmemories.com
                <br />
                <strong>Address:</strong> TravelMemories Privacy Department
                <br />
                123 Memory Lane, Travel City, TC 12345
                <br />
                <strong>Phone:</strong> +1 (555) 123-4567
              </Text>
            </Box>
            <Text color={textColor} lineHeight="1.7" mt={4} fontSize="sm">
              For EU residents: You also have the right to lodge a complaint
              with your local data protection authority.
            </Text>
          </CardBody>
        </Card>
      </VStack>

      <Divider my={8} />

      <Box textAlign="center" py={6}>
        <Text color={textColor} fontSize="sm">
          This Privacy Policy is effective as of January 1, 2024.
        </Text>
      </Box>
    </Container>
  );
};

export default PrivacyPolicyPage;
