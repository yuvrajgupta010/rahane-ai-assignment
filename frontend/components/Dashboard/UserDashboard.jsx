import { utcToHumanReadableDate } from "@/helpers/formatData";
import {
  createPostFormValidation,
  createUserFormValidation,
} from "@/helpers/validation";
import { apiInterceptor } from "@/service/axiosClient";
import restfulUrls from "@/service/restfulUrls";
import { useAuthCTX } from "@/store/AuthCTX";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const fetchPosts = async (setState) => {
  try {
    const response = await apiInterceptor.get(restfulUrls.GET_POSTS);

    const responseData = response?.data;
    if (response.status === 200) {
      // console.log(responseData?.data?.posts);
      setState(responseData?.data?.posts);
    }
  } catch (error) {
    console.error(error, "Unable to fetch data");
    toast.error(error?.data?.message ?? "Unable to fetch data");
  }
};

const UserDashboard = (props) => {
  const { userDetails } = useAuthCTX();
  const [posts, setPosts] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postForDelete, setPostForDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    validationSchema: createPostFormValidation,
    initialValues: {
      postId: null,
      title: "",
      description: "",
      mode: null,
    },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      // console.log("I am hitting");
      try {
        let response;

        if (values.mode === "create-new") {
          response = await apiInterceptor.post(restfulUrls.GET_POSTS, {
            title: values.title,
            description: values.description,
          });
        } else if (values.mode === "edit") {
          response = await apiInterceptor.put(restfulUrls.GET_POSTS, {
            title: values.title,
            description: values.description,
            postId: values.postId,
          });
        }

        const responseData = response?.data;
        if (values.mode === "create-new" && response.status === 201) {
          const { post } = responseData?.data;
          post.createdBy = { email: userDetails.email };
          const clonePosts = [post, ...posts];
          setPosts(clonePosts);
          toast.success(responseData.message);
        } else if (values.mode === "edit" && response.status === 200) {
          const { post: updatedPost } = responseData?.data;
          const clonePosts = [...posts];
          const updatedPostIndex = clonePosts.findIndex(
            (post) => post.id == updatedPost.id
          );
          // console.log(updatedPostIndex, "update post index");
          clonePosts[updatedPostIndex] = updatedPost;

          setPosts(clonePosts);
          toast.success(responseData.message);
        }
      } catch (error) {
        console.error("Add or Update failed", error?.data?.message);
        toast.error(
          error?.data?.message || "Add or Update failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
        resetForm();
      }
    },
  });

  useEffect(() => {
    fetchPosts(setPosts);
  }, []);

  const handleFormModalOpen = (mode, postId) => {
    if (mode === "create-new") {
      setFieldValue("mode", mode);
    } else if (mode === "edit") {
      setFieldValue("mode", mode);
      const postData = posts.find((post) => post.id === postId);
      setFieldValue("postId", postData.id);
      setFieldValue("title", postData.title);
      setFieldValue("description", postData.description);
    }
  };

  const confirmDeleteHandler = async () => {
    const filteredClone = [
      ...posts.filter((post) => post.id !== postForDelete),
    ];
    const postData = posts.find((post) => post.id === postForDelete);
    try {
      const responseData = await apiInterceptor.put(
        `${restfulUrls.DELETE_POST}`,
        {
          postId: postForDelete,
        }
      );
      if (responseData.status === 204) {
        toast.success(`${postData?.title} deleted successfully!`);
        setPosts(filteredClone);
      }
    } catch (error) {
      toast.error(error.data.message);
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleFormModalClose = () => {
    setFieldValue("mode", null);
    resetForm();
  };

  const handleDeleteModalClose = () => {
    setPostForDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteModalOpen = (userId) => {
    setPostForDelete(userId);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between mb-3 align-content-center align-items-center">
          <h5>Posts</h5>
          {userDetails.role !== "viewer" ? (
            <Button
              variant="primary"
              onClick={handleFormModalOpen.bind(null, "create-new")}
            >
              Write a Post
            </Button>
          ) : null}
        </div>
        {!posts?.length ? (
          <h3 className="text-center">No post available yet</h3>
        ) : null}
        <div className="d-flex flex-column gap-2">
          {posts.map((post) => {
            return (
              <Card key={post.id}>
                <Card.Header className="d-flex justify-content-between">
                  <p className="m-0 d-flex gap-2">
                    <span className="fw-bold">Created by:</span>
                    <span>
                      {post?.createdBy?.email === userDetails?.email
                        ? "Self"
                        : post?.createdBy?.email}
                    </span>
                  </p>
                  <p className="m-0 d-flex gap-2">
                    <span className="fw-bold">Created at:</span>
                    <span>{utcToHumanReadableDate(post?.createdAt)}</span>
                  </p>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-content-center align-items-center">
                    <p className="m-0">{post?.title}</p>
                    {userDetails.role !== "viewer" &&
                    post?.createdBy?.email === userDetails?.email ? (
                      <div className="d-flex gap-3 text-primary">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={handleFormModalOpen.bind(
                            null,
                            "edit",
                            post.id
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fill-rule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>
                        </span>
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={handleDeleteModalOpen.bind(null, post.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </span>
                      </div>
                    ) : null}
                  </Card.Title>
                  <Card.Text>{post?.description}</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>
      <Modal show={values.mode} onHide={handleFormModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {values.mode === "edit" ? "Edit" : "Add"} post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Office event"
                value={values.title}
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.title && touched.title && (
                <p className="text-danger mt-2">{errors.title}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Annual summit on 12-08-2025, everybody is invited!"
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.description && touched.description && (
                <p className="text-danger mt-2">{errors.description}</p>
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
            <Button disabled={isSubmitting}>
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
          You are deleting the post. This action is irreversible. Are you sure?
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

export default UserDashboard;
