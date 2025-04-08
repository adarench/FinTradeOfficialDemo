import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
  Avatar,
  Textarea,
  Input,
  HStack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { getTraderDiscussions, addTraderDiscussion, addDiscussionReaction } from '../../services/commentService';
import { currentUser } from '../../firebase';
import ReactionButton from './ReactionButton';

const REACTION_TYPES = ['🔥', '🧠', '❤️', '💩'];

const TraderDiscussions = ({ traderId, traderName }) => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: ''
  });
  
  useEffect(() => {
    const unsubscribe = getTraderDiscussions(traderId, (fetchedDiscussions) => {
      setDiscussions(fetchedDiscussions);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [traderId]);
  
  const handleAddDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
    
    try {
      await addTraderDiscussion(traderId, newDiscussion.title, newDiscussion.content);
      setNewDiscussion({ title: '', content: '' });
      onClose();
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };
  
  const handleReactionClick = async (discussionId, reactionType) => {
    try {
      await addDiscussionReaction(discussionId, reactionType);
    } catch (error) {
      console.error("Error adding reaction:", error);
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
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner color="accent.500" />
      </Flex>
    );
  }
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" color="white">Discussions with {traderName}</Heading>
        <Button
          bg="accent.500"
          color="white"
          _hover={{ bg: "accent.600", transform: "translateY(-2px)" }}
          onClick={onOpen}
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          style={{ transition: 'all 0.2s ease' }}
        >
          New Discussion
        </Button>
      </Flex>
      
      {discussions.length === 0 ? (
        <Box 
          py={8} 
          textAlign="center" 
          borderRadius="lg" 
          bg="gray.800" 
          borderWidth="1px" 
          borderColor="gray.700"
        >
          <Text color="gray.400" mb={4}>No discussions yet</Text>
          <Button
            variant="outline"
            borderColor="accent.500"
            color="accent.400"
            _hover={{ bg: "rgba(25, 118, 210, 0.1)" }}
            onClick={onOpen}
          >
            Start a discussion about {traderName}'s strategy
          </Button>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {discussions.map(discussion => (
            <Box 
              key={discussion.id}
              p={5}
              bg="gray.800"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              transition="all 0.2s"
            >
              <Flex mb={3}>
                <Avatar 
                  src={discussion.userAvatar} 
                  name={discussion.userName} 
                  size="sm" 
                  mr={3}
                />
                <Box flex="1">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="medium" color="white">{discussion.userName}</Text>
                    <Text fontSize="xs" color="gray.400">
                      {formatTime(discussion.timestamp)}
                    </Text>
                  </Flex>
                  <Heading size="md" color="white" mb={2}>{discussion.title}</Heading>
                  <Text color="gray.300">{discussion.content}</Text>
                </Box>
              </Flex>
              
              <HStack mt={4} spacing={2} justify="space-between">
                <ReactionButton 
                  commentId={discussion.id} 
                  reactions={discussion.reactions || {}} 
                  onReactionClick={handleReactionClick} 
                />
                
                {discussion.commentCount > 0 && (
                  <Text fontSize="sm" color="gray.400">
                    💬 {discussion.commentCount}
                  </Text>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
      
      {/* New Discussion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700"/>
        <ModalContent bg="gray.850" borderColor="gray.700" borderWidth="1px">
          <ModalHeader color="white">Start a Discussion</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="medium" color="white">Title</Text>
                <Input
                  placeholder="Discussion title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "accent.500", boxShadow: "0 0 0 1px #1976d2" }}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium" color="white">Message</Text>
                <Textarea
                  placeholder="What do you want to discuss about this trader's strategy?"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "accent.500", boxShadow: "0 0 0 1px #1976d2" }}
                  minH="150px"
                />
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              bg="accent.500"
              color="white"
              _hover={{ bg: "accent.600" }}
              onClick={handleAddDiscussion}
              isDisabled={!newDiscussion.title.trim() || !newDiscussion.content.trim()}
            >
              Create Discussion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TraderDiscussions;