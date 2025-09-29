import { motion } from "framer-motion";
import { Heart, Users, Briefcase, UtensilsCrossed, Stethoscope } from "lucide-react";

export default function PublicPanel() {
  // Mock urgent needs
  const urgentNeeds = [
    {
      id: 1,
      item: "Wheelchairs",
      required: 10,
      received: 6,
      image: "https://images.unsplash.com/photo-1588776814546-ec7d7c1465e3?w=600", // wheelchair placeholder
    },
    {
      id: 2,
      item: "Medicines",
      required: 50,
      received: 30,
      image: "https://images.unsplash.com/photo-1580281657521-6b86a37d986a?w=600",
    },
    {
      id: 3,
      item: "Winter Blankets",
      required: 100,
      received: 72,
      image: "https://images.unsplash.com/photo-1602228833816-6e0d7bd8768f?w=600",
    },
  ];

  // Mock impact stats with icons
  const impactStats = [
    { label: "Meals Served", value: "25,000+", icon: <UtensilsCrossed size={32} /> },
    { label: "Patients Treated", value: "5,200+", icon: <Stethoscope size={32} /> },
    { label: "Jobs Created", value: "120+", icon: <Briefcase size={32} /> },
    { label: "Active Volunteers", value: "450+", icon: <Users size={32} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="relative bg-green-700 text-white text-center">
        <img
          src="https://images.unsplash.com/photo-1508881599352-2a3dba4a1d17?w=1600"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative py-16 px-6">
          <h1 className="text-5xl font-extrabold">Digital Pingalwara</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            A transparent platform to support, donate, volunteer, and empower the residents of Pingalwara.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-2xl shadow hover:bg-gray-100">
              Donate
            </button>
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-2xl shadow hover:bg-gray-100">
              Volunteer
            </button>
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-2xl shadow hover:bg-gray-100">
              Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Urgent Needs */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Urgent Needs</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {urgentNeeds.map((need) => {
            const progress = Math.round((need.received / need.required) * 100);
            return (
              <motion.div
                key={need.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <img src={need.image} alt={need.item} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{need.item}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {need.received}/{need.required} fulfilled
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2">
                    <Heart size={18} /> Contribute
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {impactStats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center"
            >
              <div className="text-green-600 mb-3">{stat.icon}</div>
              <h3 className="text-3xl font-extrabold text-green-700">{stat.value}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-green-700 text-white">
        <p>© 2025 Digital Pingalwara. All rights reserved.</p>
      </footer>
    </div>
  );
}