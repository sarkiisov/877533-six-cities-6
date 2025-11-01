import { ProtectedRoutes } from '../components/ProtectedRoutes';
import { Main } from '../pages/Main/Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFound } from '../pages/NotFound';
import { Login } from '../pages/Login';
import { Favorites } from '../pages/Favorites';
import { Offer } from '../pages/Offer';

import { offers } from '../mocks/offers';

export const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes isAuthenticated />}>
        <Route path="/favorites" element={<Favorites offers={offers} />} />
      </Route>
      <Route path="/offer/:id" element={<Offer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
