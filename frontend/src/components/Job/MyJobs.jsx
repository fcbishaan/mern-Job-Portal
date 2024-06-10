import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`http://localhost:4000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="myJobs page bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Country</th>
                  <th className="px-4 py-2 border">City</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Salary</th>
                  <th className="px-4 py-2 border">Expired</th>
                  <th className="px-4 py-2 border">Job Type</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={editingMode !== job._id}
                        value={job.title}
                        onChange={(e) => handleInputChange(job._id, "title", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={editingMode !== job._id}
                        value={job.country}
                        onChange={(e) => handleInputChange(job._id, "country", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={editingMode !== job._id}
                        value={job.city}
                        onChange={(e) => handleInputChange(job._id, "city", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={job.category}
                        onChange={(e) => handleInputChange(job._id, "category", e.target.value)}
                        disabled={editingMode !== job._id}
                      >
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
                    </td>
                    <td className="px-4 py-2 border">
                      {job.fixedSalary ? (
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          disabled={editingMode !== job._id}
                          value={job.fixedSalary}
                          onChange={(e) => handleInputChange(job._id, "fixedSalary", e.target.value)}
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={editingMode !== job._id}
                            value={job.salaryFrom}
                            onChange={(e) => handleInputChange(job._id, "salaryFrom", e.target.value)}
                          />
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={editingMode !== job._id}
                            value={job.salaryTo}
                            onChange={(e) => handleInputChange(job._id, "salaryTo", e.target.value)}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={job.expired}
                        onChange={(e) => handleInputChange(job._id, "expired", e.target.value)}
                        disabled={editingMode !== job._id}
                      >
                        <option value={true}>TRUE</option>
                        <option value={false}>FALSE</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={job.jobType}
                        onChange={(e) => handleInputChange(job._id, "jobType", e.target.value)}
                        disabled={editingMode !== job._id}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border flex justify-between">
                      {editingMode === job._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateJob(job._id)}
                            className="p-2 rounded-full bg-green-600 text-white"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleDisableEdit}
                            className="p-2 rounded-full bg-red-600 text-white"
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnableEdit(job._id)}
                          className="p-2 rounded-md bg-yellow-500 text-black"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 rounded-md bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You've not posted any job or maybe you deleted all of your jobs!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
