const accessControlCenter = {
  // Important
  // "*API method* *space* *API path*": ["admin", "editor", "viewer"]

  // /auth
  "POST /auth/login": [true, true, true],

  // /user
  "POST /user/create-account": [true, false, false],
  "GET /user/all-users": [true, false, false],
  "PUT /user/edit-user": [true, false, false],
  "PUT /user/delete-user": [true, false, false],

  // /data
  "GET /data/system-logs": [true, false, false],
  "GET /data/dashboard-stat": [true, false, false],
};

export default accessControlCenter;
