import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

export default function useAuth({userType}) {
  const navigate = useNavigate();
  console.log(userType)
   const cookie = Cookie.get(userType)
   console.log(userType , cookie)
  useEffect(() => {
    if (!cookie) {
      // If userType is not present, redirect to the login page based on userType
      if (userType === 'user') {
        alert('You must Login to continue');
        navigate('/');
        return
      }
      navigate(`/${userType}/login`);
    } else {

      switch (userType) {
        case 'admin':
          navigate("/admin");
          break;
        case 'club':
          navigate(`/club/dashboard/${cookie}`);
          break;
        case 'user':
          navigate("/events");
          break;
        default:
          break;
      }
    }
  }, [navigate]);
}
