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

        {/* ⭐ Modern Hero Section (KEEPING AS YOU REQUESTED) */}
        <div className="w-full bg-gradient-to-br from-green-600 to-green-800 dark:from-dark-700 dark:to-dark-900 py-24 px-6 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-[Merriweather] font-bold drop-shadow-md">
              About Soil
            </h1>
            <p className="text-lg mt-6 text-gray-100 leading-relaxed">
              Soil is the foundation of ecosystems, agriculture, and human life.
              Understanding soil helps us protect the environment, grow healthier crops, 
              and build a more sustainable future.
            </p>
          </div>
        </div>


        {/* ⭐ FINAL Modern Feature Card Section (Replaces Old <ul>) */}
        <div className="max-w-7xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-[Merriweather] font-semibold text-gray-900 dark:text-white text-center mb-12">
            Why Soil Study Matters
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Card */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4 drop-shadow-sm">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agriculture
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                Soil quality shapes crop fertility, nutrient levels, and overall food production.
              </p>
            </div>

            {/* Card */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">💧</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Environmental Protection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                Healthy soils conserve water, reduce erosion, and support natural ecosystems.
              </p>
            </div>

            {/* Card */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Soil Conservation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                Helps guide sustainable land use, rehabilitation, and climate resilience.
              </p>
            </div>

            {/* Card */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Scientific Research
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                Soil data supports climate studies, environmental science, and education.
              </p>
            </div>

          </div>
        </div>




        {/* ⭐ USDA Texture Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">
            USDA Soil Texture
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The USDA Soil Texture Classification system categorizes soil based on the 
            proportions of sand, silt, and clay. Understanding texture helps in farming, 
            construction, and land management decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/Sandy-soil.jpg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Sand</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Drains quickly, warms fast.</p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/loam-soil.jpg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Loam</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Balanced & fertile.</p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/soil/clay-soil.jpg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Clay</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dense, nutrient rich.</p>
            </div>
          </div>
        </div>




        {/* ⭐ Crops Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6 pb-20">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">
            Crops and Their Soil Preferences
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Different crops grow best in different soil types. Matching crop needs with soil 
            properties helps achieve the highest yields and healthiest plants.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/rice.jpeg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Rice</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Thrives in clay-rich soils.</p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/banana.jpg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Banana</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Prefers loamy, moist soil.</p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105">
              <img src="images/crops/corn.jpeg" className="w-full h-44 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Corn</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ideal in fertile loam.</p>
            </div>

          </div>
        </div>

      </section>
    </>
  );
}
