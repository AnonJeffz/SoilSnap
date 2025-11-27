import useLocation from "../../hooks/useLocation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"
import { TrashBinIcon, PencilIcon, Navigate } from "../../icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import { Modal } from '../ui/modal';
import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function LocationMarker({ setClickedPos, clickedPos }) {
    const [markerPos, setMarkerPos] = useState(null);

    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setMarkerPos([lat, lng]);
            setClickedPos([lat, lng]);
        },
    });


    useEffect(() => {
        if (clickedPos) {
            setMarkerPos(clickedPos);
            try {
                map?.setView(clickedPos, 13);
            } catch (err) {
                console.warn('map.setView failed', err);
            }
        }
    }, [clickedPos, map, setClickedPos]);
    return markerPos ? (
        <Marker position={markerPos}>
        <Popup>
            <b>Pinned Location</b>
            <br />
            Lat: {markerPos[0].toFixed(5)}, Lng: {markerPos[1].toFixed(5)}
        </Popup>
        </Marker>
    ) : null;
}

export default function Location() {
    const { filteredLocations, loading, searchTerm, setSearchTerm, handleDelete, isOpen, openModal, closeModal, setLocation } = useLocation();
    const { user } = useAuth();
    const [pos] = useState([10.3333, 125.1667]); // Southern Leyte center
    const [clickedPos, setClickedPos] = useState(null);
    const [locationId, setLocationId] = useState(null);

    const getId = (location) => {
        if(user.roleVerify == "true")
        {
            setLocationId(location._id);
            if(location.latitude != null && location.longitude != null) {
                setClickedPos([Number(location.latitude), Number(location.longitude)]);
            }
            openModal();
        }
        else
        {
            toast.success("This account is not yet verify!");
        }
    }

    const handleGetCoordinates = async (event) => {
        if (event) event.preventDefault();
        if (clickedPos) {
            try {
                const response = await api.patch(`/api/location/${locationId}`, { latitude: clickedPos[0], longitude: clickedPos[1] });
                closeModal();
                setLocation((prev) => [...prev, response.data.location]);
                toast.success("Location updated successfully!");
            } catch (error) {
                console.error("Error saving coordinates:", error);
            }
            
        }
        else {
            alert("Click on the map to set a location first!");
            event?.preventDefault();
        }
    };


    return (
        <section>
            <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="block flex-1 min-w-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter soil name..."
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
                                    {['Classification', 'Number', 'Latitude', 'Longitude', 'Date', 'Actions'].map((h) => (
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
                                    {filteredLocations.length > 0 ? (
                                        filteredLocations.map((location) => (
                                            <TableRow key={location._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {location.soil_classification}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {location.number}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {location.latitude}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {location.longitude}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {location.createdAt ? new Date(location.createdAt).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        {/* <button className="text-blue-500 hover:text-blue-700"><PencilIcon className="inline-block w-4 h-4" /></button> */}
                                                        {user.role === 'Admin' && (
                                                            <button onClick={() => handleDelete(location._id)} className="text-red-500 hover:text-red-700"><TrashBinIcon className="inline-block w-4 h-4" /></button>
                                                        )}
                                                        <button onClick={() => getId(location)} className="text-success-500 hover:text-success-700"><Navigate className="inline-block w-4 h-4 transform scale-x-[-1]" /></button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <td colSpan={6} className="px-5 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No locations found.
                                            </td>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px] m-4">
                <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Map
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 text-start'>Relocate the soil sample.</p>

                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[70vh] overflow-y-auto px-2 pb-3">
                            <div className="">
                                <div className="min-h-screen space-y-4">
                                <div className="w-full max-w-7xl h-[100vh] rounded-2xl border border-gray-200 overflow-hidden">
                                    <MapContainer
                                    center={pos}
                                    zoom={10} // zoom out to see most of the Philippines
                                    className="w-full h-full z-10"
                                    style={{ margin: "2px" }}
                                    >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
    
                                    {/* Only the marker from user click */}
                                    <LocationMarker setClickedPos={setClickedPos} clickedPos={clickedPos} />
                                    </MapContainer>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" onClick={handleGetCoordinates}>
                                Get Coordinates
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>    
        </section>
    );
}