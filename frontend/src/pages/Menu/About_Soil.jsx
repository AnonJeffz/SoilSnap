import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';

export default function AboutSoil() {
  return (
    <>
      <PageMeta
        title="SoilSnap"
        description="SoilSnap is a platform for soil data management and analysis."
      />

      <Navbar />

      <section className="about-soil font-[Inter] bg-white dark:bg-gray-900 min-h-screen">

        {/* ⭐ Modern Hero Section */}
        <div className="w-full bg-gradient-to-br from-green-600 to-green-800 dark:from-green-700 dark:to-green-900 py-24 px-6 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-[Merriweather] font-bold drop-shadow-md">
              About Soil
            </h1>
            <p className="text-lg mt-6 text-gray-100 leading-relaxed">
              Soil is the foundation of all life on Earth. It supports ecosystems, agriculture,
              and human development. Studying soil helps us understand how to protect the environment,
              grow healthier crops, and build a sustainable future.
            </p>
          </div>
        </div>

        {/* ⭐ New Modern Importance Section */}
        <div className="max-w-6xl mx-auto px-6 mt-20">
          <h2 className="text-4xl font-[Merriweather] font-semibold text-gray-900 dark:text-white mb-10 text-center">
            Why Soil Study Matters
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition duration-300">
              <div className="text-green-600 dark:text-green-400 text-4xl mb-3">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Agriculture</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Soil determines fertility, crop growth, and food production.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition duration-300">
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-3">💧</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Environment</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Healthy soils help conserve water and prevent erosion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition duration-300">
              <div className="text-yellow-500 dark:text-yellow-300 text-4xl mb-3">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Conservation</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Guides land protection and sustainable usage practices.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition duration-300">
              <div className="text-purple-500 dark:text-purple-300 text-4xl mb-3">🔬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Research</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Supports scientific studies, climate research, and education.
              </p>
            </div>

          </div>
        </div>

        {/* ⭐ USDA Texture Section */}
        <div className="max-w-6xl mx-auto mt-20 px-6">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">USDA Soil Texture</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The USDA Soil Texture Classification system is widely used to categorize soil based on 
            proportions of sand, silt, and clay. These characteristics determine water retention, 
            nutrient storage, and plant support.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/Sandy-soil.jpg" alt="Sand Soil" className="w-full h-44 object-cover rounded-md mb-3"/>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Sand</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Quick drainage, low nutrients.</p>
            </div>

            {/* Card 2 */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/loam-soil.jpg" alt="Loam Soil" className="w-full h-44 object-cover rounded-md mb-3"/>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Loam</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Balanced texture, very fertile.</p>
            </div>

            {/* Card 3 */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/clay-soil.jpg" alt="Clay Soil" className="w-full h-44 object-cover rounded-md mb-3"/>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Clay</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dense and nutrient-rich.</p>
            </div>
          </div>
        </div>

        {/* ⭐ Crops Section */}
        <div className="max-w-6xl mx-auto mt-20 px-6 mb-20">
          <h2 className="text-3xl font-[Merriweather] font-semibold text-gray-900 dark:text-white mb-4">
            Crops and Their Soil Preferences
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Matching crops with their preferred soil type leads to better yields, healthier plants,
            and more efficient farming practices.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Rice */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/rice.jpeg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rice</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Prefers clay & silty soils.</p>
            </div>

            {/* Banana */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/banana.jpg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banana</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Thrives in loamy soil.</p>
            </div>

            {/* Corn */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/corn.jpeg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Corn</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Needs fertile loam.</p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
