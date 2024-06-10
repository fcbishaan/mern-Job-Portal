import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTitleQuery(params.get("title") || "");
    setLocationQuery(params.get("location") || "");

    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, [location.search]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  const handleTitleSearch = (e) => {
    setTitleQuery(e.target.value);
  };

  const handleLocationSearch = (e) => {
    setLocationQuery(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    const value = e.target.value;
    setSelectedJobTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleSalaryRangeChange = (e) => {
    const value = e.target.value;
    setSelectedSalaryRanges((prev) =>
      prev.includes(value) ? prev.filter((range) => range !== value) : [...prev, value]
    );
  };

  const salaryRanges = [
    { label: "< $30,000", min: 0, max: 30000 },
    { label: "$30,000 - $50,000", min: 30000, max: 50000 },
    { label: "$50,000 - $70,000", min: 50000, max: 70000 },
    { label: "$70,000 - $100,000", min: 70000, max: 100000 },
    { label: "> $100,000", min: 100000, max: Infinity },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title.toLowerCase().includes(titleQuery.toLowerCase());
    const matchesLocation = job.country.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesJobType = selectedJobTypes.length
      ? selectedJobTypes.includes(job.jobType)
      : true;
    const matchesSalaryRange = selectedSalaryRanges.length
      ? selectedSalaryRanges.some((range) => {
          const { min, max } = salaryRanges.find((r) => r.label === range);
          const salary = job.fixedSalary || (job.salaryFrom + job.salaryTo) / 2;
          return salary >= min && salary <= max;
        })
      : true;

    return matchesTitle && matchesLocation && matchesJobType && matchesSalaryRange;
  });

  return (
    <section className="jobs page bg-gray-100 py-12">
      <div className="container mx-auto flex">
        <div className="w-1/4 pr-8">
          <h1 className="text-3xl font-bold mb-8">Filters</h1>
          <div className="bg-white p-6 rounded-md shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Type</h2>
            <div className="flex flex-col">
              {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                <label key={type} className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedJobTypes.includes(type)}
                    onChange={handleJobTypeChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Salary Range</h2>
            <div className="flex flex-col">
              {salaryRanges.map((range) => (
                <label key={range.label} className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    value={range.label}
                    checked={selectedSalaryRanges.includes(range.label)}
                    onChange={handleSalaryRangeChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-center mb-8">ALL AVAILABLE JOBS</h1>
          <div className="flex justify-center mb-8 space-x-4">
            <input
              type="text"
              value={titleQuery}
              onChange={handleTitleSearch}
              placeholder="Search by title"
              className="p-3 w-64 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={locationQuery}
              onChange={handleLocationSearch}
              placeholder="Search by location"
              className="p-3 w-64 border border-gray-300 rounded-md"
            />
          </div>
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-md shadow-md relative">
                  <h3 className="text-xl font-bold mb-4">{job.title}</h3>
                  <p className="mb-2">
                    <span className="font-semibold">Job Type:</span> {job.jobType}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">City:</span> {job.city}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Salary:</span>{" "}
                    {job.fixedSalary ? (
                      <span>${job.fixedSalary}</span>
                    ) : (
                      <span>
                        ${job.salaryFrom} - ${job.salaryTo}
                      </span>
                    )}
                  </p>
                  {job.isVerified && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-200 text-green-800 font-semibold rounded">
                      Verified
                    </span>
                  )}
                  <Link
                    to={`/job/${job._id}`}
                    className="text-blue-500 hover:text-blue-600 font-semibold transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No jobs found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
