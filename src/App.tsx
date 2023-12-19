import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from 'enums';
import { HomePage, PostPage, TodoPage } from 'pages';

export const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.TODO} element={<TodoPage />} />
      <Route path={ROUTES.POST} element={<PostPage />} />
      <Route path='*' element={<Navigate to={ROUTES.HOME} />} />
    </Routes>
  );
};
