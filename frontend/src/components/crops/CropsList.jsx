import useCropList  from "../../hooks/useCropList";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import LoadingSpinner  from "../ui/spinner/LoadingSpinner";
import { Link } from "react-router";
import TextArea from "../form/input/TextArea";


export default function Crop() {
    const {
        isOpen,
        openModal,
        closeModal,
        selectedCrop,
        handleCreate,
        selectedCropIds,
        toggleCropId,
        setName,
        setDescription,
        setImage,
        name,
        description,
        image,
        handleSubmit,
        filtered,
        setSearchTerm,
        searchTerm,
        action,
        openEditModal,
        openDeleteButton,
        closeDropdown,
        toggleDropdown,
        user,
        setOpenDropdownIndex,
        openDropdownIndex,
        data,
        imagePreview, 
        handleImageChange,
        closingModal,
        isLoading,
        loading,
        error
    } = useCropList();


    if (isLoading) return <div><LoadingSpinner/></div>;
    return (
        <section>
            <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="block flex-1 min-w-0">
                    <div className="relative">
                        <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter crop name..."
                        className="h-10 sm:h-11 w-full rounded-lg px-3 sm:px-4 border border-gray-300 dark:border-gray-600 sm:max-w-none xl:w-[430px] dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-success-500 focus:border-transparent placeholder:text-gray-500 text-sm sm:text-base"
                        />
                    </div>
                </div>
               {(user.role == "Admin" || (user.role == "Soil Expert" && user.roleVerify == "true") ) && (
                 <button 
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-success-500 rounded-lg sm:rounded-xl text-white hover:bg-success-600 transition-colors text-sm sm:text-base font-medium whitespace-nowrap flex-shrink-0"
                    onClick={handleCreate} 
                    >
                    Add Crops
                </button>
               )}
            </header>
            {loading && <div className="p-5 text-center dark:text-white">Loading...</div>}
            <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-6">
                {filtered.map((crop, index) => (
                    <div className="flex items-center justify-center" key={index}>
                        
                        <div className="max-w-lg rounded overflow-hidden shadow-lg">
                            <div className="relative">
<<<<<<< HEAD
                                <Link to={`/crops/${crop._id}`}>
                                    <img className="w-full h-80 cursor-pointer hover:opacity-90 transition-opacity" src={crop.image} alt={crop.name} />
                                </Link>
                                {(user.role == "Admin" || user.role == "Soil Expert") && (
=======
                                <img className="w-full h-80" src={crop.image} alt={crop.name} />
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
                                                onItemClick={() => openEditModal(crop)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem
                                                onItemClick={() => openDeleteButton(crop)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Delete
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2 dark:text-white"><Link to={`/crops/${crop._id}`}>{crop.name}</Link></div>
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                {crop.soil_id.slice(0, 2).map((soil, soilIndex) => (
                                    <span
                                    key={`${crop._id}-${soil._id || soilIndex}`}
                                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                                    >
                                    {soil.name}
                                    </span>
                                ))}

                                {crop.soil_id.length > 2 && (
                                    <span key={`${crop._id}-more`} className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                    +{crop.soil_id.length - 2} 
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div> 
            <Modal isOpen={isOpen} onClose={closingModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            { action === "create" ? "Add Crop" : "Edit Crop" }
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Fill up the form to { action === "create" ? "add" : "edit" } a crop.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-4">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Crop Information
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
                                            error={!!error.image}
                                            hint={error.image}
                                            onChange={handleImageChange}
                                            className="text-sm file:bg-gray-200 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-300 file:px-4 file:border-0 file:rounded-lg file:mr-4 hover:file:bg-gray-300 dark:hover:file:bg-gray-600"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Crop Name</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            error={!!error.name}
                                            hint={error.name}
                                            placeholder="Soil Classification Name"
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>
                                    <div className="col-span-2 mb-5">
                                        <Label>Soil Classification</Label>
                                        <div className="grid items-center gap-2 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                                            {selectedCrop.map((crop) => (
                                                <Checkbox
                                                    key={crop._id}
                                                    label={crop.name}
                                                    checked={selectedCropIds.includes(String(crop._id))}
                                                    onChange={(checked) => toggleCropId(String(crop._id), checked)}
                                                />
                                            ))}
                                        </div>
                                        {error.soil && (
                                            <div className="text-error-500 text-xs mt-3">{error.soil}</div>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Description</Label>
                                        <TextArea
                                            name="description"
                                            rows={4}
                                            placeholder="Soil Description..."
                                            onChange={setDescription}
                                            value={description}
                                            error={!!error.description}
                                            hint={error.description}
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
                                {action === "create" ? "Add Crop" : "Update Crop"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>          
        </section>
    )
}
