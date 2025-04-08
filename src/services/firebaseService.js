import { currentUser } from '../firebase';

// Mock data for development
const mockComments = {
  'trade1': [
    {
      id: 'comment1',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      tradeId: 'trade1',
      content: 'Great trade! What indicators led you to this decision?',
      timestamp: Date.now() - 3600000, // 1 hour ago
      reactions: {
        '🔥': ['user456'],
        '🧠': ['user789']
      }
    },
    {
      id: 'comment2',
      userId: 'user456',
      userName: 'Jane Trader',
      userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      tradeId: 'trade1',
      content: 'I missed this opportunity. Do you think there will be another entry point soon?',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      reactions: {
        '👍': [currentUser.id]
      }
    }
  ],
  'trade2': [
    {
      id: 'comment3',
      userId: 'user789',
      userName: 'Alex Pro',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      tradeId: 'trade2',
      content: 'Bold move selling MSFT here. I would have held longer.',
      timestamp: Date.now() - 7200000, // 2 hours ago
      reactions: {
        '🧠': [currentUser.id, 'user456'],
        '❤️': ['user456']
      }
    }
  ],
  'trade3': []
};

const mockDiscussions = {
  'trader1': [
    {
      id: 'discussion1',
      traderId: 'trader1',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: 'How do you approach swing trading tech stocks?',
      content: 'I\'ve noticed your success with AAPL and MSFT. What\'s your typical holding period and exit strategy?',
      timestamp: Date.now() - 86400000, // 1 day ago
      reactions: {
        '🔥': ['user456', 'user789'],
        '🧠': ['user456']
      },
      commentCount: 2
    }
  ]
};

// Comment Functions
export const getCommentsByTradeId = (tradeId, callback) => {
  // Simulate async behavior
  setTimeout(() => {
    callback(mockComments[tradeId] || []);
  }, 500);
  
  // Return a fake unsubscribe function
  return () => {};
};

export const getCommentStats = (tradeId, callback) => {
  setTimeout(() => {
    const comments = mockComments[tradeId] || [];
    
    // Count total comments
    const commentCount = comments.length;
    
    // Count reactions across all comments
    const reactionCount = comments.reduce((total, comment) => {
      let commentReactions = 0;
      if (comment.reactions) {
        Object.values(comment.reactions).forEach(users => {
          if (Array.isArray(users)) {
            commentReactions += users.length;
          }
        });
      }
      return total + commentReactions;
    }, 0);
    
    callback({ commentCount, reactionCount });
  }, 300);
  
  // Return a fake unsubscribe function
  return () => {};
};

export const addComment = async (tradeId, content, parentId = null) => {
  // Generate a random ID for the new comment
  const commentId = `comment-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create a new comment object
  const newComment = {
    id: commentId,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    tradeId,
    content,
    timestamp: Date.now(),
    reactions: {},
    ...(parentId && { parentId })
  };
  
  // Initialize the trade's comments array if it doesn't exist
  if (!mockComments[tradeId]) {
    mockComments[tradeId] = [];
  }
  
  // Add the comment to the mock data
  mockComments[tradeId].unshift(newComment);
  
  return commentId;
};

export const addReaction = async (commentId, reactionType) => {
  // Find the comment in our mock data
  let targetComment = null;
  
  for (const tradeId in mockComments) {
    const comment = mockComments[tradeId].find(c => c.id === commentId);
    if (comment) {
      targetComment = comment;
      break;
    }
  }
  
  if (!targetComment) {
    throw new Error("Comment not found");
  }
  
  // Initialize reactions object if it doesn't exist
  if (!targetComment.reactions) {
    targetComment.reactions = {};
  }
  
  // Initialize reaction array if it doesn't exist
  if (!targetComment.reactions[reactionType]) {
    targetComment.reactions[reactionType] = [];
  }
  
  // Check if user already reacted
  const userIndex = targetComment.reactions[reactionType].indexOf(currentUser.id);
  
  if (userIndex === -1) {
    // Add the reaction
    targetComment.reactions[reactionType].push(currentUser.id);
  } else {
    // Remove the reaction
    targetComment.reactions[reactionType].splice(userIndex, 1);
    
    // Clean up empty reaction arrays
    if (targetComment.reactions[reactionType].length === 0) {
      delete targetComment.reactions[reactionType];
    }
  }
};

// Trader Discussion Functions
export const getTraderDiscussions = (traderId, callback) => {
  setTimeout(() => {
    callback(mockDiscussions[traderId] || []);
  }, 500);
  
  // Return a fake unsubscribe function
  return () => {};
};

export const addTraderDiscussion = async (traderId, title, content) => {
  // Generate a random ID for the new discussion
  const discussionId = `discussion-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create a new discussion object
  const newDiscussion = {
    id: discussionId,
    traderId,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    title,
    content,
    timestamp: Date.now(),
    reactions: {},
    commentCount: 0
  };
  
  // Initialize the trader's discussions array if it doesn't exist
  if (!mockDiscussions[traderId]) {
    mockDiscussions[traderId] = [];
  }
  
  // Add the discussion to the mock data
  mockDiscussions[traderId].unshift(newDiscussion);
  
  return discussionId;
};

export const addDiscussionReaction = async (discussionId, reactionType) => {
  // Find the discussion in our mock data
  let targetDiscussion = null;
  
  for (const traderId in mockDiscussions) {
    const discussion = mockDiscussions[traderId].find(d => d.id === discussionId);
    if (discussion) {
      targetDiscussion = discussion;
      break;
    }
  }
  
  if (!targetDiscussion) {
    throw new Error("Discussion not found");
  }
  
  // Initialize reactions object if it doesn't exist
  if (!targetDiscussion.reactions) {
    targetDiscussion.reactions = {};
  }
  
  // Initialize reaction array if it doesn't exist
  if (!targetDiscussion.reactions[reactionType]) {
    targetDiscussion.reactions[reactionType] = [];
  }
  
  // Check if user already reacted
  const userIndex = targetDiscussion.reactions[reactionType].indexOf(currentUser.id);
  
  if (userIndex === -1) {
    // Add the reaction
    targetDiscussion.reactions[reactionType].push(currentUser.id);
  } else {
    // Remove the reaction
    targetDiscussion.reactions[reactionType].splice(userIndex, 1);
    
    // Clean up empty reaction arrays
    if (targetDiscussion.reactions[reactionType].length === 0) {
      delete targetDiscussion.reactions[reactionType];
    }
  }
};