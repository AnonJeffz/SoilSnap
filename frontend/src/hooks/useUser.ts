import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useModal } from "../hooks/useModal";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
// assuming you're using react-router for navigation

interface User {
  _id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: string;
  roleVerify: string;
}

export function useUsers(searchTerm: string) {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const { isOpen, openModal, closeModal } = useModal();
  const [error, setError] = useState({
        firstname: '',
        lastname: '',
        email: '',
        role: '',
      });

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

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "Soil Expert", label: "Soil Expert" },
  ];

  // Fetch users from the API
  useEffect(() => {
    api
      .get('/api/users/all')
      .then((res) => {
        setData((res.data?.users || []).reverse());
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter users based on the search term
  const filtered = data.filter((u) =>
    `${u.firstname} ${u.middlename || ''} ${u.lastname} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEdit = async () => {
    const validationErrors = {
          firstname: validateField('firstname', editUser?.firstname || ''),
          lastname: validateField('lastname', editUser?.lastname || ''),
          email: validateField('email', editUser?.email || ''),
          role: validateField('role', editUser?.role || ''),
      };

      setError(validationErrors);
      if (Object.values(validationErrors).some((error) => error !== '')) {
          event?.preventDefault();
          return;
      }
    if (!editUser?._id) return;
    
    try {
      setIsLoading(true);
      await api.patch(`/api/users/${editUser._id}`, editUser);
      // Optionally update the local data state with the edited user
      setData((prev) =>
        prev.map((user) =>
          user._id === editUser._id ? { ...user, ...editUser } : user
        )
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update user:", error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
      toast.success('User updated successfully');
      setError({
        firstname: '',
        lastname: '',
        email: '',
        role: '',
      });
    }
  };
  const handleSelectChange = (value: string) => {
    setEditUser((prev) => prev ? { ...prev, role: value } : prev);
  };

  // Delete user - make an API call to delete the user
  const handleDelete = async (userId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/users/${userId}`);
          setData(prev => prev.filter(user => user._id !== userId));
          toast.success('User deleted successfully');
        }
        catch (error) {
          toast.error('Something went wrong!! '+ error);
        }
        finally{
          setIsLoading(false);
        }
      }
    });
  };

  // Toggle the dropdown for a selected user
  const toggleDropdown = (user: User) => {
    setIsOpen(!isDropdownOpen);
    setSelectedUser(user);
  };

  // Close the dropdown
  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  return {
    filtered,
    loading,
    isDropdownOpen,
    selectedUser,
    options,
    isOpen,
    editUser,
    isLoading,
    handleEdit,
    handleDelete,
    toggleDropdown,
    closeDropdown,
    handleSelectChange,
    closeModal,
    openModal,
    setEditUser,
    handleInputChange,
    error
  };
}
