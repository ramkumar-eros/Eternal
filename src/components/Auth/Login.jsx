// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import logo from './logo.png';
import loginImage from './login_image.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/onboarding'); // Navigate to onboarding page after login
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <GlowEffect />
      <GlowCircle top="10%" left="20%" size="300px" delay="0s" />
      <GlowCircle top="50%" left="10%" size="200px" delay="2s" />
      <GlowCircle top="80%" left="30%" size="250px" delay="4s" />
      
      <LeftSection>
        <LogoContainer>
          <img src={logo} alt="Eternal Logo" />
        </LogoContainer>
        <LoginImageWrapper>
          <LoginImage src={loginImage} alt="Spiritual journey" />
          <ImageOverlay>
            <TagLine>Discover Your Inner Light</TagLine>
          </ImageOverlay>
        </LoginImageWrapper>
      </LeftSection>
      
      <RightSection>
        <LoginForm onSubmit={handleLogin}>
          <LoginHeader>Welcome Back</LoginHeader>
          <LoginSubHeader>Begin Your Cosmic Journey</LoginSubHeader>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <InputGroup>
            <InputLabel>Email</InputLabel>
            <InputWrapper>
              <StyledInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </InputIcon>
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <InputLabel>Password</InputLabel>
            <InputWrapper>
              <StyledInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggle 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </PasswordToggle>
            </InputWrapper>
          </InputGroup>
          
          <ForgotPassword>Forgot Password?</ForgotPassword>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                Connecting...
              </>
            ) : (
              <>
                Begin Journey
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </>
            )}
          </LoginButton>
          
          <SignupText>
            Don't have an account? <SignupLink to="/signup">Create one</SignupLink>
          </SignupText>
        </LoginForm>
      </RightSection>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #050b14;
  overflow: hidden;
  position: relative;
`;

const GlowEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(19, 85, 124, 0.1) 0%, rgba(19, 85, 124, 0) 70%);
  z-index: 0;
`;

const GlowCircle = styled.div`
  position: absolute;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  border-radius: 50%;
  top: ${props => props.top || '0'};
  left: ${props => props.left || '0'};
  background: radial-gradient(circle, rgba(10, 210, 199, 0.1) 0%, rgba(10, 210, 199, 0) 70%);
  filter: blur(30px);
  opacity: 0.6;
  z-index: 0;
  animation: pulse 8s infinite ${props => props.delay || '0s'};

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }
`;

const LeftSection = styled.div`
  flex: 1.2;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  img {
    height: 40px;
    width: auto;
  }
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
`;

const LoginImageWrapper = styled.div`
  position: relative;
  width: 80%;
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const LoginImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 20px;
  transform: scale(1.02);
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TagLine = styled.h2`
  color: white;
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const RightSection = styled.div`
  flex: 0.8;
  background: linear-gradient(135deg, rgba(26, 51, 42, 0.8) 0%, rgba(22, 70, 96, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-radius: 40px 0 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
`;

const LoginForm = styled.form`
  width: 85%;
  max-width: 400px;
  padding: 3rem 2rem;
`;

const LoginHeader = styled.h2`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  background: linear-gradient(90deg, #FFFFFF, #4ADEDE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const LoginSubHeader = styled.p`
  color: #a9d8ff;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  font-weight: 300;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  color: #d1e9ff;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4ADEDE;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.8rem;
  border-radius: 12px;
  border: 1px solid rgba(74, 222, 222, 0.2);
  background-color: rgba(14, 26, 47, 0.5);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4AA5FF;
    box-shadow: 0 0 0 2px rgba(74, 165, 255, 0.2);
  }
  
  &::placeholder {
    color: #6d90b9;
  }
`;

const PasswordToggle = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #4ADEDE;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  color: #a9d8ff;
  font-size: 0.85rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4ADEDE;
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #4AA5FF, #4ADEDE);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(90deg, #3994f0, #3bc9c9);
    box-shadow: 0 5px 15px rgba(74, 165, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% {
      left: -50%;
      top: -50%;
    }
    100% {
      left: 150%;
      top: 150%;
    }
  }
  
  &:disabled {
    background: #2a3f57;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &:before {
      display: none;
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SignupText = styled.div`
  text-align: center;
  color: #a9d8ff;
  font-size: 0.9rem;
`;

const SignupLink = styled(Link)`
  color: #4ADEDE;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
`;

export default Login;