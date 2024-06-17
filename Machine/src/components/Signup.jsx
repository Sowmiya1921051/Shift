import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:3000/register', formData);
        console.log('Signup successful with values:', formData); // Log form values to the console
        setSuccessMessage('Signup successful! Redirecting to login page...');
        setFormData({ username: '', email: '', password: '' });
        setErrors({});

        // Redirect to the login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Delay of 2 seconds for user to read the success message
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ api: error.response.data.message });
        } else {
          setErrors({ api: 'An error occurred during signup' });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full">
        <div className="flex">
          <div className="w-1/3 bg-indigo-500 rounded-l-lg p-6 text-center">
            <h2 className="text-white text-2xl font-bold mb-5 mt-20">Welcome Back!</h2>
            <p className="text-white text-lg">To keep connected with us please login with your personal info</p>
            <p className="text-center text-sm text-black mt-4">
              Already have an account? <br/>
              <Link to="/login" className="text-black font-bold">
                <button className=" border border-white hover:bg-indigo-600 text-white font-bold mt-4 py-2 px-4 rounded">
                  Login
                </button>
              </Link>
            </p>
          </div>
          <div className="w-2/3 p-20 rounded-r-lg">
            <h2 className="text-4xl font-bold mb-5 text-center">Create Account</h2>
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.username && <p className="text-indigo-500 text-xs mt-1">{errors.username}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.email && <p className="text-indigo-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.password && <p className="text-indigo-500 text-xs mt-1">{errors.password}</p>}
              </div>
              {errors.api && <p className="text-indigo-500 text-xs mt-1">{errors.api}</p>}
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Signup</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
