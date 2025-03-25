// ImageFilter.tsx
import React, { useState } from 'react';
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    FormControl,
    FormLabel,
    Collapse,
    Button,
    useDisclosure,
    Flex,
    IconButton,
    Divider
} from '@chakra-ui/react';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ImageFilterProps {
    onFilterChange: (filters: ImageFilters) => void;
    hasAiImages: boolean;
}

export interface ImageFilters {
    searchTerm: string;
    sortBy: 'newest' | 'oldest' | 'name' | 'size';
    filterType: 'all' | 'ai' | 'regular';
}

const defaultFilters: ImageFilters = {
    searchTerm: '',
    sortBy: 'newest',
    filterType: 'all',
};

const ImageFilter: React.FC<ImageFilterProps> = ({ onFilterChange, hasAiImages }) => {
    const { isOpen, onToggle } = useDisclosure();
    const [filters, setFilters] = useState<ImageFilters>(defaultFilters);

    const handleFilterChange = (field: keyof ImageFilters, value: string) => {
        const newFilters = {
            ...filters,
            [field]: value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <Box mb={6} borderWidth="1px" borderRadius="md" p={3}>
            <Flex justifyContent="space-between" alignItems="center">
                {/* Basic search always visible */}
                <InputGroup size="md" maxW={{ base: 'full', md: '300px' }}>
                    <InputLeftElement pointerEvents="none">
                        <FaSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search by filename"
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </InputGroup>

                <IconButton
                    aria-label={isOpen ? "Hide filters" : "Show filters"}
                    icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    variant="ghost"
                    onClick={onToggle}
                    size="sm"
                />
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box pt={4}>
                    <Divider mb={4} />
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={4}
                        alignItems={{ base: 'stretch', md: 'flex-end' }}
                    >
                        <FormControl>
                            <FormLabel fontSize="sm">Sort By</FormLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                size="md"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">File Name</option>
                                <option value="size">File Size</option>
                            </Select>
                        </FormControl>

                        {hasAiImages && (
                            <FormControl>
                                <FormLabel fontSize="sm">Image Type</FormLabel>
                                <Select
                                    value={filters.filterType}
                                    onChange={(e) => handleFilterChange('filterType', e.target.value)}
                                    size="md"
                                >
                                    <option value="all">All Images</option>
                                    <option value="ai">AI Generated Only</option>
                                    <option value="regular">Regular Photos Only</option>
                                </Select>
                            </FormControl>
                        )}

                        <Button onClick={resetFilters} size="md" variant="outline" colorScheme="gray">
                            Reset Filters
                        </Button>
                    </Flex>
                </Box>
            </Collapse>
        </Box>
    );
};

export default ImageFilter;