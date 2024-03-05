import { useAuth0 } from '@auth0/auth0-react'
import { useCreateMyUser } from '../api/MyUserApi';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
    const {user} = useAuth0();
    const {createUser} = useCreateMyUser();
    const hasCreated = useRef(false);
    const navigate = useNavigate();
    useEffect(()=>{
        if(user?.sub && user?.email && !hasCreated.current){
            createUser({auth0Id: user.sub, email: user.email});
            hasCreated.current = true
          }
          navigate("/");
    },[createUser, navigate ,user]);
  return (
    <div>Loading ....</div>
  )
}
