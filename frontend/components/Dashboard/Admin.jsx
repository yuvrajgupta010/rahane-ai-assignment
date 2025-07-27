import React, { useState } from "react";
import {
  Nav,
  Container,
  Button,
  Badge,
  Row,
  Col,
  Card,
  Table,
  Modal,
  Form,
} from "react-bootstrap";

import style from "./Dashboard.module.css";
import { useAuthCTX } from "@/store/AuthCTX";

const AdminDashboard = (props) => {
  const { _logout, userDetails } = useAuthCTX();
  const [activeTab, setActiveTab] = useState("user-management");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEditModalClose = () => setShowEditModal(false);
  const handleEditModalShow = () => setShowEditModal(true);

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalOpen = () => setShowDeleteModal(true);

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalOpen = () => setShowAddModal(true);

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  return (
    <>
      <main className="p-4">
        <Container>
          <Row className="gap-4">
            <Col>
              <Card className="text-center bg-light" text="">
                <Card.Body>
                  <Card.Title className="fw-bold">22</Card.Title>
                  <Card.Text>Total users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="text-center bg-light">
                <Card.Body>
                  <Card.Title className="fw-bold">22</Card.Title>
                  <Card.Text>Total posts</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="text-center bg-light">
                <Card.Body>
                  <Card.Title className="fw-bold">22</Card.Title>
                  <Card.Text>System Events</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Container className="mt-4 border-2">
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                <Nav.Item>
                  <Nav.Link eventKey="user-management">
                    User Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="system-logs">System Logs</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <div className="mt-1 pt-2">
                {activeTab === "user-management" ? (
                  <>
                    <div className="d-flex justify-content-between text-center w-100">
                      <p className="fw-bold">Users</p>
                      <Button variant="primary" onClick={handleAddModalOpen}>
                        + Add User
                      </Button>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Create on</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Yuvraj</td>
                          <td>Yuvraj@gmail.com</td>
                          <td>
                            <Badge bg="info">Editior</Badge>
                          </td>
                          <td>12-07-2025</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                onClick={handleEditModalShow}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={handleDeleteModalOpen}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                ) : null}
                {activeTab === "system-logs" ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Action By</th>
                        <th>Detail of Action</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Yuvraj</td>
                        <td>Yuvraj@gmail.com</td>
                        <td>Editior</td>
                        <td>12-07-2025</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control type="text" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (default: Password@123)</Form.Label>
              <Form.Control type="password" placeholder="Password@123" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Select the role</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditModalClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={handleAddModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control type="text" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Password (default: Password@123)</Form.Label>
              <Form.Control type="password" placeholder="Password@123" />
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Select the role</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddModalClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are deleting the user. This action is irreversible. Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteModalClose}>
            Sure
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
