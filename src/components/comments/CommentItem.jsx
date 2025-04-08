import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Avatar, 
  HStack, 
  Button, 
  Textarea,
} from '@chakra-ui/react';
import { addComment, addReaction } from '../../services/commentService';
import { currentUser } from '../../firebase';
import ReactionButton from './ReactionButton';

const CommentItem = ({ comment, isReply = false, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  const handleReactionClick = async (commentId, reactionType) => {
    try {
      await addReaction(commentId, reactionType);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };
  
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      await addComment(comment.tradeId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      if (onReplyAdded) onReplyAdded();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      month: 'short',
      day: 'numeric' 
    });
  };
  
  return (
    <Box 
      ml={isReply ? 8 : 0} 
      mb={3}
      p={3}
      bg="gray.800"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.700"
      position="relative"
      _hover={{
        borderColor: "gray.600"
      }}
      transition="all 0.2s"
    >
      <Flex mb={2}>
        <Avatar 
          src={comment.userAvatar} 
          name={comment.userName} 
          size="sm" 
          mr={3}
        />
        <Box flex="1">
          <Flex justify="space-between" align="center">
            <Text fontWeight="medium" color="white">{comment.userName}</Text>
            <Text fontSize="xs" color="gray.400">
              {formatTime(comment.timestamp)}
            </Text>
          </Flex>
          <Text mt={1} color="gray.300">{comment.content}</Text>
        </Box>
      </Flex>
      
      <HStack mt={2} justify="space-between">
        <ReactionButton 
          commentId={comment.id} 
          reactions={comment.reactions || {}} 
          onReactionClick={handleReactionClick} 
        />
        
        {!isReply && !isReplying && (
          <Button
            size="xs"
            variant="ghost"
            color="gray.400"
            onClick={() => setIsReplying(true)}
            _hover={{ color: 'accent.400' }}
          >
            Reply
          </Button>
        )}
      </HStack>
      
      {isReplying && (
        <Box mt={3} pl={4} borderLeftWidth="2px" borderLeftColor="gray.700">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            size="sm"
            minH="60px"
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "accent.500", boxShadow: "0 0 0 1px #1976d2" }}
            mb={2}
          />
          <HStack justify="flex-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              bg="accent.500"
              color="white"
              _hover={{ bg: "accent.600" }}
              onClick={handleSubmitReply}
              isDisabled={!replyContent.trim()}
            >
              Reply
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;