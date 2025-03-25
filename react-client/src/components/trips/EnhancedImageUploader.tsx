import React, { useState, useCallback, useRef } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    useToast,
    Progress,
    VStack,
    HStack,
    Icon,
    SimpleGrid,
    IconButton,
    Tooltip,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';
import {
    FaUpload,
    FaTrash,
    FaCheck,
    FaExclamationTriangle,
    FaImage,
} from 'react-icons/fa';
import imageService from '../../services/imageService';
import { useDropzone } from 'react-dropzone';

interface EnhancedImageUploaderProps {
    tripId: string;
    onUploadComplete?: () => void;
    maxFiles?: number;
    maxSizeInMB?: number;
    allowedTypes?: string[];
}

interface PreviewFile extends File {
    id: string;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    errorMessage?: string;
}

const EnhancedImageUploader: React.FC<EnhancedImageUploaderProps> = ({
    tripId,
    onUploadComplete,
    maxFiles = 10,
    maxSizeInMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const toast = useToast();
    const currentFileRef = useRef<number>(0);

    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const activeBorderColor = useColorModeValue('brand.300', 'brand.400');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

    const formatFileSize = (size: number): string => {
        if (size < 1024) {
            return `${size} B`;
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        } else {
            return `${(size / (1024 * 1024)).toFixed(1)} MB`;
        }
    };

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Check file type
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Unsupported file type "${file.type.split('/')[1]}". Only ${allowedTypes.map(t => t.split('/')[1]).join(', ')} are supported.`
            };
        }

        // Check file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
            return {
                valid: false,
                error: `File too large (${formatFileSize(file.size)}). Maximum size is ${maxSizeInMB}MB.`
            };
        }

        return { valid: true };
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter out files that would exceed the maxFiles limit
        const availableSlots = maxFiles - files.length;
        const filesToProcess = acceptedFiles.slice(0, availableSlots);

        if (filesToProcess.length === 0) return;

        // Process and validate files
        const filesWithPreview = filesToProcess.map(file => {
            const validation = validateFile(file);
            return Object.assign(file, {
                id: `${file.name}-${Date.now()}`,
                preview: URL.createObjectURL(file),
                status: validation.valid ? 'pending' as const : 'error' as const,
                progress: 0,
                errorMessage: validation.valid ? undefined : validation.error
            });
        });

        setFiles(current => [...current, ...filesWithPreview]);

        // Show a warning if some files were skipped
        if (acceptedFiles.length > availableSlots) {
            toast({
                title: 'Some files skipped',
                description: `Only ${availableSlots} more files can be added (maximum ${maxFiles} files).`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [files.length, maxFiles, toast, allowedTypes, maxSizeInMB]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: Object.fromEntries(allowedTypes.map(type => [type, []])),
        disabled: isUploading || files.length >= maxFiles,
        maxSize: maxSizeInMB * 1024 * 1024
    });

    const removeFile = (id: string) => {
        setFiles(current => {
            const newFiles = current.filter(file => {
                if (file.id === id) {
                    // Revoke the object URL to avoid memory leaks
                    URL.revokeObjectURL(file.preview);
                    return false;
                }
                return true;
            });
            return newFiles;
        });
    };

    const handleUpload = async () => {
        const validFiles = files.filter(file => file.status === 'pending');
        if (validFiles.length === 0 || isUploading) return;

        setIsUploading(true);
        currentFileRef.current = 0;
        let successCount = 0;
        let totalCount = validFiles.length;

        try {
            // Check if token exists before attempting upload
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            // Upload files one by one for better tracking and error handling
            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                currentFileRef.current = i;

                // Update file status to uploading
                setFiles(current =>
                    current.map(f => f.id === file.id
                        ? { ...f, status: 'uploading' as const }
                        : f
                    )
                );

                try {
                    const tags = ['vacation', 'family', '2025']; // Default tags

                    // Upload the current file
                    await imageService.uploadImages([file], tripId, tags, (progress) => {
                        // Update progress for this file
                        setFiles(current =>
                            current.map(f => f.id === file.id
                                ? { ...f, progress }
                                : f
                            )
                        );

                        // Calculate overall progress
                        const totalProgress = validFiles.reduce((sum, _, index) => {
                            if (index < i) {
                                sum += 100; // If the file has already been uploaded, count as 100%
                            } else if (index === i) {
                                sum += progress; // Add the current file's progress
                            }
                            return sum;
                        }, 0);

                        setUploadProgress(Math.floor(totalProgress / totalCount));
                    });

                    // Mark this file as successfully uploaded
                    setFiles(current =>
                        current.map(f => f.id === file.id
                            ? { ...f, status: 'success' as const, progress: 100 }
                            : f
                        )
                    );

                    successCount++;
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error);

                    // Mark this file as failed
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Failed to upload image';

                    setFiles(current =>
                        current.map(f => f.id === file.id
                            ? {
                                ...f,
                                status: 'error' as const,
                                errorMessage
                            }
                            : f
                        )
                    );
                }
            }

            // Show success toast
            if (successCount > 0) {
                toast({
                    title: 'Upload complete',
                    description: `Successfully uploaded ${successCount} ${successCount === 1 ? 'image' : 'images'}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                // Call the completion callback
                if (onUploadComplete) {
                    onUploadComplete();
                }
            }

            // Show warning if some files failed
            if (successCount < totalCount) {
                toast({
                    title: 'Some uploads failed',
                    description: `${totalCount - successCount} ${totalCount - successCount === 1 ? 'image' : 'images'} failed to upload. Check the error messages for details.`,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload error',
                description: error instanceof Error ? error.message : 'An unexpected error occurred during upload.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);

            // Remove successfully uploaded files from the list after a short delay
            setTimeout(() => {
                setFiles(current => current.filter(file => file.status !== 'success'));
            }, 1500); // Show success state for 1.5 seconds before removing
        }
    };

    return (
        <Box width="100%">
            <VStack spacing={4} align="stretch">
                {/* Dropzone */}
                <Box
                    {...getRootProps()}
                    borderWidth={2}
                    borderRadius="md"
                    borderColor={isDragActive ? activeBorderColor : borderColor}
                    borderStyle="dashed"
                    p={6}
                    bg={isDragActive ? useColorModeValue('brand.50', 'rgba(79, 209, 197, 0.1)') : bgColor}
                    cursor={isUploading || files.length >= maxFiles ? 'not-allowed' : 'pointer'}
                    transition="all 0.2s"
                    _hover={{
                        borderColor: !(isUploading || files.length >= maxFiles) ? activeBorderColor : undefined,
                        bg: !(isUploading || files.length >= maxFiles) ? hoverBgColor : undefined,
                    }}
                >
                    <input {...getInputProps()} />
                    <VStack spacing={2}>
                        <Icon
                            as={FaImage}
                            boxSize={8}
                            color={isDragActive ? 'brand.500' : 'gray.400'}
                        />
                        <Text textAlign="center" fontWeight="medium">
                            {isDragActive
                                ? 'Drop the images here...'
                                : isUploading
                                    ? 'Upload in progress...'
                                    : files.length >= maxFiles
                                        ? `Maximum ${maxFiles} images reached`
                                        : 'Drag and drop images here, or click to select files'}
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            Supported formats: JPEG, PNG, GIF, WebP (max {maxSizeInMB}MB each)
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            {files.length} of {maxFiles} files selected
                        </Text>
                    </VStack>
                </Box>

                {/* Upload progress */}
                {isUploading && (
                    <Box>
                        <Flex justify="space-between" mb={1}>
                            <Text>Uploading: {uploadProgress}%</Text>
                            <Text>{currentFileRef.current + 1} of {files.filter(f => f.status === 'pending' || f.status === 'uploading').length}</Text>
                        </Flex>
                        <Progress value={uploadProgress} size="sm" colorScheme="brand" borderRadius="md" />
                    </Box>
                )}

                {/* File previews */}
                {files.length > 0 && (
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
                        {files.map((file) => (
                            <Box
                                key={file.id}
                                position="relative"
                                borderWidth={1}
                                borderRadius="md"
                                overflow="hidden"
                                boxShadow="sm"
                                borderColor={
                                    file.status === 'success'
                                        ? 'green.300'
                                        : file.status === 'error'
                                            ? 'red.300'
                                            : borderColor
                                }
                            >
                                <Box position="relative" paddingBottom="100%" bg="gray.100">
                                    <Box
                                        as="img"
                                        src={file.preview}
                                        alt={file.name}
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        opacity={file.status === 'uploading' ? 0.7 : 1}
                                    />

                                    {/* Status indicators */}
                                    {file.status === 'uploading' && (
                                        <Flex
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            bottom={0}
                                            justify="center"
                                            align="center"
                                            bg="rgba(0, 0, 0, 0.3)"
                                        >
                                            <CircularProgress value={file.progress} color="brand.500" thickness="12px" size="50px">
                                                <CircularProgressLabel>{file.progress}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </Flex>
                                    )}

                                    {file.status === 'success' && (
                                        <Flex
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            bottom={0}
                                            bg="rgba(0, 0, 0, 0.3)"
                                            justify="center"
                                            align="center"
                                        >
                                            <Icon as={FaCheck} color="green.300" boxSize={8} />
                                        </Flex>
                                    )}

                                    {file.status === 'error' && (
                                        <Flex
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            bottom={0}
                                            bg="rgba(0, 0, 0, 0.3)"
                                            justify="center"
                                            align="center"
                                        >
                                            <Tooltip label={file.errorMessage || 'Upload failed'} placement="top">
                                                <span>
                                                    <Icon as={FaExclamationTriangle} color="red.300" boxSize={8} />
                                                </span>
                                            </Tooltip>
                                        </Flex>
                                    )}
                                </Box>

                                <HStack justify="space-between" p={2} bg={useColorModeValue('white', 'gray.800')}>
                                    <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="xs" noOfLines={1} fontWeight="medium">
                                            {file.name.length > 20
                                                ? `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 7)}`
                                                : file.name
                                            }
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {formatFileSize(file.size)}
                                        </Text>
                                    </VStack>

                                    {file.status !== 'uploading' && (
                                        <IconButton
                                            aria-label="Remove file"
                                            icon={<FaTrash />}
                                            size="xs"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => removeFile(file.id)}
                                        />
                                    )}
                                </HStack>

                                {file.status === 'error' && file.errorMessage && (
                                    <Box
                                        p={2}
                                        bg="red.50"
                                        borderTop="1px solid"
                                        borderColor="red.200"
                                        _dark={{
                                            bg: "red.900",
                                            borderColor: "red.700"
                                        }}
                                    >
                                        <Text fontSize="xs" color="red.600" _dark={{ color: "red.200" }}>
                                            {file.errorMessage}
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </SimpleGrid>
                )}

                {/* Upload button */}
                <Button
                    leftIcon={<FaUpload />}
                    colorScheme="brand"
                    onClick={handleUpload}
                    isLoading={isUploading}
                    loadingText="Uploading..."
                    isDisabled={files.filter(f => f.status === 'pending').length === 0}
                    size="lg"
                    width="100%"
                    mt={2}
                >
                    Upload {files.filter(f => f.status === 'pending').length > 0
                        ? `${files.filter(f => f.status === 'pending').length} ${files.filter(f => f.status === 'pending').length === 1 ? 'Image' : 'Images'
                        }`
                        : ''}
                </Button>
            </VStack>
        </Box>
    );
};

export default EnhancedImageUploader;