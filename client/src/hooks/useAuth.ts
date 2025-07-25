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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
  };

  useEffect(() => {
    // Check for token in localStorage on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      // Validate the token with the server
      validateToken(storedToken);
    }
  }, [dispatch, isAuthenticated]);

  const validateToken = async (token: string) => {
    try {
      dispatch(loginStart());
      
      const response = await fetch(getApiUrl('/api/users/profile'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        dispatch(loginSuccess({ user, token }));
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Token is invalid, logout
        console.log('🚫 Token validation failed - logging out');
        handleLogout();
      }
    } catch (error) {
      console.error('🚫 Token validation error:', error);
      handleLogout();
    }
  };

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
        console.error('🔴 Registration error details:', errorData);
        let errorMessage = errorData.message || 'Registration failed';
        
        // Show more specific error details if available
        if (errorData.details && Array.isArray(errorData.details)) {
          const detailMessages = errorData.details.map((detail: any) => detail.message || detail.msg).join(', ');
          errorMessage += `: ${detailMessages}`;
        }
        
        throw new Error(errorMessage);
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
