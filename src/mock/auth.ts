import { MockMethod } from "vite-plugin-mock";

export default function mocks(): MockMethod[] {
  console.log("here");
  return [
    {
      url: "/api/login",
      method: "post",
      // Set a cookie in the response headers
      rawResponse: async (req, res) => {
        console.log(req);
        let body = "";

        // Listen for data and accumulate it
        for await (const chunk of req) {
          body += chunk;
        }

        // Parse the JSON body
        const parsedBody = JSON.parse(body);

        const { username, password } = parsedBody;
        if (username === "admin" && password === "password") {
          res.setHeader("Set-Cookie", "jwt=mocked-jwt-token; HttpOnly; Path=/");
          res.end(JSON.stringify({ username: "Admin" }));
        } else {
          res.statusCode = 401; // Set status to 401 Unauthorized
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              message: "Unauthorized: Invalid username or password",
              data: null,
            })
          );
        }
      },
    },
    {
      url: "/api/validate",
      method: "get",
      response: (req) => {
        const jwtCookie = req.headers.cookie
          ?.split("; ")
          .find((c) => c.startsWith("jwt="));
        const token = jwtCookie?.split("=")[1];

        if (token === "mocked-jwt-token") {
          return {
            code: 200,
            message: "Valid token",
          };
        }
        return {
          code: 401,
          message: "Invalid or missing token",
        };
      },
    },
  ];
}
