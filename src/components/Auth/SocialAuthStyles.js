// src/components/Auth/SocialAuthStyles.js
import styled from 'styled-components';

// Social authentication styled components that can be shared between Login and Signup

export const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    gap: 10px;
    margin-bottom: 15px;
  }
`;

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: ${props => props.provider === 'google' ? 'white' : '#1877F2'};
  color: ${props => props.provider === 'google' ? '#333' : 'white'};
  border: ${props => props.provider === 'google' ? '1px solid #DDD' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 0.9rem;
    border-radius: 10px;
  }
`;

export const SocialIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  
  @media (max-width: 576px) {
    width: 18px;
    height: 18px;
  }
`;

export const SocialSpinner = styled.div`
  width: ${props => props.small ? '16px' : '20px'};
  height: ${props => props.small ? '16px' : '20px'};
  border: ${props => props.small ? '2px' : '3px'} solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.provider === 'google' ? '#333' : 'white'};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 576px) {
    width: ${props => props.small ? '14px' : '18px'};
    height: ${props => props.small ? '14px' : '18px'};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  width: 100%;
  
  @media (max-width: 576px) {
    margin-bottom: 15px;
  }
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
`;

export const DividerText = styled.span`
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding: 0 8px;
  }
`;

export const SocialSignupInfo = styled.div`
  background-color: rgba(74, 165, 255, 0.1);
  border-left: 3px solid #4AA5FF;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 8px 8px 0;
  
  p {
    color: white;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  strong {
    color: #4ADEDE;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.7rem;
    margin-bottom: 1rem;
    
    p {
      font-size: 0.85rem;
    }
  }
`;