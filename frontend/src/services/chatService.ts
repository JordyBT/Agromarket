import { apiRequest } from "@/services/api";

export type ChatUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
};

export type ConversationPublication = {
  id: string;
  title: string;
  imageUrl?: string | null;
  price?: number;
  unit?: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;

  sender: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type ConversationSummary = {
  id: string;
  publicationId: string;
  buyerId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;

  publication: ConversationPublication;

  otherUser: ChatUser;

  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
  } | null;
};

export type ConversationDetail = {
  id: string;
  publicationId: string;
  buyerId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;

  publication: {
    id: string;
    title: string;
    imageUrl?: string | null;
  };

  otherUser: ChatUser;
};

export type ConversationMessagesResponse = {
  conversation: ConversationDetail;
  messages: ChatMessage[];
};

export type StartConversationResponse = {
  id: string;
  publicationId: string;
  buyerId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
};

export function startConversation(
  publicationId: string
) {
  return apiRequest<StartConversationResponse>(
    `/api/conversations/publication/${publicationId}`,
    {
      method: "POST",
      authenticated: true,
    }
  );
}

export function getConversations() {
  return apiRequest<ConversationSummary[]>(
    "/api/conversations",
    {
      authenticated: true,
    }
  );
}

export function getConversationMessages(
  conversationId: string
) {
  return apiRequest<ConversationMessagesResponse>(
    `/api/conversations/${conversationId}/messages`,
    {
      authenticated: true,
    }
  );
}

export function sendMessage(
  conversationId: string,
  content: string
) {
  return apiRequest<ChatMessage>(
    `/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      authenticated: true,
      body: JSON.stringify({
        content,
      }),
    }
  );
}