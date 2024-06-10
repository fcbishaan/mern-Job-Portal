import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import Feedback from "../feedback/Feedback";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [otherJobs, setOtherJobs] = useState([]);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJob(response.data.job);
      } catch (error) {
        navigateTo("/notfound");
      }
    };
    fetchJobDetails();
  }, [id, navigateTo]);

  useEffect(() => {
    const fetchOtherJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setOtherJobs(response.data.jobs.filter((job) => job._id !== id));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOtherJobs();
  }, [id]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
    }
  }, [isAuthorized, navigateTo]);

  return (
    <div className="jobDetail page bg-gray-100 py-12">
      <div className="container mx-auto">
        <div className="bg-white rounded-md shadow-lg p-8 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-4xl font-bold text-blue-600">{job?.title || "No Title Available"}</h3>
            
            <p className="text-lg font-semibold">
              <span className="text-gray-700">Salary: </span>
              {job?.fixedSalary ? (
                <span className="text-green-600">${job.fixedSalary.toLocaleString()}</span>
              ) : (
                <span className="text-green-600">
                  ${job?.salaryFrom?.toLocaleString() || "No Salary"} - ${job?.salaryTo?.toLocaleString() || "Available"}
                </span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Category:</span>{" "}
                {job?.category || "No Category Available"}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Job Type:</span>{" "}
                {job?.jobType || "No Job Type Available"}{" "}
                
              </p>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">City:</span> {job?.city || "No City Available"}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Location:</span> {job?.location || "No Location Available"}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Description:</span>{" "}
                {job?.description || "No Description Available"}
              </p>
            </div>
            <div>
              <p className="mb-4">
                <span className="font-semibold text-gray-700">Job Posted on:</span>{" "}
                {new Date(job?.jobPostedOn).toLocaleDateString() || "No Date Available"}
              </p>
              {user?.role === "Job Seeker" && (
                <Link
                  to={`/application/${job?._id}`}
                  className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Apply Now
                </Link>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-8 text-blue-600">Other Available Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherJobs.length > 0 ? (
              otherJobs.map((otherJob) => (
                <div key={otherJob._id} className="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-2xl font-bold mb-4 text-blue-600">{otherJob.title}</h4>
                  <p className="mb-2">
                    <span className="font-semibold">Job Type:</span> {otherJob.jobType}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">City:</span> {otherJob.city}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Salary:</span>{" "}
                    {otherJob.fixedSalary ? (
                      <span>${otherJob.fixedSalary.toLocaleString()}</span>
                    ) : (
                      <span>
                        ${otherJob.salaryFrom.toLocaleString()} - ${otherJob.salaryTo.toLocaleString()}
                      </span>
                    )}
                  </p>
                
    
                  <Link
                    to={`/job/${otherJob._id}`}
                    className="text-blue-500 hover:text-blue-600 font-semibold transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No other jobs found.</p>
            )}
          </div>
        </div>
        <Feedback />
      </div>
    </div>
  );
};

export default JobDetails;
