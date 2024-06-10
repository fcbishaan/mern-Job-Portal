import React from "react";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Street 50, Delhi, India",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Tesla",
      location: "GB Road, Hyderabad, India",
      openPositions: 5,
      icon: <SiTesla />,
    },
    {
      id: 3,
      title: "Apple",
      location: "Street 10, Bangalore, India",
      openPositions: 20,
      icon: <FaApple />,
    },
  ];

  return (
    <div className="companies bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <h3 className="text-4xl font-bold mb-10 text-center text-white">Top Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((element) => (
            <div
              className="card p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
              key={element.id}
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl text-blue-500">{element.icon}</div>
                <div className="ml-4">
                  <p className="text-xl font-semibold text-gray-800">{element.title}</p>
                  <p className="text-gray-500">{element.location}</p>
                </div>
              </div>
              <button className="text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-4 w-full">
                {element.openPositions} Open Positions
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
