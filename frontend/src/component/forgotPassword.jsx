import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import { useToast } from '@chakra-ui/toast';
import { Spinner } from '@chakra-ui/react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { theme } = useContext(ThemeContext);
  const toast = useToast();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Array to store particle positions
    const particles = [];

    // Function to initialize particles
    const initParticles = () => {
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * 4 - 2,
          color: `hsl(${Math.random() * 360}, 50%, 50%)`
        });
      }
    };

    // Function to draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update particle position for animation
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce particles off the walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      }

      requestAnimationFrame(drawParticles);
    };

    // Initialize particles and start the animation
    initParticles();
    drawParticles();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await axios.post('http://localhost:3000/forgot-password', { email });
      if (response.status === 200) {
        setMessage(response.data.message);
        setError('');
        setEmail(''); // Clear the input field after successful email sending
        toast({
          title: 'Success',
          description: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Account does not exist.');
        setMessage('');
        toast({
          title: 'Error',
          description: 'Account does not exist.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError('An error occurred. Please try again later.');
        setMessage('');
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-100">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm leading-5 text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={handleChange}
                value={email}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
            </div>
          </div>
          {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSending}
            >
              {isSending ? (
                <Spinner size="lg" color="white" />
              ) : (
                'Send reset link'
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
