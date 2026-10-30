import { apiRequest } from "@/services/api";

export type AdminSummary = {
  users: {
    total: number;
    active: number;
    inactive: number;
    buyers: number;
    providers: number;
    admins: number;
  };

  publications: {
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
  };

  reservations: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
    acceptedValue: number;
  };

  reviews: {
    total: number;
  };

  chat: {
    conversations: number;
    messages: number;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: string;

  profile: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
  } | null;

  publicationsCount: number;
  reservationsCount: number;
  reviewsCount: number;
};

export type AdminPublication = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  minimumOrder: number;
  department: string;
  municipality: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;

  seller: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
  };

  reservationsCount: number;
  favoritesCount: number;
};

export type AdminReservation = {
  id: string;
  quantity: number;
  unitPrice: number;

  status:
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Cancelled";

  createdAt: string;
  resolvedAt?: string | null;
  totalPrice: number;

  publication: {
    id: string;
    title: string;
    unit: string;
    imageUrl?: string | null;
  };

  buyer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  provider: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
  };
};

export type AdminReview = {
  id: string;
  reservationId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;

  publication: {
    id: string;
    title: string;
    imageUrl?: string | null;
  };

  buyer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  provider: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
  };
};

export type AdminConversation = {
  id: string;
  createdAt: string;
  updatedAt: string;

  publication: {
    id: string;
    title: string;
    imageUrl?: string | null;
  };

  buyer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  provider: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
  };

  messagesCount: number;

  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
  } | null;
};

export type AdminChatMessage = {
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

export type AdminConversationDetails = {
  conversation: {
    id: string;
    createdAt: string;
    updatedAt: string;

    publication: {
      id: string;
      title: string;
      imageUrl?: string | null;
    };

    buyer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };

    provider: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      companyName: string;
    };
  };

  messages: AdminChatMessage[];
};

export type AdminActivity = {
  recentPublications: {
    id: string;
    title: string;
    createdAt: string;
    sellerEmail: string;
  }[];

  recentReservations: {
    id: string;
    status: string;
    quantity: number;
    createdAt: string;
    publicationTitle: string;
    buyerEmail: string;
  }[];

  recentReviews: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    buyerEmail: string;
    providerEmail: string;
    publicationTitle: string;
  }[];
};

export function getAdminSummary() {
  return apiRequest<AdminSummary>(
    "/api/admin/summary",
    {
      authenticated: true,
    }
  );
}

export function getAdminUsers() {
  return apiRequest<AdminUser[]>(
    "/api/admin/users",
    {
      authenticated: true,
    }
  );
}

export function updateAdminUserStatus(
  id: string,
  isActive: boolean
) {
  return apiRequest<{
    id: string;
    email: string;
    isActive: boolean;
  }>(
    `/api/admin/users/${id}/status/${isActive}`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}

export function getAdminPublications() {
  return apiRequest<AdminPublication[]>(
    "/api/admin/publications",
    {
      authenticated: true,
    }
  );
}

export function updateAdminPublicationStatus(
  id: string,
  isActive: boolean
) {
  return apiRequest<{
    id: string;
    title: string;
    stock: number;
    isActive: boolean;
  }>(
    `/api/admin/publications/${id}/status/${isActive}`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}

export function getAdminReservations() {
  return apiRequest<AdminReservation[]>(
    "/api/admin/reservations",
    {
      authenticated: true,
    }
  );
}

export function getAdminReviews() {
  return apiRequest<AdminReview[]>(
    "/api/admin/reviews",
    {
      authenticated: true,
    }
  );
}

export function getAdminConversations() {
  return apiRequest<AdminConversation[]>(
    "/api/admin/conversations",
    {
      authenticated: true,
    }
  );
}

export function getAdminConversationMessages(
  id: string
) {
  return apiRequest<AdminConversationDetails>(
    `/api/admin/conversations/${id}/messages`,
    {
      authenticated: true,
    }
  );
}

export function getAdminActivity() {
  return apiRequest<AdminActivity>(
    "/api/admin/activity",
    {
      authenticated: true,
    }
  );
}