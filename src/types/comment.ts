export type ReactionType = '🔥' | '🧠' | '❤️' | '💩' | '👍' | '👎';

export interface Reaction {
  userId: string;
  type: ReactionType;
  timestamp: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tradeId: string;
  content: string;
  timestamp: number;
  parentId?: string;
  reactions: {
    [key in ReactionType]?: string[]; // Array of userIds who reacted
  };
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}

export interface TraderDiscussion {
  id: string;
  traderId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  timestamp: number;
  reactions: {
    [key in ReactionType]?: string[]; // Array of userIds who reacted
  };
  commentCount: number;
}