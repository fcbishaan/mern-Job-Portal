import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const HeroSection = ({ jobTitle, setJobTitle, location, setLocation, jobSuggestions, handleSelectJob }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (jobTitle.length >= 3) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [jobTitle]);

  return (
    <div className="heroSection bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-12 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="title text-center md:text-left md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">Find a job that suits</h1>
          <h1 className="text-4xl font-bold mb-4">your interests and skills</h1>
          <p className="text-lg">Get your preferable verified Job</p>
        </div>
        <div className="image hidden md:block md:w-1/2">
          <img src="/heroS.jpg" alt="hero" />
        </div>
      </div>
      {showDropdown && jobSuggestions.length > 0 && (
        <div className="absolute bg-white text-black w-full mt-2 rounded-md shadow-lg z-10">
          {jobSuggestions.map((job) => (
            <div
              key={job._id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectJob(job)}
            >
              {job.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const locationHook = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setJobTitle(params.get("title") || "");
    setLocation(params.get("location") || "");

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
  }, [locationHook.search]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  const fetchJobSuggestions = async (query) => {
    if (query.length < 3) {
      setJobSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/v1/job/search?search=${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { jobs } = await response.json();
      setJobSuggestions(jobs);
    } catch (error) {
      console.error('Failed to fetch job suggestions:', error);
    }
  };

  useEffect(() => {
    fetchJobSuggestions(jobTitle);
  }, [jobTitle]);

  const handleTitleSearch = (e) => {
    setJobTitle(e.target.value);
  };

  const handleLocationSearch = (e) => {
    setLocation(e.target.value);
  };

  const handleSelectJob = (job) => {
    setJobTitle(job.title);
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
    const matchesTitle = job.title.toLowerCase().includes(jobTitle.toLowerCase());
    const matchesLocation = job.country.toLowerCase().includes(location.toLowerCase());
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
    <>
      <HeroSection
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        location={location}
        setLocation={setLocation}
        jobSuggestions={jobSuggestions}
        handleSelectJob={handleSelectJob}
      />
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
            <h1 className="text-3xl font-bold text-center mb-8">SEARCH FOR A JOB</h1>
            <div className="flex justify-center mb-8 space-x-4">
              <input
                type="text"
                value={jobTitle}
                onChange={handleTitleSearch}
                placeholder="Search by title"
                className="p-3 w-64 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={location}
                onChange={handleLocationSearch}
                placeholder="Search by location"
                className="p-3 w-64 border border-gray-300 rounded-md"
              />
            </div>
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="bg-white p-6 rounded-md shadow-md">
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Job Type:</strong> {job.jobType}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>City:</strong> {job.country}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Salary:</strong> ${job.fixedSalary || `${job.salaryFrom} - ${job.salaryTo}`}
                    </p>
                    <Link to={`/job/${job._id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-700">No jobs found</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Jobs;
