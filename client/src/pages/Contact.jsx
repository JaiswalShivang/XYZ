import React from 'react';

const Contact = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
    <p className="text-gray-700 text-lg mb-4">
      Have questions or feedback? Reach out to us!
    </p>
    <form className="space-y-4">
      <input className="w-full border px-3 py-2 rounded" type="text" placeholder="Your Name" required />
      <input className="w-full border px-3 py-2 rounded" type="email" placeholder="Your Email" required />
      <textarea className="w-full border px-3 py-2 rounded" rows="5" placeholder="Your Message" required />
      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" type="submit">Send</button>
    </form>
  </div>
);

export default Contact; 