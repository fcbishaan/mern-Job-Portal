import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../main';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Feedback = () => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/feedback/job/${id}`)
      .then((res) => setFeedbacks(res.data.feedbacks))
      .catch((err) => toast.error(err.response.data.message));
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/feedback/add',
        { job: id, feedback },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setFeedbacks([...feedbacks, data.feedback]);
      setFeedback('');
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="feedback-section mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Feedback</h3>
      <form onSubmit={handleFeedbackSubmit} className="mb-4">
        <textarea
          placeholder="Leave your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit Feedback
        </button>
      </form>
      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb._id} className="bg-gray-100 p-4 rounded-md mb-2">
            <p className="text-gray-800">{fb.feedback}</p>
            <small className="text-gray-600">— {fb.user.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
