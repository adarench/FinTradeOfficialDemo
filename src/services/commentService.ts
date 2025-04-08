import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, currentUser } from '../firebase';

// Collection references
const commentsCollection = collection(db, 'comments');
const discussionsCollection = collection(db, 'discussions');

// Reaction types
export type ReactionType = '🔥' | '🧠' | '❤️' | '💩' | '👍' | '👎';

// Comment functions
export const getCommentsByTradeId = (tradeId: string, callback: (comments: any[]) => void) => {
  const q = query(
    commentsCollection,
    where('tradeId', '==', tradeId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(comments);
  });
};

export const getCommentStats = (tradeId: string, callback: (stats: { commentCount: number, reactionCount: number }) => void) => {
  const q = query(
    commentsCollection,
    where('tradeId', '==', tradeId)
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Count total comments
    const commentCount = comments.length;
    
    // Count reactions across all comments
    const reactionCount = comments.reduce((total, comment) => {
      let commentReactions = 0;
      if (comment.reactions) {
        Object.values(comment.reactions).forEach((users: any) => {
          if (Array.isArray(users)) {
            commentReactions += users.length;
          }
        });
      }
      return total + commentReactions;
    }, 0);
    
    callback({ commentCount, reactionCount });
  });
};

export const addComment = async (
  tradeId: string, 
  content: string, 
  parentId: string | null = null
): Promise<string> => {
  const newComment = {
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    tradeId,
    content,
    timestamp: Date.now(),
    reactions: {},
    ...(parentId && { parentId })
  };

  const docRef = await addDoc(commentsCollection, newComment);
  return docRef.id;
};

export const addReaction = async (commentId: string, reactionType: ReactionType): Promise<void> => {
  const commentRef = doc(commentsCollection, commentId);
  const commentSnap = await getDoc(commentRef);
  
  if (!commentSnap.exists()) return;
  
  const comment = commentSnap.data();
  const reactionPath = `reactions.${reactionType}`;
  
  // Check if reactions field exists
  if (!comment.reactions) {
    await updateDoc(commentRef, {
      reactions: {
        [reactionType]: [currentUser.id]
      }
    });
    return;
  }
  
  // Check if user already reacted with this type
  const userReactions = comment.reactions[reactionType] || [];
  if (userReactions.includes(currentUser.id)) {
    // Remove reaction
    await updateDoc(commentRef, {
      [reactionPath]: arrayRemove(currentUser.id)
    });
  } else {
    // Add reaction
    await updateDoc(commentRef, {
      [reactionPath]: arrayUnion(currentUser.id)
    });
  }
};

// Trader Discussion Functions
export const getTraderDiscussions = (traderId: string, callback: (discussions: any[]) => void) => {
  const q = query(
    discussionsCollection,
    where('traderId', '==', traderId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const discussions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(discussions);
  });
};

export const addTraderDiscussion = async (
  traderId: string,
  title: string,
  content: string
): Promise<string> => {
  const newDiscussion = {
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

  const docRef = await addDoc(discussionsCollection, newDiscussion);
  return docRef.id;
};

export const addDiscussionReaction = async (discussionId: string, reactionType: ReactionType): Promise<void> => {
  const discussionRef = doc(discussionsCollection, discussionId);
  const discussionSnap = await getDoc(discussionRef);
  
  if (!discussionSnap.exists()) return;
  
  const discussion = discussionSnap.data();
  const reactionPath = `reactions.${reactionType}`;
  
  // Check if reactions field exists
  if (!discussion.reactions) {
    await updateDoc(discussionRef, {
      reactions: {
        [reactionType]: [currentUser.id]
      }
    });
    return;
  }
  
  // Check if user already reacted
  const userReactions = discussion.reactions[reactionType] || [];
  if (userReactions.includes(currentUser.id)) {
    // Remove reaction
    await updateDoc(discussionRef, {
      [reactionPath]: arrayRemove(currentUser.id)
    });
  } else {
    // Add reaction
    await updateDoc(discussionRef, {
      [reactionPath]: arrayUnion(currentUser.id)
    });
  }
};