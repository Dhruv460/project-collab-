import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ThemeContext } from "../ThemeContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Heading,
  Text,
  Center,
} from "@chakra-ui/react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
    socketId: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const toast = useToast();
  const canvasRef = useRef(null);
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const socket = io(`${api_url}`);
    socket.on("connect", () => {
      setFormData((prevData) => ({ ...prevData, socketId: socket.id }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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
          color: `hsl(${Math.random() * 360}, 50%, 50%)`,
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

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${api_url}/api/users/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg(response.data.mssg);
      toast({
        title: "Registration Successful",
        description: response.data.mssg,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem("userId", response.data.message);
      localStorage.setItem("userAvatar", response.data.avatar);
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: "Registration Failed",
        description:
          error.response?.data || "An error occurred during registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      overflow="hidden"
      bg={theme === "dark" ? "gray.900" : "gray.100"}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      ></canvas>
      <Center position="relative" zIndex={1} minH="100vh" p={6}>
        <Box
          maxW="md"
          w="full"
          bg={theme === "dark" ? "gray.800" : "white"}
          shadow="md"
          rounded="lg"
          p={6}
        >
          <Heading
            as="h2"
            size="lg"
            textAlign="center"
            mb={6}
            color={theme === "dark" ? "gray.100" : "gray.900"}
          >
            Sign up for an account
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel color={theme === "dark" ? "gray.300" : "gray.700"}>
                  Username
                </FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  bg={theme === "dark" ? "gray.700" : "white"}
                  color={theme === "dark" ? "gray.100" : "gray.900"}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel color={theme === "dark" ? "gray.300" : "gray.700"}>
                  Email
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  bg={theme === "dark" ? "gray.700" : "white"}
                  color={theme === "dark" ? "gray.100" : "gray.900"}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel color={theme === "dark" ? "gray.300" : "gray.700"}>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  bg={theme === "dark" ? "gray.700" : "white"}
                  color={theme === "dark" ? "gray.100" : "gray.900"}
                />
              </FormControl>
              <FormControl id="profileImage" isRequired>
                <FormLabel color={theme === "dark" ? "gray.300" : "gray.700"}>
                  Profile Image
                </FormLabel>
                <Input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  bg={theme === "dark" ? "gray.700" : "white"}
                  color={theme === "dark" ? "gray.100" : "gray.900"}
                />
              </FormControl>
              {msg && <Text color="green.500">{msg}</Text>}
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Registering"
                colorScheme="teal"
                w="full"
              >
                Register
              </Button>
            </VStack>
          </form>
          <Text
            mt={4}
            textAlign="center"
            color={theme === "dark" ? "gray.400" : "gray.600"}
          >
            Already have an account?{" "}
            <Link to="/login">
              <Text
                as="span"
                color="teal.500"
                _hover={{ textDecoration: "underline" }}
              >
                Sign in here
              </Text>
            </Link>
          </Text>
        </Box>
      </Center>
    </Box>
  );
};

export default RegisterForm;
