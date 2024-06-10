import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ResumeModal from './ResumeModal';
import MessageModal from './MessageModal';

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState('');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigateTo = useNavigate();

  useEffect(() => {
    if (isAuthorized) {
      const fetchApplications = async () => {
        try {
          const endpoint =
            user.role === 'Employer'
              ? 'http://localhost:4000/api/v1/application/employer/getall'
              : 'http://localhost:4000/api/v1/application/jobseeker/getall';
          const { data } = await axios.get(endpoint, { withCredentials: true });
          setApplications(data.applications);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchApplications();
    } else {
      navigateTo('/');
    }
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/application/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success('Message sent to the job seeker.');
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id ? { ...application, status } : application
        )
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openMessageModal = (message) => {
    setMessage(message);
    setMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
  };

  return (
    <section className="my_applications page bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {user && user.role === 'Job Seeker' ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">My Applications</h1>
            {applications.length <= 0 ? (
              <h4 className="text-center text-gray-500">No Applications Found</h4>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Email</th>
                    <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                    <th className="py-2 px-4 border-b border-gray-200">Address</th>
                    <th className="py-2 px-4 border-b border-gray-200">Cover Letter</th>
                    <th className="py-2 px-4 border-b border-gray-200">Status</th>
                    <th className="py-2 px-4 border-b border-gray-200">Resume</th>
                    <th className="py-2 px-4 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((element) => (
                    <tr key={element._id}>
                      <td className="py-2 px-4 border-b border-gray-200">{element.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.email}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.phone}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.address}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.coverLetter}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.status || 'Pending'}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <img
                          src={element.resume.url}
                          alt="resume"
                          className="max-w-[150px] max-h-[150px] object-cover cursor-pointer rounded-md"
                          onClick={() => openModal(element.resume.url)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => openMessageModal(element.message)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2"
                        >
                          View Message
                        </button>
                        <button
                          onClick={() => deleteApplication(element._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete Application
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-black-700">Applications From Job Seekers</h1>
            {applications.length <= 0 ? (
              <h4 className="text-center text-gray-500">No Applications Found</h4>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Email</th>
                    <th className="py-2 px-4 border-b border-gray-200">Phone</th>
                    <th className="py-2 px-4 border-b border-gray-200">Address</th>
                    <th className="py-2 px-4 border-b border-gray-200">Cover Letter</th>
                    <th className="py-2 px-4 border-b border-gray-200">Resume</th>
                    <th className="py-2 px-4 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((element) => (
                    <tr key={element._id}>
                      <td className="py-2 px-4 border-b border-gray-200">{element.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.email}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.phone}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.address}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{element.coverLetter}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <img
                          src={element.resume.url}
                          alt="resume"
                          className="max-w-[150px] max-h-[150px] object-cover cursor-pointer rounded-md"
                          onClick={() => openModal(element.resume.url)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleApplicationStatus(element._id, 'accept')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(element._id, 'decline')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
        {messageModalOpen && (
          <MessageModal 
            isOpen={messageModalOpen}
            message={message}
            onClose={closeMessageModal}
          />
        )}
      </div>
    </section>
  );
};

export default MyApplications;
