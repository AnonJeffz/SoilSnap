import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export function useSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'Soil Expert',
    roleVerify: '',
  };  

  const loginGoogle = async () => {
        const base = import.meta.env.VITE_API_URL || "";
        window.location.href = `${base}/auth/google`;
    }


  const validateField = (name: string, value: string) => {
      switch (name) {
          case 'firstname':
              return value.trim() === '' ? 'First name is required' : '';
          case 'lastname':
              return value.trim() === '' ? 'Last name is required' : '';
          case 'email': {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value) ? '' : 'Invalid email address';
          }
          case 'role':
              return value === '' ? 'Role is required' : '';
          case 'password': {
              if (value.trim() === '') return 'Password is required';

              // Step 1: Check length
              if (value.length < 8) return 'Password must be at least 8 characters long';

              // Step 2: Check uppercase
              if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter';

              // Step 3: Check lowercase
              if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter';

              // Step 4: Check number
              if (!/\d/.test(value)) return 'Password must include at least one number';

              // Step 5: Check special character
              if (!/[\W_]/.test(value)) return 'Password must include at least one special character';

              // All checks passed
              return '';
          }
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
      roleVerify: validateField('roleVerify', newUser.roleVerify),
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
        role: 'Soil Expert',
        roleVerify: "false"
      };

      const success = await signup(userData);
      
      if (success) {
        setNewUser({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: 'Soil Expert',
          roleVerify: "false"
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
    isLoading,
    newUser,
    setNewUser,
    handleSignUp,
    error,
    loginGoogle
  }
}