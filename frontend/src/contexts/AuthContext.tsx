import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Define User and Authentication Types
interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (
    username: string,
    email: string,
    password: string,
    role: string
  ) => Promise<User>;
  logout: () => void;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Create the Auth context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; // children components that need access to AuthContext
}

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State to hold the current user
  const [user, setUser] = useState<User | null>(null);
  // State to hold the JWT token, initially checking local storage
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  // State to track if authentication is loading
  const [loading, setLoading] = useState(true);

  // useEffect to initialize authentication status on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token"); // get token from localStorage
      if (storedToken) {
        try {
          const decoded: CustomJwtPayload = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decoded.exp! < currentTime) {
            // If token is expired, log out
            await logout();
          } else {
            // If token is valid, set user and token in state
            setToken(storedToken);
            setUser({
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
            });
            // Set default Authorization header for axios
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${storedToken}`;
          }
        } catch (error) {
          console.error("Error decoding token", error);
          await logout();
        }
      }
      setLoading(false);
    };

    initializeAuth(); // call the function to initialize auth state
  }, []);

  // Function to handle user login
  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token); // Save token to localStorage
      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  // Function to handle user registration
  const register = async (
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password, role }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token); // Save token to localStorage
      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Return the AuthContext.Provider to provide authentication state and functions
  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; //  context value
};
