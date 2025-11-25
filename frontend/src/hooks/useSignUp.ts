import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export function useSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'User',
  };  

  const loginGoogle = async () => {
        const base = import.meta.env.VITE_API_URL || "";
        window.location.href = `${base}/api/auth/google`;
    }


  const validateField = (name: string, value: string) => {
      switch (name) {
          case 'firstname':
              return value.trim() === '' ? 'First name is required' : '';
          case 'lastname':
              return value.trim() === '' ? 'Last name is required' : '';
          case
              'email': {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value) ? '' : 'Invalid email address';
          }
          case 'role':
              return value === '' ? 'Role is required' : '';
          case 'password':
              return value.trim() === '' ? 'Password is required' : '';
          default:
              return '';
      }
  };
    
  const [error, setError] = useState(data);
  const [newUser, setNewUser] = useState(data);


  const handleSignUp = async () => {
    const validationErrors = {
      firstname: validateField('firstname', newUser.firstname),
      lastname: validateField('lastname', newUser.lastname),
      email: validateField('email', newUser.email),
      role: validateField('role', newUser.role),
      password: validateField('password', newUser.password),
    };

    setError(validationErrors);
    if (Object.values(validationErrors).some((error) => error !== '')) {
      event?.preventDefault();
      return;
    }

    setIsLoading(true);
    try {
      // Map to the format expected by the AuthContext
      const userData = {
        username: newUser.firstname + ' ' + newUser.lastname, // Assuming username is a combination of first and last name
        email: newUser.email,
        lastname: newUser.lastname,
        firstname: newUser.firstname,
        password: newUser.password,
        role: "User"
      };

      const success = await signup(userData);
      
      if (success) {
        setNewUser({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: 'User',
        });
        // Redirect to login page after successful signup
        navigate('/signin');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    isChecked,
    setIsChecked,
    isLoading,
    newUser,
    setNewUser,
    handleSignUp,
    error,
    loginGoogle
  }
}