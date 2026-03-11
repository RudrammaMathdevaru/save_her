import React from "react";
import { NavLink } from "react-router-dom";

const reports = [
  {
    title: (
      <>
        Suspicious Activity <br />
        Near Central Park
      </>
    ),
    desc: "A group of individuals were observed following women in the Central Park area during evening hours. Multiple witnesses reported the incident.",
    location: "Central Park, Downtown",
    date: "January 15, 2024",
  },
  {
    title: "Poor Lighting on Main Street",
    desc: "Several streetlights are not functioning on Main Street between 5th and 8th Avenue, creating unsafe conditions for pedestrians at night.",
    location: "Main Street, City Center",
    date: "January 14, 2024",
  },
  {
    title: (
      <>
        Harassment Incident at Metro <br />
        Station
      </>
    ),
    desc: "Verbal harassment reported at Metro Station platform. Security has been notified and additional patrols have been deployed.",
    location: "Metro Station, Line 3",
    date: "January 13, 2024",
  },
];

const RecentReports = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Recent Approved Incident Reports
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-500">
            Stay informed about verified safety incidents in your community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/30 bg-white/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="absolute right-5 top-5 sm:right-6 sm:top-6 rounded-full bg-green-100 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold text-green-600 transition duration-300 group-hover:scale-105">
                Approved
              </span>

              <h3 className="mb-4 pr-20 sm:pr-24 text-xl sm:text-2xl font-semibold leading-snug text-gray-900">
                {report.title}
              </h3>

              <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-500">
                {report.desc}
              </p>

              <div className="mb-3 flex items-center text-gray-500">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21s-6-4.35-6-10a6 6 0 0112 0c0 5.65-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
                <span className="text-sm sm:text-base">{report.location}</span>
              </div>

              <div className="flex items-center text-gray-500">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-sm sm:text-base">{report.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 flex justify-center">
          <NavLink
            to="/reports"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 sm:px-10 py-3.5 sm:py-4 text-center text-base sm:text-lg font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
          >
            View All Reports
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default RecentReports;