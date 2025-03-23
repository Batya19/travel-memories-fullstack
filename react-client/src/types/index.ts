// טיפוסים בסיסיים למערכת

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface AuthResponse {
    token: string;
    userDetails: User;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }
  
  export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (userData: RegisterFormData) => Promise<AuthResponse>;
    logout: () => void;
  }