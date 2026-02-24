import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"
import useRequest from "../../hooks/useRequest"
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { MoreDotIcon } from "../../icons";
import { API_BASE_URL } from "../../utils/api";

const getDocumentUrl = (docPath) => {
    if (!docPath) return "";
    if (docPath.startsWith("http")) return docPath;
    return `${API_BASE_URL}${docPath}`;
};

const getFileExtension = (filename) => {
    if (!filename) return "";
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

export default function UserRequest() {
    const { 
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
    } = useRequest();

    return (
        <section>
            <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="block flex-1 min-w-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter the name..."
                            className="h-10 sm:h-11 w-full rounded-lg px-3 sm:px-4 border border-gray-300 dark:border-gray-600 sm:max-w-none xl:w-[430px] dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-success-500 focus:border-transparent placeholder:text-gray-500 text-sm sm:text-base"
                        />
                    </div>
                </div>
            </header>
            {loading && <div className="p-5 text-center dark:text-white">Loading...</div>}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-15">
                <div className="min-w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {['Name', 'Email', 'Description', 'Request Date', 'Status', 'Actions'].map((h) => (
                                    <TableCell
                                        key={h}
                                        isHeader
                                        className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {h}
                                    </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {filtered.length > 0 ? (
                                    filtered.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                                                {request.firstname} {request.lastname || ''}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                                                {request.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                Request to be Soil Expert
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={request.status === 'Accepted' ? 'success' : request.status === 'Declined' ? 'error' : 'dark'}
                                                >
                                                    {request.status === 'Accepted' ? 'Accepted' : request.status === 'Declined' ? 'Declined' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 text-start text-theme-sm">
                                                <div >
                                                    <button
                                                        onClick={() => toggleDropdown(request._id)}
                                                        className="px-3 py-2 text-gray-700 dark:text-gray-400 rounded"
                                                    >
                                                        <MoreDotIcon className="text-gray-700 hover:text-gray-900 dark:text-dark dark:hover:text-white size-6" />
                                                    </button>
                                                    <Dropdown isOpen={openDropdownId === request._id} onClose={closeDropdown}>
                                                        <div className="absolute right-12 top-full mt-[-18px] w-32 bg-white rounded-lg shadow-lg border dark:bg-gray-700 dark:border-gray-600 z-20">
                                                            {request.status === 'Request' && (
                                                                <>
                                                                    <DropdownItem
                                                                        onClick={() => handleView(request._id)}
                                                                        className="w-full text-left px-3 py-2 text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                                                    >
                                                                        View
                                                                    </DropdownItem>
                                                                    <DropdownItem
                                                                        onClick={() => handleDecline(request._id)}
                                                                        className="w-full text-left px-3 py-2 text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                                                    >
                                                                        Decline
                                                                    </DropdownItem>
                                                                </>
                                                            )}
                                                            {(request.status === 'Accepted' || request.status === "Declined") && (
                                                                <DropdownItem
                                                                    onClick={() => handleDelete(request._id)}
                                                                    className="w-full text-left px-3 py-2 text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                                                                >
                                                                    Delete
                                                                </DropdownItem>
                                                            )}
                                                        </div>
                                                    </Dropdown>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <td colSpan={6} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                            No requests found.
                                        </td>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11 border border-gray-200 dark:border-gray-700">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Request Information
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                            Here you can find the details of the request.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                <div className="w-20 h-20 overflow-hidden border rounded-full border-gray-200 dark:border-gray-800">
                                    <img src="/images/profile/profile.jpeg" alt="user" className="object-cover w-full h-full" />
                                </div>
                                <div className="order-3 xl:order-2">
                                    <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                        <Badge color="info" size="sm">
                                            User
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6 mb-5">
                                <div>
                                    <Label className="dark:text-gray-300">Name: </Label> <span className="dark:text-white">{selectedRequest.firstname} {selectedRequest.middlename} {selectedRequest.lastname}</span>
                                </div>
                                <div>
                                    <Label className="dark:text-gray-300">Email: </Label> <span className="dark:text-white">{selectedRequest.email}</span>
                                </div>
                                <div>
                                    <Label className="dark:text-gray-300">Request Date: </Label> 
                                    <span className="dark:text-white">{selectedRequest.createdAt ? 
                                        new Date(selectedRequest.createdAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric', 
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        }) : 'N/A'
                                    }</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 mt-8 gap-6">
                                <div>
                                    <span className="dark:text-gray-300">Document: <span className="dark:text-white">{selectedRequest.type}</span></span>
                                </div>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                    {(() => {
                                        const ext = getFileExtension(selectedRequest.originalFilename || selectedRequest.image);
                                        const docUrl = getDocumentUrl(selectedRequest.image);
                                        
                                        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                                            return <img src={docUrl} alt="Document" className="object-cover w-full h-full rounded-lg" />;
                                        } else if (ext === 'pdf') {
                                            return (
                                                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                                                    <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                                        <text x="6" y="14" fontSize="6" fill="white" fontWeight="bold">PDF</text>
                                                    </svg>
                                                    <p className="text-gray-600 dark:text-gray-400">{selectedRequest.originalFilename || 'Document.pdf'}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-500">Click download button below to view</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                                                    <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                                    </svg>
                                                    <p className="text-gray-600 dark:text-gray-400">{selectedRequest.originalFilename || 'Document'}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-500">Click download button below to view</p>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownload(
                                            selectedRequest.image,
                                            selectedRequest.originalFilename || `${selectedRequest.firstname}_${selectedRequest.lastname}_document`
                                        )}
                                        className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                    >
                                        📥 Download Document
                                    </button>
                                </div>
                                <div>
                                    <a target="_blank" href={selectedRequest.description} className="dark:text-gray-300">{selectedRequest.description}</a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal} className="dark:border-gray-700 dark:text-white">
                                Close
                            </Button>
                            <Button size="sm" onClick={() => handleAccept(selectedRequest._id)}>
                                Accept
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    )
}