import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [jobType, setJobType] = useState(""); // New jobType state

  const { isAuthorized, user } = useContext(Context);

  const handleJobPost = async (e) => {
    e.preventDefault();
    let jobData = {
      title,
      description,
      category,
      country,
      city,
      location,
      jobType,
    };

    if (salaryType === "Fixed Salary") {
      jobData.fixedSalary = fixedSalary;
    } else if (salaryType === "Ranged Salary") {
      jobData.salaryFrom = salaryFrom;
      jobData.salaryTo = salaryTo;
    }

    await axios
      .post("http://localhost:4000/api/v1/job/post", jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  return (
    <div className="job_post page bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8">POST NEW JOB</h3>
        <form onSubmit={handleJobPost} className="bg-white p-6 rounded-md shadow-md">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="w-full p-3 border rounded-md"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Frontend Web Development">Frontend Web Development</option>
              <option value="MERN Stack Development">MERN STACK Development</option>
              <option value="Account & Finance">Account & Finance</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Video Animation">Video Animation</option>
              <option value="MEAN Stack Development">MEAN STACK Development</option>
              <option value="MEVN Stack Development">MEVN STACK Development</option>
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div className="my-4">
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
          </div>
          <div className="my-4">
            {salaryType === "default" ? (
              <p className="text-red-500">Please provide Salary Type *</p>
            ) : salaryType === "Fixed Salary" ? (
              <input
                type="number"
                placeholder="Enter Fixed Salary"
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="number"
                  placeholder="Salary From"
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Salary To"
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            )}
          </div>
          <div className="my-4">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description"
            className="w-full p-3 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 mt-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
