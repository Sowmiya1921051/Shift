import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:3000/login', formData);
        console.log('Login successful:', response.data);
        // Redirect to the home page after successful login
        navigate('/options');
      } catch (error) {
        if (error.response && error.response.data) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError('An error occurred during login');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full">
        <div className="flex">
          <div className="w-2/3 p-20 rounded-l-lg">
            <h2 className="text-4xl font-bold mb-5 text-center">Login</h2>
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
              {loginError && <p className="text-indigo-500 text-xs mb-4">{loginError}</p>}
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Login</button>
            </form>
           
          </div>
          <div className="w-1/3 bg-indigo-500 rounded-r-lg p-6 text-center">
            <h2 className="text-white text-2xl font-bold mb-5 mt-14">Hello, Friend!</h2>
            <p className="text-white text-lg">Enter your personal details and start journey with us</p>
            <p className=" text-sm text-black mt-4">
            Don't have an account?<br/>
              <Link to="/" className="text-black font-bold">
                <button className=" border border-white hover:bg-indigo-600 text-white font-bold mt-4 py-2 px-4 rounded">
                Signup
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
