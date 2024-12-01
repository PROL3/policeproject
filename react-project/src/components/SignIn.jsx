import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const SignIn = () => {
  //admin@gmail.com
  //adminadmin
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: null,
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const loginData = { email, password };

    try {
      const response = await axios.post('http://localhost:3000/api/login', loginData);
      if(response.data){
        alert('ההתחברות הצליחה');
        console.log('ההתחברות בוצעה בהצלחה:', response.data);
        
        // Redirect to /home page using useNavigate
        navigate('/');
      } else {
        setFormData((prevState) => ({
          ...prevState,
          error: 'No token received, please try again.',
        }));
      }
    } catch (error) {
      // Improved error handling, display server message if available
      const errorMessage = error.response ? error.response.data.message : error.message;
      setFormData((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    }
  };

  return (
    <form onSubmit={signIn} className="max-w-md mx-auto p-4">
      {formData.error && <p className="text-red-500 mb-4">{formData.error}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="mb-1">הכנס איימיל</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">הכנס סיסמא</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        התחברות
      </button>
    </form>
  );
};

export default SignIn;
