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
  Image as ChakraImage,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react';
import { FaUpload, FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import imageService from '../../services/imageService';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  tripId: string;
  onUploadComplete?: () => void;
  maxFiles?: number;
}

interface PreviewFile extends File {
  preview?: string;
  id?: string;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  tripId,
  onUploadComplete,
  maxFiles = 10
}) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  // Keep track of which file is currently being uploaded
  const currentFileRef = useRef<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter out files that would exceed the maxFiles limit
    const availableSlots = maxFiles - files.length;
    const newFiles = acceptedFiles.slice(0, availableSlots);

    // Create preview URLs for the files
    const filesWithPreview = newFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0
      })
    );

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
  }, [files.length, maxFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled: isUploading || files.length >= maxFiles
  });

  const removeFile = (index: number) => {
    setFiles(current => {
      const newFiles = [...current];
      // Revoke the object URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    currentFileRef.current = 0;
    let successCount = 0;

    try {
      // Check if token exists before attempting upload
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Upload files one by one for better tracking and error handling
      for (let i = 0; i < files.length; i++) {
        currentFileRef.current = i;

        // Update file status to uploading
        setFiles(current => {
          const newFiles = [...current];
          newFiles[i].status = 'uploading';
          return newFiles;
        });

        try {
          // Upload the current file
          await imageService.uploadImages([files[i]], tripId, (progress) => {
            // Update progress for this file
            setFiles(current => {
              const newFiles = [...current];
              newFiles[i].progress = progress;
              return newFiles;
            });

            // Calculate overall progress
            const totalProgress = files.slice(0, i).reduce((sum) => sum + 100, 0) + progress;
            setUploadProgress(Math.floor(totalProgress / files.length));
          });

          // Mark this file as successfully uploaded
          setFiles(current => {
            const newFiles = [...current];
            newFiles[i].status = 'success';
            return newFiles;
          });

          successCount++;
        } catch (error) {
          console.error(`Error uploading file ${files[i].name}:`, error);

          // Mark this file as failed
          setFiles(current => {
            const newFiles = [...current];
            newFiles[i].status = 'error';
            return newFiles;
          });
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
      if (successCount < files.length) {
        toast({
          title: 'Some uploads failed',
          description: `${files.length - successCount} ${files.length - successCount === 1 ? 'image' : 'images'} failed to upload. You can try again.`,
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

      // Remove successfully uploaded files from the list
      setFiles(current => current.filter(file => file.status !== 'success'));
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
          borderColor={isDragActive ? 'brand.500' : 'gray.200'}
          borderStyle="dashed"
          p={6}
          bg={isDragActive ? 'brand.50' : 'gray.50'}
          cursor={isUploading || files.length >= maxFiles ? 'not-allowed' : 'pointer'}
          transition="all 0.2s"
          _hover={{
            borderColor: !(isUploading || files.length >= maxFiles) ? 'brand.300' : undefined,
          }}
        >
          <input {...getInputProps()} />
          <VStack spacing={2}>
            <Icon as={FaUpload} boxSize={8} color="gray.400" />
            <Text textAlign="center">
              {isDragActive
                ? 'Drop the images here...'
                : isUploading
                  ? 'Upload in progress...'
                  : files.length >= maxFiles
                    ? `Maximum ${maxFiles} images reached`
                    : 'Drag and drop images here, or click to select files'}
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Supported formats: JPEG, PNG, GIF, WebP
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {files.length} of {maxFiles} files selected
            </Text>
          </VStack>
        </Box>

        {/* Upload progress */}
        {isUploading && (
          <Box>
            <Text mb={1}>Uploading: {uploadProgress}%</Text>
            <Progress value={uploadProgress} size="sm" colorScheme="brand" borderRadius="md" />
          </Box>
        )}

        {/* File previews */}
        {files.length > 0 && (
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
            {files.map((file, index) => (
              <Box
                key={index}
                position="relative"
                borderWidth={1}
                borderRadius="md"
                overflow="hidden"
              >
                <Box position="relative" paddingBottom="100%" bg="gray.100">
                  <ChakraImage
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
                    <Box position="absolute" bottom={0} left={0} right={0} bg="rgba(0,0,0,0.5)" p={1}>
                      <Progress size="xs" value={file.progress} colorScheme="brand" />
                    </Box>
                  )}

                  {file.status === 'success' && (
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.3)"
                      justify="center"
                      align="center"
                    >
                      <Icon as={FaCheck} color="white" boxSize={8} />
                    </Flex>
                  )}

                  {file.status === 'error' && (
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0,0,0,0.3)"
                      justify="center"
                      align="center"
                    >
                      <Icon as={FaExclamationTriangle} color="red.300" boxSize={8} />
                    </Flex>
                  )}
                </Box>

                <HStack justify="space-between" p={2} bg="white">
                  <Text fontSize="xs" noOfLines={1} maxW="70%">
                    {file.name.length > 20
                      ? `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 7)}`
                      : file.name
                    }
                  </Text>

                  {file.status !== 'uploading' && (
                    <IconButton
                      aria-label="Remove file"
                      icon={<FaTrash />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    />
                  )}
                </HStack>
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
          isDisabled={files.length === 0 || files.every(f => f.status === 'error')}
          size="lg"
          width="100%"
        >
          Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? 'Image' : 'Images'}` : ''}
        </Button>
      </VStack>
    </Box>
  );
};

export default ImageUploader;