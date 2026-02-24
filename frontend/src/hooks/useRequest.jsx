import { useState } from "react"
import { useEffect } from "react";
import api, { API_BASE_URL } from "../utils/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useModal } from "../hooks/useModal";


export default function useRequest() {
    
    const MySwal = withReactContent(Swal);
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const { closeModal, isOpen, openModal } = useModal();
    const [selectedRequest, setSelectedRequest] = useState({});

    const handleDownload = async (documentPath, filename) => {
        try {
            // Construct full URL if not already a full URL
            const fullUrl = documentPath.startsWith('http') 
                ? documentPath 
                : `${API_BASE_URL}${documentPath}`;
            
            const response = await fetch(fullUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download document');
        }
    };

    const toggleDropdown = (requestId) => {
        setOpenDropdownId(openDropdownId === requestId ? null : requestId);
    };

    const closeDropdown = () => {
        setOpenDropdownId(null);
    };

    const handleDecline = (id) => {
        closeDropdown();
        MySwal.fire({
            title: "Decline Request",
            text: "Are you sure you want to decline this request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, decline it!",
            cancelButtonText: "No, keep it"
        }).then((result) => {
            if (result.isConfirmed) {
                api.patch(`/api/request/${id}`, { status: "Declined" })
                    .then((res) => {
                        setRequests((prev) => 
                            prev.map((request) => 
                                request._id === id 
                                    ? { ...request, status: "Declined" } 
                                    : request
                            )
                        );
                        toast.success("Request declined successfully");
                    })
                    .catch((error) => {
                        console.error('Error declining request:', error);
                        toast.error('Failed to decline request');
                    });
            }
        });
    };

    const handleView = (id) => {
        openModal();
        closeDropdown();
        api.get(`/api/request/${id}`)
            .then((res) => {
                setSelectedRequest(res.data.request);
            })
            .catch((error) => {
                console.error('Error fetching request details:', error);
            });
    };

    const handleAccept = (id) => {
        closeDropdown();
        closeModal();
        try {
            api.patch(`/api/request/${id}`, { status: "Accepted" })
            api.patch(`/api/request/${id}/role`);
            toast.success("Request accepted successfully");
            setRequests((prev) => prev.map((request) => request._id === id ? { ...request, status: "Accepted" } : request));
        } catch (error) {
            console.error('Error accepting request:', error);
            toast.error('Failed to accept request');
        }
    };

    const handleDelete = (id) => {

        MySwal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/api/request/${id}`)
                    .then((res) => {
                        setRequests((prev) => prev.filter((request) => request._id !== id));
                        toast.success("Request deleted successfully");
                    })
                    .catch((error) => {
                        console.error('Error deleting request:', error);
                        toast.error('Failed to delete request');
                    });
            }
        });
        closeDropdown();
    };

    useEffect(() => {
        api.get('/api/request')
            .then((res) => {
                setRequests((res.data.requests || []).reverse());
            })
            .catch((error) => {
                console.error('Error fetching request data:', error);
            })
            .finally(() => setLoading(false));
    },[])

    const filtered = requests.filter((u) =>
        `${u.firstname} ${u.middlename || ''} ${u.lastname} ${u.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return {
        requests,
        loading,
        searchTerm,
        setSearchTerm,
        filtered,
        openDropdownId,
        toggleDropdown,
        closeDropdown,
        handleDecline,
        handleDelete, 
        closeModal, 
        isOpen, 
        openModal,
        handleView,
        selectedRequest,
        handleAccept,
        handleDownload
    }
}