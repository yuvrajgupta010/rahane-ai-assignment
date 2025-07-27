import * as yup from "yup";

export const loginFormValidation = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .required("Please enter your password"),
});

export const createUserFormValidation = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: yup.string().when("mode", {
    is: "create-new",
    then: (schema) =>
      schema
        .trim()
        .min(8, "Password must be at least 8 characters long")
        .required("Please enter your password"),
    otherwise: (schema) => schema.notRequired().strip(), // strip if not needed
  }),
  role: yup
    .string()
    .trim()
    .required("Please select role")
    .oneOf(["editor", "viewer"], "Role have to select"),
  fullName: yup
    .string()
    .trim()
    .min(2, "Password must be at least 2 characters long")
    .required("Please enter your full name"),
  mode: yup
    .string()
    .trim()
    .required("Plase select mode")
    .oneOf(["edit", "create-new"]),
});

export const createPostFormValidation = yup.object().shape({
  title: yup.string().trim().required("Please title of post"),
  description: yup.string().trim().required("Please description of post"),
});
