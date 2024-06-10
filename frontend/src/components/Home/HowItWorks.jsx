import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <div className="howitworks bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h3 className="text-4xl font-bold mb-10 text-blue-700 text-center">How JobHub Works</h3>
        <div className="banner flex flex-col md:flex-row justify-center items-center gap-8">
          {[
            {
              icon: <FaUserPlus className="text-4xl text-blue-600 mb-4 mx-auto" />,
              title: "Create Account",
              description:
                "Sign up to JobHub to access a variety of features and job opportunities.",
            },
            {
              icon: <MdFindInPage className="text-4xl text-blue-600 mb-4 mx-auto" />,
              title: "Find a Job/Post a Job",
              description:
                "Browse through available job listings or post your own job openings.",
            },
            {
              icon: <IoMdSend className="text-4xl text-blue-600 mb-4 mx-auto" />,
              title: "Apply For Job/Recruit Suitable Candidates",
              description:
                "Apply for jobs that match your skills or recruit candidates for your job openings.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="card bg-white text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              {item.icon}
              <p className="text-xl font-semibold text-gray-800 mb-2">{item.title}</p>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
