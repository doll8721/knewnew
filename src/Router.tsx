import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Nav from './components/Nav/Nav';

// import Home from './pages/Home/Home';
import NewFeed from './pages/NewFeed/NewFeed';
import Search from './pages/Search/Search';
import Users from './pages/Users/Users';
// import Detail from './pages/Detail/Detail';
import NotFound from './pages/NotFound/NotFound';
import ItemList from './pages/ItemList/ItemList';
import SignIn from './pages/SignIn/SignIn';

import Detail from './pages/Detail';
import Comment from './components/Comment';

export function Router() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/feedlist" />} />
        <Route path="/feedlist" element={<ItemList />} />
        <Route path="/newfeed" element={<NewFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="/detail/:id"
          element={
            <>
              <Detail />
              <Comment />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
