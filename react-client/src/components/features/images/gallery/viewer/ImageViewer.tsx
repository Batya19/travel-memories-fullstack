import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Image as ImageType } from "../../../../../types";
import BaseImage from "../../../../common/media/BaseImage";
import ImageDetails from "../components/ImageDetails";
import { getImageUrl } from "../../../../../utils/imageUtils";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: ImageType | null;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  onClose,
  currentImage,
  onPrevious,
  onNext,
}) => {
  if (!currentImage) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
        <ModalCloseButton color="white" zIndex={2} />

        <Flex
          justify="center"
          align="center"
          height="100vh"
          position="relative"
          onClick={onClose}
        >
          {onPrevious && (
            <IconButton
              aria-label="Previous image"
              icon={<FaArrowLeft />}
              position="absolute"
              left={4}
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              colorScheme="whiteAlpha"
              variant="ghost"
              fontSize="2xl"
              zIndex={1}
            />
          )}

          {onNext && (
            <IconButton
              aria-label="Next image"
              icon={<FaArrowRight />}
              position="absolute"
              right={4}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              colorScheme="whiteAlpha"
              variant="ghost"
              fontSize="2xl"
              zIndex={1}
            />
          )}

          <Flex
            direction="column"
            maxW="90vw"
            maxH="90vh"
            onClick={(e) => e.stopPropagation()}
            alignItems="center"
            gap={4}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              maxH="70vh"
              maxW="90vw"
            >
              <BaseImage
                src={getImageUrl(currentImage)}
                alt={currentImage.fileName || "Image"}
                objectFit="contain"
                maxH="70vh"
                maxW="90vw"
                height="auto"
                width="auto"
                borderRadius="md"
              />
            </Box>
            <ImageDetails image={currentImage} />
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ImageViewer;
