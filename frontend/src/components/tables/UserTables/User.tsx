import { useUsers } from '../../../hooks/useUser';  // Import the custom hook
import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from '../../ui/table';
import Badge from '../../ui/badge/Badge';
import { DropdownItem } from '../../ui/dropdown/DropdownItem';
import { Dropdown } from '../../ui/dropdown/Dropdown';
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import LoadingSpinner from "../../ui/spinner/LoadingSpinner";
import { MoreDotIcon } from '../../../icons';

interface UserTableProps {
  searchTerm: string;
}

export default function UserTable({ searchTerm }: UserTableProps) {

  const {
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
  } = useUsers(searchTerm);
  

  if (loading) return <div className="p-5 text-center dark:text-white">Loading...</div>;
  if (isLoading) return <div><LoadingSpinner/></div>

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mb-15">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Name', 'Email', 'Created At', 'Role', 'Actions'].map((h) => (
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
                filtered.map((u) => (
                  <TableRow key={u._id}>
                    {/* Name */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-800 dark:text-white/90">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                              <img
                              width={40}
                              height={40}
                              src={u.profile || "/images/profile/profile.jpeg"}
                              alt="User"
                              className="object-cover w-full h-full"
                              />
                          </div>
                          <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {u.firstname} {u.lastname || ''}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                  {u.email}
                              </span>
                          </div>
                      </div>
                    </TableCell>
                    {/* Email */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {u.email}
                    </TableCell>
                    {/* Created At */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleString()}
                    </TableCell>
                    {/* Status */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <Badge
                        size="sm"
                        color={u.role === 'Admin' ? 'success' : u.role === 'Soil Expert' ? 'primary' : 'warning'}
                      >
                        {u.role === 'Soil Expert' && u.roleVerify === "false" ? 'Not Verified' : u.role === 'Soil Expert' && u.roleVerify === "true" ? 'Soil Expert' : 'Admin' }
                      </Badge>
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="px-4 text-start text-theme-sm">
                      <div className="">
                        <button
                          onClick={() => toggleDropdown(u)}
                          className="px-3 py-2 text-gray-700 dark:text-gray-400"
                        >
                          <MoreDotIcon className="text-gray-700 hover:text-gray-900 dark:text-dark dark:hover:text-white size-6" />
                        </button>
                      </div>
                      <Dropdown isOpen={isDropdownOpen && selectedUser?._id === u._id} onClose={closeDropdown} >
                        {isDropdownOpen && selectedUser?._id === u._id && (
                          <div className="absolute right-12 top-full mt-0 w-32 bg-white rounded-lg shadow-lg border dark:bg-gray-700 dark:border-gray-600 z-20">
                            <DropdownItem
                              onItemClick={() => {
                                setEditUser(u); // set the user to edit
                                openModal();
                              }}
                              tag="button"
                              className="w-full text-left px-3 py-2 text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                              onClick={openModal}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onItemClick={closeDropdown}
                              tag="button"
                              className="w-full text-left px-3 py-2 text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                              onClick={() => handleDelete(u._id)}
                            >
                              Delete
                            </DropdownItem>
                          </div>
                        )}
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={5} className="px-5 py-5 text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">

              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>First Name</Label>
                    <Input type="text"
                      name='firstname'
                      value={editUser?.firstname || ""}
                      onChange={handleInputChange} 
                      hint={error.firstname}
                      error={!!error.firstname}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Middle Name</Label>
                    <Input type="text"  
                      name='middlename'
                      value={editUser?.middlename || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Last Name</Label>
                    <Input type="text"  
                      value={editUser?.lastname || ""} 
                      name='lastname'
                      onChange={handleInputChange}
                      hint={error.lastname}
                      error={!!error.lastname}
                      />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input type="text" 
                      value={editUser?.email || ""} 
                      name='email'
                      hint={error.email}
                      error={!!error.email}
                      onChange={handleInputChange}/>
                  </div>
                  <div className="col-span-2">
                    <div>
                      <Label>Select Role</Label>
                      <Select
                        options={options}
                        placeholder="Select Option"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                        value={editUser?.role || ""}
                        name='role'
                        error={!!error.role}
                        hint={error.role}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={() => handleEdit()}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
