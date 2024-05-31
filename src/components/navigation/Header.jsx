import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          Logo
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li>
              <NavLink to="/" className="nav-link px-2">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="nav-link px-2">
                Foo
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="nav-link px-2">
                Moo
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="nav-link px-2">
                Bar
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="nav-link px-2">
                1) What
              </NavLink>
            </li>
          </ul>

          <form className="d-flex me-2" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          <button type="button" className="btn btn-outline me-2">
            Login
          </button>
          <button type="button" className="btn btn-primary">
            Sign-up
          </button>
        </div>
      </div>
    </nav>
  );
}
