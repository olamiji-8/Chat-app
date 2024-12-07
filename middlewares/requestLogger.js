function requestLogger(req, res, next) {
  const { method, url, headers, query, body } = req;

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  
  // Log request headers
  console.log("Headers:", JSON.stringify(headers, null, 2));
  
  // Log query parameters if they exist
  if (Object.keys(query).length > 0) {
    console.log("Query Parameters:", JSON.stringify(query, null, 2));
  }

  // Log request body safely
  if (["POST", "PUT", "PATCH"].includes(method) && Object.keys(body).length > 0) {
    console.log("Body:", JSON.stringify(body, null, 2));
  }

  next();
}

module.exports = requestLogger;
