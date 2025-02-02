import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/database';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await createUser(
        formData.name.trim(),
        formData.email.toLowerCase(),
        formData.password
      );

      if (result.success) {
        // Create a session token
        const token = btoa(JSON.stringify({
          email: formData.email,
          exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }));
        
        localStorage.setItem('token', token);
        navigate('/chat');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            width: '100%',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(66, 184, 131, 0.3)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Typography 
            component="h1" 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ 
              color: '#42b883',
              textShadow: '0 0 15px rgba(66, 184, 131, 0.5)',
              fontWeight: 600
            }}
          >
            Create Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={error && error.includes('Name')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42b883',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={error && error.includes('email')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42b883',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={error && error.includes('Password')}
              helperText="Password must be at least 6 characters long"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42b883',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={error && error.includes('Passwords do not match')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(66, 184, 131, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42b883',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: '#42b883',
                '&:hover': {
                  bgcolor: '#3aa876',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(66, 184, 131, 0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="#" 
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                sx={{
                  color: '#42b883',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#3aa876',
                    textDecoration: 'underline'
                  }
                }}
              >
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register; 