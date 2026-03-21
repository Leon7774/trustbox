import React from 'react';
import Head from 'next/head';

// Industry Standard: Componentize your data to keep the JSX clean and maintainable.
const UPCOMING_TASKS = [
  { name: 'Fiddle Leaf Fig', water: 'In 2 days', sun: 'Bright, indirect', fert: 'In 3 weeks' },
  { name: 'Snake Plant', water: 'In 5 days', sun: 'Low to bright, indirect', fert: 'In 6 weeks' },
  { name: 'Monstera', water: 'In 3 days', sun: 'Bright, indirect', fert: 'In 4 weeks' },
];

const ALL_PLANTS = [
  { id: 1, name: 'Fiddle Leaf Fig', water: '2 days', img: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Snake Plant', water: '5 days', img: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Monstera', water: '3 days', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Pothos', water: '4 days', img: null },
];

export default function PlantCareDashboard() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Head>
        <title>Indoor Plant Care Dashboard</title>
        {/* Link to Google Fonts - better to use next/font in production */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </Head>

      <div className="flex flex-col group/design-root overflow-x-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-stone-200 px-6 md:px-10 py-4 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-stone-800">
            <span className="material-icons-outlined text-green-500 !text-[28px]">local_florist</span>
            <h1 className="text-xl font-bold tracking-tight">Plant Care</h1>
          </div>

          <div className="flex flex-1 justify-end items-center gap-4 md:gap-6">
            <div className="relative hidden md:block max-w-xs w-full">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 !text-[20px]">search</span>
              <input
                className="w-full rounded-lg border-stone-300 bg-stone-50 py-2 pl-10 pr-4 text-sm text-stone-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                placeholder="Search plants..."
                type="search"
              />
            </div>

            <button className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors">
              <span className="material-icons-outlined !text-[24px]">notifications</span>
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>

            <div className="size-10 rounded-full border-2 border-green-200 bg-stone-200 overflow-hidden shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PlantLover" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-stone-800 tracking-tight">My Plants</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 w-full md:w-auto rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-semibold shadow-md hover:bg-green-600 transition-colors">
                  <span className="material-icons-outlined !text-[20px]">add_circle_outline</span>
                  <span>Add New Plant</span>
                </button>
              </div>
            </div>

            {/* Upcoming Tasks Table */}
            <section className="mb-10">
              <h3 className="text-xl font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-green-500">calendar_today</span>
                Upcoming Tasks
              </h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-stone-200">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-stone-100">
                    <tr>
                      {['Plant', 'Watering', 'Sunlight', 'Fertilization'].map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {UPCOMING_TASKS.map((task, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-800">{task.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{task.water}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{task.sun}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{task.fert}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Plant Grid */}
            <section>
              <h3 className="text-xl font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-green-500">eco</span>
                All Plants
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ALL_PLANTS.map((plant) => (
                  <div key={plant.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-stone-200 group cursor-pointer">
                    <div className="w-full h-48 bg-stone-200 overflow-hidden">
                      {plant.img ? (
                        <img src={plant.img} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-icons-outlined text-stone-400 !text-[48px]">add_photo_alternate</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-stone-800 mb-1 group-hover:text-green-600">{plant.name}</h4>
                      <p className="text-sm text-stone-600 flex items-center">
                        <span className="material-icons-outlined text-blue-500 mr-1.5 !text-[16px]">water_drop</span>
                        Water in {plant.water}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}