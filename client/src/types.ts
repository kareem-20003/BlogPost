export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userBlogs: string[];
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  photo?: string;
  tags: string[];
  author: User | string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}
