import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useModal } from './useModal';


export function useUserAccount() {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedRole, setSelectedRole] = useState(""); 
      const [isLoading, setIsLoading] = useState(false);
      const { isOpen, openModal, closeModal } = useModal();
      const data =  {
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        role: '',
        password: '',
        roleVerify: 'true',
      }

      const [error, setError] = useState(data);
      const [newUser, setNewUser] = useState(data);

      const options = [
        { value: "Admin", label: "Admin" },
        { value: "Soil Expert", label: "Soil Expert" },
      ];
      
      const validateField = (name: string, value: string) => {
        switch (name) {
            case 'firstname':
                return value.trim() === '' ? 'First name is required' : '';
            case 'lastname':
                return value.trim() === '' ? 'Last name is required' : '';
            case 'middlename':
                return value.trim() === '' ? 'Middle name is required' : '';
            case
                'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? '' : 'Invalid email address';
            }
            case 'role':
                return value === '' ? 'Role is required' : '';
            case 'password':
                return value.trim() === '' ? 'Password is required' : '';
            case 'roleVerify':
                return value.trim() === '' ? 'roleVerify is required' : '';
            default:
                return '';
        }
    };
    
      const handleAddUser = async () => {
        const validationErrors = {
            firstname: validateField('firstname', newUser.firstname),
            lastname: validateField('lastname', newUser.lastname),
            middlename: validateField('middlename', newUser.middlename),
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
        let errorOccurred = false
        let otherError = false;
        try {
          await axios.post('api/users', newUser); 
          setNewUser({
            firstname: '',
            middlename: '',
            lastname: '',
            email: '',
            password: '',
            role: '',
            roleVerify: 'true',
          });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {  
                errorOccurred = true;
                const errorMessage = error.response.data.message;
                const errorField = error.response.data.error;

                setError({
                    email: errorField === 'email' ? errorMessage : '',
                    firstname: errorField === 'firstname' ? errorMessage : '',
                    middlename: errorField === 'middlename' ? errorMessage : '',
                    lastname: errorField === 'lastname' ? errorMessage : '',
                    role: errorField === 'role' ? errorMessage : '',
                    password: errorField === 'password' ? errorMessage : '',
                    roleVerify: errorField === 'roleVerify' ? errorMessage : '',
                });
            } else {
                otherError= true;
            }
        }finally{
            closeModal();   
            setIsLoading(false);
        }
        if(errorOccurred) {
            openModal();
            return;
        }else if(otherError) {
            toast.error("Error adding user");
            return;
        }else{
            toast.success('User added successfully');
        }
  };

      return {
        isOpen,
        openModal,
        closeModal,
        searchTerm,
        setSearchTerm,
        selectedRole,
        setSelectedRole,
        isLoading,
        options,
        newUser,
        setNewUser,
        handleAddUser,
        error,
      }
}