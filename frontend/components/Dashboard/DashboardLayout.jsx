import React from "react";
import { Badge, Button, Container, Nav } from "react-bootstrap";

import { useAuthCTX } from "@/store/AuthCTX";
import style from "./Dashboard.module.css";

const DashboardLayout = (props) => {
  const { userDetails, _logout } = useAuthCTX();

  return (
    <Container className={style["main"] + " " + "p-0"}>
      <header className="d-flex justify-content-between p-3 align-content-center align-items-center bg-info-subtle">
        <div className="logo d-flex align-items-center">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            width={45}
            height={60}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="ms-3 fs-5">RBAC Dashboard</span>
        </div>
        <Nav className="me-4">
          <Nav.Item>
            <Button variant="dark" onClick={_logout}>
              Logout
            </Button>
          </Nav.Item>
        </Nav>
      </header>
      <div className="p-4">
        <h4 className="fw-bold">Welcome back, {userDetails?.fullName}</h4>
        <p className="fs-6">
          You are logged in as:{" "}
          <Badge bg="info" className="text-capitalize">
            {userDetails?.role}
          </Badge>
        </p>
      </div>
      {props.children}
    </Container>
  );
};

export default DashboardLayout;
