import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) return res.status(401).send("you are not authencticated");
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(402).send("Token in not valid!");
    req.userId = payload.id;
    next();
  });
};
