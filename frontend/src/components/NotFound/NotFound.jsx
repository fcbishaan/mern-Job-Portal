import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <section className='page notfound flex justify-center items-center h-screen'>
        <div className="content text-center">
          <img src="/notfound.png" alt="notfound" />
          <Link to={'/'} className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">RETURN TO HOME PAGE</Link>
        </div>
      </section>
    </>
  )
}

export default NotFound;
