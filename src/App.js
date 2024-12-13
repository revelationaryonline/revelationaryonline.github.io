import React, { useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./pages/Profile";
import Account from "./pages/Account";


import { Home } from "./pages/Home";
// import indexjs to home
import { Footer } from './components/Footer/Footer'
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true);



  return (
    <div className="App">
      <Header loggedIn={loggedIn} />
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route index path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile loggedIn={loggedIn} />} />
        <Route path="/account" element={<Account loggedIn={loggedIn} />} />
        <Route path="/blog" element={<Home loggedIn={loggedIn} />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        {/* <Route path="*" element={<NoMatch />} /> */}
        {/* </Route> */}
      </Routes>
      <Footer
        title="revelationary"
        description="A Bible Reading Web Application"
      />
    </div>
  );
}

export function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/blog">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
