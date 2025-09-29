

export default function PublicPanel() {
  // Mock urgent needs
  const urgentNeeds = [
    { id: 1, item: "Wheelchairs", required: 10, received: 6 },
    { id: 2, item: "Medicines", required: 50, received: 30 },
    { id: 3, item: "Winter Blankets", required: 100, received: 72 },
  ];

  // Mock impact stats
  const impactStats = [
    { label: "Meals Served", value: "25,000+" },
    { label: "Patients Treated", value: "5,200+" },
    { label: "Jobs Created", value: "120+" },
    { label: "Active Volunteers", value: "450+" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-green-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Digital Pingalwara</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          A transparent platform to support, donate, volunteer, and empower the
          residents of Pingalwara.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-2 bg-white text-green-600 font-semibold rounded-xl shadow hover:bg-gray-100">
            Donate
          </button>
          <button className="px-6 py-2 bg-white text-green-600 font-semibold rounded-xl shadow hover:bg-gray-100">
            Volunteer
          </button>
          <button className="px-6 py-2 bg-white text-green-600 font-semibold rounded-xl shadow hover:bg-gray-100">
            Jobs
          </button>
        </div>
      </header>

      {/* Urgent Needs */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Urgent Needs</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {urgentNeeds.map((need) => {
            const progress = Math.round(
              (need.received / need.required) * 100
            );
            return (
              <div
                key={need.id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h3 className="text-lg font-semibold">{need.item}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {need.received}/{need.required} fulfilled
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                  Contribute
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-gray-100 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          {impactStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h3 className="text-3xl font-bold text-green-600">
                {stat.value}
              </h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-green-600 text-white">
        <p>© 2025 Digital Pingalwara. All rights reserved.</p>
      </footer>
    </div>
  );
}
