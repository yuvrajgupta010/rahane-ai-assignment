import React, { useEffect, useState } from "react";
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

import { useAuthCTX } from "@/store/AuthCTX";
import AdminStat from "./AdminStat";
import { apiInterceptor } from "@/service/axiosClient";
import restfulUrls from "@/service/restfulUrls";
import { utcToHumanReadableDate } from "@/helpers/formatData";
import { useFormik } from "formik";
import { createUserFormValidation } from "@/helpers/validation";
import toast from "react-hot-toast";

const fetchUsers = async (setState) => {
  try {
    const responseData = await apiInterceptor.get(restfulUrls.GET_USERS);

    if (responseData.status === 200) {
      const data = responseData?.data?.data;
      setState(data?.users);
      console.log(data?.users);
    }
  } catch (error) {
    console.error(error?.data?.message);
  }
};

const fetchSystemLogs = async (setState) => {
  try {
    const responseData = await apiInterceptor.get(restfulUrls.GET_SYSTEM_LOGS);

    if (responseData.status === 200) {
      const data = responseData?.data?.data;
      setState(data?.logs);
      console.log(data?.users);
    }
  } catch (error) {
    console.error(error?.data?.message);
  }
};

const AdminDashboard = (props) => {
  const { _logout, userDetails } = useAuthCTX();
  const [activeTab, setActiveTab] = useState("user-management");
  const [users, setUsers] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userForDelete, setUserForDelete] = useState(null);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    validationSchema: createUserFormValidation,
    initialValues: {
      email: "",
      password: "",
      role: "",
      fullName: "",
      mode: null,
    },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      console.log("I am hitting");
      try {
        let response;

        const reqestData = {
          email: values.email,
          ...(values.mode === "create-new" && { password: values.password }),
          role: values.role,
          fullName: values.fullName,
        };

        if (values.mode === "create-new") {
          response = await apiInterceptor.post(
            restfulUrls.ADD_NEW_USER,
            reqestData
          );
        } else if (values.mode === "edit") {
          response = await apiInterceptor.put(
            restfulUrls.EDIT_USER,
            reqestData
          );
        }

        const responseData = response?.data;
        if (values.mode === "create-new" && response.status === 201) {
          const { user } = responseData?.data;
          const cloneUsers = [user, ...users];
          setUsers(cloneUsers);
          toast.success(responseData.message);
        } else if (values.mode === "edit" && response.status === 200) {
          const { user: updatedUser } = responseData?.data;
          const clonedUsers = [...users];
          const updatedUserIndex = clonedUsers.findIndex(
            (user) => user.id == updatedUser.id
          );
          clonedUsers[updatedUserIndex] = updatedUser;
          setUsers(clonedUsers);
          toast.success(responseData.message);
        }
      } catch (error) {
        console.error("Add or Update failed", error?.data?.message);
        toast.error(
          error?.data?.message || "Add or Update failed. Please try again."
        );
      } finally {
        await Promise.all([
          fetchUsers(setUsers),
          fetchSystemLogs(setSystemLogs),
        ]).then(() => {});
        setIsSubmitting(false);
        resetForm();
      }
    },
  });

  useEffect(() => {
    Promise.all([fetchUsers(setUsers), fetchSystemLogs(setSystemLogs)]).then(
      () => {}
    );
  }, []);

  const handleFormModalOpen = (mode, userId) => {
    if (mode === "create-new") {
      setFieldValue("mode", mode);
    } else if (mode === "edit") {
      setFieldValue("mode", mode);
      const userData = users.find((user) => user.id === userId);
      setFieldValue("fullName", userData.fullName);
      setFieldValue("role", userData.role);
      setFieldValue("email", userData.email);
    }
  };

  const handleFormModalClose = () => {
    setFieldValue("mode", null);
    resetForm();
  };

  const handleDeleteModalClose = () => {
    setUserForDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteModalOpen = (userId) => {
    setUserForDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandler = async () => {
    const filteredClone = [
      ...users.filter((user) => user.id !== userForDelete),
    ];
    const userData = users.find((user) => user.id === userForDelete);
    try {
      const responseData = await apiInterceptor.put(
        `${restfulUrls.DELETE_USER}`,
        {
          userId: userForDelete,
        }
      );
      if (responseData.status === 204) {
        toast.success(`${userData?.email} deleted successfully!`);
        setUsers(filteredClone);
      }
    } catch (error) {
      toast.error(error.data.message);
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  return (
    <>
      <main className="p-4">
        <AdminStat totalUsers={users?.length} totalLogs={systemLogs?.length} />

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
                      <Button
                        variant="primary"
                        onClick={handleFormModalOpen.bind(null, "create-new")}
                      >
                        + Add User
                      </Button>
                    </div>
                    {users.length ? (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created on</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => {
                            return (
                              <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                  <Badge bg="info" className="text-capitalize">
                                    {user.role}
                                  </Badge>
                                </td>
                                <td>
                                  {utcToHumanReadableDate(user.createdAt)}
                                </td>
                                <td>
                                  <div className="d-flex gap-3">
                                    <Button
                                      variant="outline-primary"
                                      onClick={handleFormModalOpen.bind(
                                        null,
                                        "edit",
                                        user.id
                                      )}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      onClick={handleDeleteModalOpen.bind(
                                        null,
                                        user.id
                                      )}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-center fs-5 fw-bold">
                        No user yet, create one!
                      </p>
                    )}
                  </>
                ) : null}
                {activeTab === "system-logs" ? (
                  systemLogs?.length ? (
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
                        {systemLogs?.map((log) => {
                          return (
                            <tr key={log.id}>
                              <td>{log.action}</td>
                              <td>
                                {log?.userId?.email === userDetails?.email ? (
                                  "Self"
                                ) : (
                                  <>
                                    <span className="me-2">
                                      {log?.userId?.email}
                                    </span>
                                    <Badge bg="info">{log?.userId?.role}</Badge>
                                  </>
                                )}
                              </td>
                              <td>{log?.details}</td>
                              <td>{utcToHumanReadableDate(log?.createdAt)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-center fs-5 fw-bold">
                      No system logs generated yet!
                    </p>
                  )
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <Modal show={values.mode} onHide={handleFormModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {values.mode === "edit" ? "Edit" : "Add"} user
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Yuvraj Gupta"
                value={values.fullName}
                name="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.fullName && touched.fullName && (
                <p className="text-danger mt-2">{errors.fullName}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.email && touched.email && (
                <p className="text-danger mt-2">{errors.email}</p>
              )}
            </Form.Group>
            {values.mode === "create-new" ? (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password@123"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="password"
                />
                {errors.password && touched.password && (
                  <p className="text-danger mt-2">{errors.password}</p>
                )}
              </Form.Group>
            ) : null}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={values.role}
                name="role"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option>Select the role</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
              {errors.role && touched.role && (
                <p className="text-danger mt-2">{errors.role}</p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFormModalClose}>
            Close
          </Button>
          {!isSubmitting ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {values.mode === "edit" ? "Save Changes" : "Add"}
            </Button>
          ) : (
            <Button>
              {values.mode === "edit" ? "Saving..." : "Adding..."}
            </Button>
          )}
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
          <Button variant="danger" onClick={confirmDeleteHandler}>
            Sure
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
