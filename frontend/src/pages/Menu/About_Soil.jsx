import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';

export default function AboutSoil() {
  const handleDownload = () => {
    const base = import.meta.env.VITE_API_URL || "";
    const apkUrl = base ? `${base}/apk/_SoilSnap_19282707` : "/apk/_SoilSnap_19282707";

    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "SoilSnap.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageMeta
        title="SoilSnap"
        description="SoilSnap is a platform for soil data management and analysis."
      />
      <Navbar />

      <section className="about-soil font-[Inter] bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* ⭐ Hero Section */}
        <div className="w-full py-28 px-6 bg-gradient-to-br from-green-600 to-green-800 dark:from-gray-900 dark:to-gray-800 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <h1 className="text-4xl font-[Merriweather] font-bold drop-shadow-lg">
              About Soil
            </h1>
            <p className="text-lg mt-6 text-gray-100 leading-relaxed">
              Soil is the foundation of ecosystems, agriculture, and human life.
              Understanding soil helps us protect the environment, grow healthier crops,
              and build a more sustainable future.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            {/* subtle abstract shapes */}
            <div className="absolute w-96 h-96 bg-green-500 opacity-10 rounded-full -top-24 -left-24"></div>
            <div className="absolute w-72 h-72 bg-green-400 opacity-10 rounded-full -bottom-24 -right-16"></div>
          </div>
        </div>

        {/* ⭐ Why Soil Study Matters */}
        <div className="max-w-7xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-[Merriweather] font-semibold text-gray-900 dark:text-white text-center mb-12">
            Why Soil Study Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { emoji: '🌱', title: 'Agriculture', desc: 'Soil quality shapes crop fertility, nutrient levels, and overall food production.' },
              { emoji: '💧', title: 'Environmental Protection', desc: 'Healthy soils conserve water, reduce erosion, and support natural ecosystems.' },
              { emoji: '🛡️', title: 'Soil Conservation', desc: 'Helps guide sustainable land use, rehabilitation, and climate resilience.' },
              { emoji: '🔬', title: 'Scientific Research', desc: 'Soil data supports climate studies, environmental science, and education.' },
            ].map((card, idx) => (
              <div key={idx} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-5xl mb-4 drop-shadow-sm">{card.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ USDA Soil Texture */}
        <div className="max-w-6xl mx-auto mt-32 px-6">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-6 text-gray-900 dark:text-white text-center">
            USDA Soil Texture
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center max-w-3xl mx-auto">
            The USDA Soil Texture Classification system categorizes soil based on the proportions of sand, silt, and clay.
            Understanding texture helps in farming, construction, and land management decisions.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { img: 'images/soil/Sandy-soil.jpg', title: 'Sand', desc: 'Drains quickly, warms fast.' },
              { img: 'images/soil/loam-soil.jpg', title: 'Loam', desc: 'Balanced & fertile.' },
              { img: 'images/soil/clay-soil.jpg', title: 'Clay', desc: 'Dense, nutrient rich.' },
            ].map((soil, idx) => (
              <div key={idx} className="group relative overflow-hidden p-5 bg-white dark:bg-gray-800 shadow-xl rounded-3xl transition transform hover:scale-105 hover:shadow-2xl">
                <img src={soil.img} alt={soil.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{soil.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{soil.desc}</p>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-green-50 dark:via-gray-700 to-transparent opacity-20 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Crops Section */}
        <div className="max-w-6xl mx-auto mt-32 px-6 pb-28">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-6 text-gray-900 dark:text-white text-center">
            Crops and Their Soil Preferences
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-10 text-center max-w-3xl mx-auto">
            Different crops grow best in different soil types. Matching crop needs with soil properties helps achieve the highest yields and healthiest plants.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { img: 'images/crops/rice.jpeg', title: 'Rice', desc: 'Thrives in clay-rich soils.' },
              { img: 'images/crops/banana.jpg', title: 'Banana', desc: 'Prefers loamy, moist soil.' },
              { img: 'images/crops/corn.jpeg', title: 'Corn', desc: 'Ideal in fertile loam.' },
            ].map((crop, idx) => (
              <div key={idx} className="group relative overflow-hidden p-5 bg-white dark:bg-gray-800 shadow-xl rounded-3xl transition transform hover:scale-105 hover:shadow-2xl">
                <img src={crop.img} alt={crop.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{crop.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{crop.desc}</p>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-green-50 dark:via-gray-700 to-transparent opacity-20 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ App Download Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6 py-20 bg-gradient-to-r from-green-600 to-green-800 dark:from-gray-900 dark:to-gray-800 text-white text-center rounded-3xl relative overflow-hidden">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4">Get the SoilSnap App</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Take soil analysis on the go and stay updated with the best farming practices. Download the app now!
          </p>
          <button
            onClick={handleDownload}
            className="bg-white dark:bg-green-600 text-green-700 dark:text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            Download App
          </button>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="w-64 h-64 bg-white dark:bg-gray-700 rounded-full absolute -top-16 -left-16"></div>
            <div className="w-48 h-48 bg-white dark:bg-gray-700 rounded-full absolute -bottom-16 -right-12"></div>
          </div>
        </div>
      </section>
    </>
  );
}
