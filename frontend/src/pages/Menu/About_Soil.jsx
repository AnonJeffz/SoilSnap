import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';

export default function AboutSoil() {
  const handleDownload = () => {
    // use Vite env or fallback to public path
    const base = import.meta.env.VITE_API_URL || "";
    const apkUrl = base ? `${base}/apk/_SoilSnap_19282707` : "/apk/_SoilSnap_19282707";

    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "SoilSnap.apk";
    // append to DOM for some browsers, trigger click, then remove
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
        {/* ⭐ Modern Hero Section */}
        <div className="w-full py-24 px-6 bg-gradient-to-br from-green-600 to-green-800 dark:from-gray-800 dark:to-gray-900 text-white">
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

        {/* ⭐ Why Soil Study Matters */}
        <div className="max-w-7xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-[Merriweather] font-semibold text-gray-900 dark:text-white text-center mb-12">
            Why Soil Study Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                emoji: '🌱',
                title: 'Agriculture',
                desc: 'Soil quality shapes crop fertility, nutrient levels, and overall food production.',
              },
              {
                emoji: '💧',
                title: 'Environmental Protection',
                desc: 'Healthy soils conserve water, reduce erosion, and support natural ecosystems.',
              },
              {
                emoji: '🛡️',
                title: 'Soil Conservation',
                desc: 'Helps guide sustainable land use, rehabilitation, and climate resilience.',
              },
              {
                emoji: '🔬',
                title: 'Scientific Research',
                desc: 'Soil data supports climate studies, environmental science, and education.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700"
              >
                <div className="text-5xl mb-4 drop-shadow-sm">{card.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ USDA Soil Texture Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">
            USDA Soil Texture
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The USDA Soil Texture Classification system categorizes soil based on the proportions of sand, silt, and clay.
            Understanding texture helps in farming, construction, and land management decisions.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'images/soil/Sandy-soil.jpg',
                title: 'Sand',
                desc: 'Drains quickly, warms fast.',
              },
              {
                img: 'images/soil/loam-soil.jpg',
                title: 'Loam',
                desc: 'Balanced & fertile.',
              },
              {
                img: 'images/soil/clay-soil.jpg',
                title: 'Clay',
                desc: 'Dense, nutrient rich.',
              },
            ].map((soil, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105"
              >
                <img
                  src={soil.img}
                  className="w-full h-44 object-cover rounded-md mb-3"
                  alt={soil.title}
                />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {soil.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{soil.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Crops Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6 pb-20">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">
            Crops and Their Soil Preferences
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Different crops grow best in different soil types. Matching crop needs with soil properties helps achieve the highest yields and healthiest plants.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'images/crops/rice.jpeg',
                title: 'Rice',
                desc: 'Thrives in clay-rich soils.',
              },
              {
                img: 'images/crops/banana.jpg',
                title: 'Banana',
                desc: 'Prefers loamy, moist soil.',
              },
              {
                img: 'images/crops/corn.jpeg',
                title: 'Corn',
                desc: 'Ideal in fertile loam.',
              },
            ].map((crop, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition transform hover:scale-105"
              >
                <img
                  src={crop.img}
                  className="w-full h-44 object-cover rounded-md mb-3"
                  alt={crop.title}
                />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {crop.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{crop.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Soil Test Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6 py-16 bg-green-50 dark:bg-gray-800 rounded-3xl text-center">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4 text-gray-900 dark:text-white">
            Test Your Soil
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Discover the health and quality of your soil with our simple soil test feature.
            Get recommendations to improve fertility and crop yield.
          </p>
          <button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition">
            Start Soil Test
          </button>
        </div>

        {/* ⭐ App Download Section */}
        <div className="max-w-6xl mx-auto mt-24 px-6 py-20 bg-gradient-to-r from-green-600 to-green-800 dark:from-gray-900 dark:to-gray-800 text-white text-center rounded-3xl">
          <h2 className="text-3xl font-[Merriweather] font-semibold mb-4">
            Get the SoilSnap App
          </h2>
          <p className="mb-8 text-lg">
            Take soil analysis on the go and stay updated with the best farming practices. Download the app now!
          </p>
          <button onClick={handleDownload} className="bg-white text-green-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition">
            Download App
          </button>
        </div>
      </section>
    </>
  );
}
