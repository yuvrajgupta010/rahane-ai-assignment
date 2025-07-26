const accessControlCenter = {
  // Important
  // "*API method* *space* *API path*": ["admin", "editor", "visitor"]
  "POST /login": [true, true, true],
  "POST /create-account": [true, false, false],
  "GET /all-users": [true, false, false],
  "PUT /edit-user": [true, false, false],
  "DELETE /delete-user": [true, false, false],
  "GET /system-logs": [true, false, false],
};

export default accessControlCenter;
