import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getApiUrl } from '../config/api';
import { RootState } from '../store/store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

interface RegisterData {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    cyclingExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
}

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check for token in localStorage on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      // Here you would typically validate the token with the server
      // For now, we'll just assume it's valid if it exists
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          dispatch(loginSuccess({ user, token: storedToken }));
        }
      } catch (error) {
        // If there's an error parsing user data, logout
        dispatch(logout());
      }
    }
  }, [dispatch, isAuthenticated]);

  const register = async (data: RegisterData) => {
    dispatch(loginStart());
    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { user, token } = await response.json();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const login = async (data: LoginData) => {
    dispatch(loginStart());
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { user, token } = await response.json();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout: handleLogout,
  };
};
