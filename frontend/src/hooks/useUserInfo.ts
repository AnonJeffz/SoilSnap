import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useModal } from "./useModal";

export function useUserInfo() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, checkAuthStatus } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [person, setPerson] = useState({ 
    _id: user?._id || '',
    firstname: user?.firstname || '',
    middlename: user?.middlename || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: user?.phone || '',
    address: user?.address || '',
    postalcode: user?.postalcode || '',
  });

  const [ error, setError ] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    postalcode: '',
  });
  
  const [image, setImage] = useState<File | null>(null); 
  const [imageUrl, setImageUrl] = useState(user?.profile || ""); 
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result); // store the image URL for preview
        }
        setImage(file); // store the image file
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click(); // trigger the file input click
    }
  };

  const validateField = (name: string, value: string) => {
      switch (name) {
          case 'firstname':
              return value.trim() === '' ? 'First name is required' : '';
          case 'lastname':
              return value.trim() === '' ? 'Last name is required' : '';
          case 'phone': 
              return value.trim() === '' ? 'Phone Number is required' : '';
          case 'address':
              return value.trim() === '' ? 'Address is required' : '';
          case 'postalcode':
              return value.trim() === '' ? 'Postal code is required' : '';
          default:
              return '';
      }
  };

  const handleSave = async () => {

    const validationErrors = {
      firstname: validateField('firstname', person.firstname),
      lastname: validateField('lastname', person.lastname),
      phone: validateField('phone', person.phone || ''),
      address: validateField('address', person.address || ''),
      postalcode: validateField('postalcode', person.postalcode || ''),
    }

    setError(validationErrors);
    if (Object.values(validationErrors).some((error) => error !== '')) {
      event?.preventDefault();
      return;
    }

    console.log("Saving changes...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstname", person.firstname);
    formData.append("middlename", person.middlename);
    formData.append("lastname", person.lastname);
    formData.append("email", person.email);
    formData.append("phone", person.phone);
    formData.append("address", person.address);
    formData.append("postalcode", person.postalcode);
    formData.append("role", person.role);
    if (image) {
      formData.append("profile", image); // append image if present
    }

    try {
      await api.patch(`/api/users/${person._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      checkAuthStatus();
      closeModal();
      toast.success("User information updated successfully");
    } catch (error) {
      closeModal();
      console.error("Failed to update user:", error);
      toast.error("Failed to update user information");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    isLoading,
    person,
    setPerson,
    handleSave,
    user,
    imageUrl,
    openFileDialog,
    handleImageUpload,
    error
  };
}
