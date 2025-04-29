// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import logo from './logo.png';
import loginImage from './login_image.png';
import googleIcon from './google-icon.png'; // Add this image to your assets
import facebookIcon from './facebook-icon.png'; // Add this image to your assets

// Import all the styled components from an existing file
import {
  LoginContainer,
  GlowEffect,
  GlowCircle,
  LogoContainerMobile,
  LeftSection,
  LogoContainerDesktop,
  LoginImageWrapper,
  LoginImage,
  ImageOverlay,
  TagLine,
  RightSection,
  LoginForm,
  LoginHeader,
  LoginSubHeader,
  InputGroup,
  InputLabel,
  InputWrapper,
  StyledInput,
  InputIcon,
  PasswordToggle,
  ForgotPassword,
  LoginButton,
  LoadingSpinner,
  SignupText,
  SignupLink,
  ErrorMessage
} from './LoginStyles';

// Import shared social auth styled components
import {
  SocialLoginContainer,
  SocialButton,
  SocialIcon,
  Divider,
  DividerLine,
  DividerText
} from './SocialAuthStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
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

  const handleSocialLogin = async (provider) => {
    setError('');
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    setSocialLoading(provider);

    try {
      // Select the appropriate provider
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new FacebookAuthProvider();
        
      // Add scopes for additional profile info
      if (provider === 'google') {
        authProvider.addScope('profile');
        authProvider.addScope('email');
      } else {
        authProvider.addScope('email');
        authProvider.addScope('public_profile');
      }

      // Sign in with popup
      const result = await signInWithPopup(auth, authProvider);
      const userInfo = getAdditionalUserInfo(result);
      const user = result.user;

      // Check if this is a new user
      const isNewUser = userInfo.isNewUser;

      if (isNewUser) {
        // Create a user document for new social auth users
        const userData = {
          fullName: user.displayName || '',
          emailPhone: user.email || '',
          provider: providerName,
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), userData);
        
        // Navigate to the second step of signup to collect additional information
        navigate('/signup', { state: { fromSocial: true, provider: providerName } });
      } else {
        // Update last login time for existing users
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          // Check if user has completed profile (has gender field)
          const userData = userDoc.data();
          
          if (!userData.gender) {
            // User signed up with social provider but didn't complete profile
            navigate('/signup', { state: { fromSocial: true, provider: providerName } });
          } else {
            // User has completed profile, navigate to onboarding
            await setDoc(doc(db, "users", user.uid), {
              ...userData,
              lastLogin: new Date()
            }, { merge: true });
            
            navigate('/onboarding');
          }
        } else {
          // Safety fallback - create user document if it doesn't exist
          await setDoc(doc(db, "users", user.uid), {
            fullName: user.displayName || '',
            emailPhone: user.email || '',
            provider: providerName,
            createdAt: new Date(),
            lastLogin: new Date(),
          });
          
          navigate('/signup', { state: { fromSocial: true, provider: providerName } });
        }
      }
    } catch (error) {
      console.error(`${providerName} login error:`, error);
      
      let errorMessage = `Failed to login with ${providerName}.`;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = `${providerName} login was cancelled.`;
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = `An account already exists with the same email. Try another login method.`;
      }
      
      setError(errorMessage);
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <LoginContainer>
      <GlowEffect />
      <GlowCircle top="10%" left="20%" size="300px" delay="0s" />
      <GlowCircle top="50%" left="10%" size="200px" delay="2s" />
      <GlowCircle top="80%" left="30%" size="250px" delay="4s" />
      
      <LogoContainerMobile>
        <img src={logo} alt="Eternal Logo" />
      </LogoContainerMobile>
      
      <LeftSection>
        <LogoContainerDesktop>
          <img src={logo} alt="Eternal Logo" />
        </LogoContainerDesktop>
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
          
          {/* Social login buttons */}
          <SocialLoginContainer>
            <SocialButton 
              type="button" 
              provider="google"
              onClick={() => handleSocialLogin('google')} 
              disabled={socialLoading !== ''}
            >
              {socialLoading === 'google' ? (
                <LoadingSpinner small="true" />
              ) : (
                <SocialIcon src={googleIcon} alt="Google" />
              )}
              Continue with Google
            </SocialButton>
            
            <SocialButton 
              type="button" 
              provider="facebook"
              onClick={() => handleSocialLogin('facebook')} 
              disabled={socialLoading !== ''}
            >
              {socialLoading === 'facebook' ? (
                <LoadingSpinner small="true" />
              ) : (
                <SocialIcon src={facebookIcon} alt="Facebook" />
              )}
              Continue with Facebook
            </SocialButton>
          </SocialLoginContainer>
          
          <Divider>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </Divider>
          
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

export default Login;