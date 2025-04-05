import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

export default function useAuth({userType}) {
  const navigate = useNavigate();
   const cookie = Cookie.get(userType)
  useEffect(() => {
    if (!cookie) {
      // If userType is not present, redirect to the login page based on userType
      navigate(`/${userType}/login`);
    } else {

      switch (userType) {
        case 'admin':
          navigate("/admin");
          break;
        case 'club':
          navigate("/club");
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
