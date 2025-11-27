import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import RoleIndicator from "../ui/RoleIndicator";
import { useUpgradeCard } from "../../hooks/useUpdagedCard";
import LoadingSpinner from "../ui/spinner/LoadingSpinner";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";

export default function UpgradeCard() {

  const {
    isOpen,
    openModal,
    closeModal,
    options,
    user,
    handleSave,
    upgradeData,
    setUpgradeData,
    isLoading,
    error
  } = useUpgradeCard();

  if (isLoading) return <div><LoadingSpinner/></div>

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border rounded-full border-gray-200  dark:border-gray-800">
              <img src={user?.profile || "/images/profile/profile.jpeg"} alt="user" className="object-cover w-full h-full" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.firstname || 'Unidentified'} {user?.lastname || 'User'}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <RoleIndicator />
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
          {(user.role === "Soil Expert" && user.roleVerify === "false") && (
            <button
              onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              Verify
            </button>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Request Upgrade to Soil Expert
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              To request an upgrade to become a Soil Expert, please fill out the form below.
            </p>
          </div>
           <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Input className="hidden" type="text" hint={error.firstname} error={!!error.firstname} disabled name="firstname" value={upgradeData.firstname} onChange={(e) => setUpgradeData({ ...upgradeData, firstname: e.target.value })} />
                  <Input className="hidden" type="text" hint={error.lastname} error={!!error.lastname} disabled name="lastname" value={upgradeData.lastname} onChange={(e) => setUpgradeData({ ...upgradeData, lastname: e.target.value })} />
                  <Input className="hidden" type="text" name="middlename" hint={error.middlename} error={!!error.middlename} disabled value={upgradeData.middlename} onChange={(e) => setUpgradeData({ ...upgradeData, middlename: e.target.value })} />
                  <Input className="hidden" type="text" name="email" hint={error.email} error={!!error.email} disabled value={upgradeData.email} onChange={(e) => setUpgradeData({ ...upgradeData, email: e.target.value })} />
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <div>
                  <Label>Document Type</Label>
                  <Select
                    name="type"
                    value={upgradeData.type}
                    hint={error.type}
                    error={!!error.type}
                    options={options || []}
                    onChange={value => setUpgradeData(prev => ({ ...prev, type: value }))}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  >
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Professional Background
                </h5>
                <Label>Documents</Label>
                <Input
                  type="file"
                  accept="image/*"
                  name="image"
                  hint={error.image}
                  error={!!error.image}
                  onChange={(e) => setUpgradeData({ ...upgradeData, image: e.target.files[0]})}
                  className="text-sm file:bg-gray-200 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-300 file:px-4 file:border-0 file:rounded-lg file:mr-4 hover:file:bg-gray-300 dark:hover:file:bg-gray-600"
                />
              </div>
              <div className="mt-3">
                <h6 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Research Publications, Credentials, or Professional Achievements
                </h6>
                <Label>Why do you want to become a Soil Expert?</Label>
                <TextArea
                  name="description"
                  value={upgradeData.description}
                  error={!!error.description}
                  hint={error.description}
                  row={4}
                  onChange={value => setUpgradeData(prev => ({ ...prev, description: value }))}
                  placeholder="Share your research publications, credentials, or any professional achievements related to soil science. Please include a URL or link."
                ></TextArea>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
