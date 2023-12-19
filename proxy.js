/*const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/rest",
    createProxyMiddleware({
      target: "https://api.todoist.com",
      changeOrigin: true,
      pathRewrite: {
        "^/rest": "/rest",
      },
    })
  );
}; */
