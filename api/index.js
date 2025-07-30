// Vercel Serverless Function Entry Point
// This redirects to your main backend API or you can deploy backend separately

module.exports = (req, res) => {
  res.status(200).json({
    message: "Tampa Blades API",
    note: "Deploy your backend separately or use this as a proxy",
    frontend: "Frontend deployed on Vercel",
    backend: "Backend should be deployed separately (Railway, Render, etc.)",
  });
};
