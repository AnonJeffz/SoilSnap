import { useEffect, useState } from "react";
import {
  GroupIcon,
  Plant,
  BoxCubeIcon
} from "../../icons";
import Badge from "../ui/badge/Badge";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";


export default function EcommerceMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    crops: 0,
    soilExperts: 0,
    users: 0,
    soils: 0,
  });
  useEffect(() => {
  async function fetchMetrics() {
    try {
      const [user, expert, crops, soil] = await Promise.all([
        api.get("/api/users/count"),
        api.get("/api/users/soil-expert-count"),
        api.get("/api/crop/count"),
        api.get("/api/soil/count"),
      ]);

      setMetrics({
        crops: crops.data.count,
        users: user.data.userCount,
        soilExperts: expert.data.count,
        soils: soil.data.count,
      });
    } catch (error) {
      // Optionally handle error
      console.log(error);
      setMetrics({ crops: 0, users: 0, soilExperts: 0, soils: 0 });
    }
  }
  fetchMetrics();
}, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
      {(user?.role === "Admin") && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Soil Expert
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.soilExperts}
            </h4>
          </div>
          <Badge color="success">
            Number of Soil Experts
          </Badge>
        </div>
      </div>
      )}
      {(user?.role === "Admin" || user?.role === "Soil Expert") && (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Plant className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Crops
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.crops}
            </h4>
          </div>

          <Badge color="success">
            Number of Crops
          </Badge>
        </div>
      </div>
      )}
      {user?.role === "Admin" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Users
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metrics.users}
              </h4>
            </div>

            <Badge color="success">
              Total Users
            </Badge>
          </div>
        </div>
      )}
      {(user?.role === "Admin" || user?.role === "Soil Expert") && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxCubeIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Soil
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metrics.soils}
              </h4>
            </div>

            <Badge color="success">
              Number of Soils
            </Badge>
          </div>
        </div>
      )}
      
    </div>
  );
}
