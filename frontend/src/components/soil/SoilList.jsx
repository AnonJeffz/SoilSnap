import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSoilList } from "../../hooks/useSoilList";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import LoadingSpinner  from "../ui/spinner/LoadingSpinner";
import { Link } from "react-router";
import TextArea from "../form/input/TextArea";

export default function SoilList() {
    const {
        isOpen,
        openModal,
        closeModal,
        name,
        setName,
        description,
        setDescription,
        setImage,
        image,
        handleSubmit,
        user,
        searchTerm,
        setSearchTerm,
        filtered,
        openDropdownIndex,
        toggleDropdown,
        closeDropdown,
        openDeleteButton,
        openEditModal,
        action,
        isLoading,
        loading,
        closingModal,
        imagePreview, 
        handleImageChange,
        error,
    } = useSoilList();

    if (isLoading) return <div><LoadingSpinner/></div>

    return (
        <section>
            <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="block flex-1 min-w-0">
                    <div className="relative">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Enter soil name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Set searchTerm on input change
                            className="h-10 sm:h-11 w-full rounded-lg px-3 sm:px-4 border border-gray-300 dark:border-gray-600 sm:max-w-none xl:w-[430px] dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-success-500 focus:border-transparent placeholder:text-gray-500 text-sm sm:text-base"
                        />
                    </div>
                </div>
                {(user.role == "Admin" || (user.role == "Soil Expert" && user.roleVerify == "true") ) && (
                    <button 
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-success-500 rounded-lg sm:rounded-xl text-white hover:bg-success-600 transition-colors text-sm sm:text-base font-medium whitespace-nowrap flex-shrink-0" 
                        onClick={openModal}
                    >
                        Add Soil
                    </button>
                )}
            </header>
            {loading && <div className="p-5 text-center dark:text-white">Loading...</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((soil, index) => (
                    <div className="flex items-center justify-center" key={index}>
                        <div className="max-w-lg rounded overflow-hidden shadow-lg">
                            <div className="relative">
<<<<<<< HEAD
                                <Link to={`/soil/${soil._id}`}>
                                    <img className="w-full h-80 cursor-pointer hover:opacity-90 transition-opacity" src={soil.image} alt={soil.name} />
                                </Link>
                                {(user.role == "Admin" || user.role == "Soil Expert") && (
=======
                                <img className="w-full h-80" src={soil.image} alt={soil.name} />
                                {(user.role == "Admin" || (user.role == "Soil Expert" && user.roleVerify == "true") ) && (
>>>>>>> 621e7e8 (removing the User Role)
                                    <div className="absolute top-2 right-2 z-20">
                                        <button
                                            className="dropdown-toggle bg-white/80 rounded-full p-1 shadow"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(index);
                                            }}
                                        >
                                            <MoreDotIcon className="text-gray-700 hover:text-gray-900 dark:text-dark dark:hover:text-white size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={openDropdownIndex === index}
                                            onClose={closeDropdown}
                                            className="w-40 p-2 mt-[-4px] right-0"
                                        >
                                            <DropdownItem
                                                onItemClick={() => openEditModal(soil)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem
                                                onItemClick={() => openDeleteButton(soil)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Delete
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2 dark:text-white"><Link to={`/soil/${soil._id}`}>{soil.name}</Link></div>
                                <p className="text-gray-700 text-base dark:text-white">
                                    {(() => {
                                        const text = soil.description || '';
                                        if (text.length > 20) { // Limit to 100 characters
                                            return text.substring(0, 200) + '...';
                                        }
                                        return text;
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isOpen} onClose={closingModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {action === "add" ? "Add New Soil Classification" : "Edit Soil Classification"}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Fill up the form to {action === "add" ? "add" : "edit"} a soil classification.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-4">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Soil Information
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
                                    <div className="col-span-2">
                                        {(action === "edit") && imagePreview && (
                                            <div className="mb-2">
                                                <img src={imagePreview} alt="Current" className="h-24 rounded" />
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            name="images"
                                            hint={error.image}
                                            error={error.image}
                                            onChange={handleImageChange} 
                                            className="text-sm file:bg-gray-200 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-300 file:px-4 file:border-0 file:rounded-lg file:mr-4 hover:file:bg-gray-300 dark:hover:file:bg-gray-600"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Soil Classification</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={name}
                                            hint={error.name}
                                            error={error.name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Soil Classification Name"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Description</Label>
                                        <TextArea
                                            name="description"
                                            value={description}
                                            hint={error.description}
                                            error={error.description}
                                            onChange={setDescription}
                                            rows={5}
                                            placeholder="Soil Description..."
                                        ></TextArea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closingModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleSubmit}>
                                {action === "add" ? "Add Soil" : "Update Soil"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>   
        </section>
    )
}
