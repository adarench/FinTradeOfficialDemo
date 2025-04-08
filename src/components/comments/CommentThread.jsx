import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Textarea,
  Button,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { getCommentsByTradeId, addComment } from '../../services/commentService';
import { currentUser } from '../../firebase';
import CommentItem from './CommentItem';

const CommentThread = ({ tradeId, traderId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    const unsubscribe = getCommentsByTradeId(tradeId, (fetchedComments) => {
      setComments(fetchedComments);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [tradeId]);
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await addComment(tradeId, newComment);
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  // Filter top-level comments and replies
  const topLevelComments = comments.filter(comment => !comment.parentId);
  const replies = comments.filter(comment => comment.parentId);
  
  // Group replies by parent comment ID
  const repliesByParentId = replies.reduce((acc, reply) => {
    if (!acc[reply.parentId]) acc[reply.parentId] = [];
    acc[reply.parentId].push(reply);
    return acc;
  }, {});
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={6}>
        <Spinner color="accent.500" />
      </Flex>
    );
  }
  
  return (
    <Box>
      <Heading size="md" mb={4} color="white">
        Comments {comments.length > 0 && `(${comments.length})`}
      </Heading>
      
      <Box mb={6}>
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
          _hover={{ borderColor: "gray.500" }}
          _focus={{ borderColor: "accent.500", boxShadow: "0 0 0 1px #1976d2" }}
          minH="80px"
          mb={2}
        />
        <Flex justify="flex-end">
          <Button
            bg="accent.500"
            color="white"
            _hover={{ bg: "accent.600", transform: "translateY(-2px)" }}
            _active={{ bg: "accent.700" }}
            onClick={handleAddComment}
            isDisabled={!newComment.trim()}
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            style={{ transition: 'all 0.2s ease' }}
          >
            Comment
          </Button>
        </Flex>
      </Box>
      
      {comments.length === 0 ? (
        <Box 
          py={6} 
          textAlign="center" 
          borderRadius="md" 
          bg="gray.750" 
          borderWidth="1px" 
          borderColor="gray.700"
        >
          <Text color="gray.400">Be the first to comment on this trade!</Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {topLevelComments.map(comment => (
            <Box key={comment.id}>
              <CommentItem 
                comment={comment} 
                onReplyAdded={() => {}} 
              />
              
              {/* Display replies to this comment */}
              {repliesByParentId[comment.id]?.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                />
              ))}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CommentThread;