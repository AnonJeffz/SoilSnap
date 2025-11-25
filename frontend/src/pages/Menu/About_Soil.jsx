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
      <section className="about-soil py-16 px-6 font-[Inter] bg-white dark:bg-gray-900 min-h-screen">
        {/* Intro */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-[Merriweather] font-bold text-gray-900 dark:text-white mb-6">
            About Soil
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Soil is the living foundation of ecosystems, agriculture, and human survival. 
            By studying soil through systems like the USDA Texture Triangle and 
            Munsell Color Chart, we gain the knowledge to manage land responsibly 
            and ensure a sustainable future.
          </p>
        </div>

        {/* Importance */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">Importance of Soil Study</h2>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2 text-base">
            <li><span className="font-medium text-gray-900 dark:text-white">Agriculture:</span> Determines crop growth, fertility, and yield.</li>
            <li><span className="font-medium text-gray-900 dark:text-white">Environmental Management:</span> Conserves water and prevents erosion.</li>
            <li><span className="font-medium text-gray-900 dark:text-white">Soil Conservation:</span> Guides land use and rehabilitation practices.</li>
            <li><span className="font-medium text-gray-900 dark:text-white">Research & Education:</span> Supports scientific studies and climate research.</li>
          </ul>
        </div>

        {/* USDA Soil Texture */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">USDA Soil Texture</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The <span className="font-medium text-gray-900 dark:text-white">USDA Soil Texture Classification</span> system is one of the most widely used 
            methods to categorize soils. It is based on the relative proportions of sand, silt, 
            and clay particles. These proportions determine the soil’s ability to hold water, 
            store nutrients, and support plant growth. 
            <br /><br />
            There are <span className="font-medium text-gray-900 dark:text-white">12 soil texture classes</span> in the USDA system, each with unique 
            characteristics that affect agriculture, construction, and land management. 
            Understanding these textures helps farmers, engineers, and scientists make 
            informed decisions about how land should be used.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sand Soil Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/soil/Sandy-soil.jpg" 
                alt="Sand Soil" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Sand</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Quick drainage, low in nutrients, warms rapidly.</p>
            </div>
            {/* Loam Soil Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/soil/loam-soil.jpg" 
                alt="Loam Soil" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Loam</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Balanced texture with excellent fertility and drainage.</p>
            </div>
            {/* Clay Soil Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/soil/clay-soil.jpg" 
                alt="Clay Soil" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Clay</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dense and nutrient-rich, but drains poorly.</p>
            </div>
          </div>
        </div>

        {/* Crops Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">Crops and Their Soil Preferences</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Different crops thrive in different types of soil. By matching crops with the most suitable 
            soil texture, farmers can achieve higher yields, conserve resources, and practice sustainable 
            agriculture. Some crops prefer soils that hold water, while others grow best in well-drained, 
            loose soils that allow roots to spread easily.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Rice Crop Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/crops/rice.jpeg" 
                alt="Rice" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Rice</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Prefers clay and silty soils with excellent water retention.</p>
            </div>
            {/* Banana Crop Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/crops/banana.jpg" 
                alt="Banana" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Banana</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Thrives in loam and sandy loam with good drainage.</p>
            </div>
            {/* Corn Crop Card */}
            <div className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <img 
                src="images/crops/corn.jpeg" 
                alt="Corn" 
                className="w-full h-44 object-cover rounded-md mb-3" 
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Corn</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Grows best in fertile loam soils with balanced nutrients.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
