import { useState, useEffect } from 'react';
import {
  Button,
  HStack,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { getCommentStats } from '../../services/commentService';
import CommentThread from './CommentThread';

const CommentPreview = ({ tradeId, traderId }) => {
  const [commentStats, setCommentStats] = useState({ 
    commentCount: 0, 
    reactionCount: 0 
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  useEffect(() => {
    const unsubscribe = getCommentStats(tradeId, (stats) => {
      setCommentStats(stats);
    });
    
    return () => unsubscribe();
  }, [tradeId]);
  
  if (commentStats.commentCount === 0 && commentStats.reactionCount === 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        color="gray.400"
        leftIcon={<Text>💬</Text>}
        onClick={onOpen}
        _hover={{ color: 'accent.400', bg: 'transparent' }}
        fontWeight="normal"
      >
        Add comment
      </Button>
    );
  }
  
  return (
    <>
      <HStack spacing={1} onClick={onOpen} cursor="pointer" color="gray.400" _hover={{ color: 'accent.400' }}>
        {commentStats.commentCount > 0 && (
          <HStack spacing={1}>
            <Text>💬</Text>
            <Text fontSize="sm">{commentStats.commentCount}</Text>
          </HStack>
        )}
        
        {commentStats.commentCount > 0 && commentStats.reactionCount > 0 && (
          <Text color="gray.500">·</Text>
        )}
        
        {commentStats.reactionCount > 0 && (
          <HStack spacing={1}>
            <Text>🔥</Text>
            <Text fontSize="sm">{commentStats.reactionCount}</Text>
          </HStack>
        )}
      </HStack>
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700"/>
        <ModalContent bg="gray.850" borderColor="gray.700" borderWidth="1px">
          <ModalHeader color="white">Trade Discussion</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody pb={6}>
            <CommentThread tradeId={tradeId} traderId={traderId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentPreview;