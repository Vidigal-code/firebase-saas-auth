import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './shared/config/firebase';
import { useAppDispatch } from './shared/hooks/redux';
import { setUser, setInitialized } from './entities/user/model/userSlice';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(setUser(null));
      }
      dispatch(setInitialized(true));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
