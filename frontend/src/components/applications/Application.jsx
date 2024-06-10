import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
    setFileSelected(true);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      setFileSelected(false);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application bg-blue text-blue py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6 text-center">Application Form</h2>
        <form onSubmit={handleApplication} className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
            required
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
            required
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
            required
          />
          <div className="mb-4">
            <label className="block mb-2 text-lg font-semibold">Upload Yoour Resume</label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              className="block w-full px-4 py-2 border border-blue rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
              required
            />
            {fileSelected && <p className="mt-2 text-sm">File Selected: {resume ? resume.name : ""}</p>}
          </div>
          <button type="submit" className="block w-full px-4 py-2 bg-blue-500 text-blue rounded-md hover:bg-blue-600">
            Send Application
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
