import { useState } from 'react';
import {
  Button,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';

const REACTION_TYPES = ['=%', '>à', 'd', '=©'];

const ReactionButton = ({ commentId, reactions, onReactionClick, size = "sm" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Count total reactions
  const totalReactions = Object.values(reactions || {}).reduce(
    (acc, userIds) => acc + (Array.isArray(userIds) ? userIds.length : 0), 
    0
  );
  
  return (
    <>
      <HStack spacing={1}>
        {/* Show existing reactions */}
        {REACTION_TYPES.map((type) => {
          const users = reactions?.[type] || [];
          if (users.length > 0) {
            return (
              <Button
                key={type}
                size="xs"
                borderRadius="full"
                bg="gray.700"
                color="white"
                fontSize="xs"
                px={2}
                height="24px"
                onClick={() => onReactionClick(commentId, type)}
                _hover={{ bg: "gray.600" }}
              >
                {type} {users.length}
              </Button>
            );
          }
          return null;
        })}
        
        {/* Add reaction button */}
        <Popover isOpen={isOpen} onClose={onClose} placement="top">
          <PopoverTrigger>
            <Button
              size="xs"
              borderRadius="full"
              bg="gray.700"
              color="gray.400"
              fontSize="xs"
              px={2}
              height="24px"
              onClick={onOpen}
              _hover={{ bg: "gray.600" }}
            >
              +
            </Button>
          </PopoverTrigger>
          <PopoverContent width="180px" bg="gray.800" borderColor="gray.700">
            <PopoverBody p={2}>
              <Flex flexWrap="wrap" gap={1}>
                {REACTION_TYPES.map(reaction => (
                  <Button
                    key={reaction}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onReactionClick(commentId, reaction);
                      onClose();
                    }}
                  >
                    {reaction}
                  </Button>
                ))}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </>
  );
};

export default ReactionButton;