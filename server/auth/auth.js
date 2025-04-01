const jwt = require('jsonwebtoken');

// Generate access and refresh tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Refresh token endpoint
const refreshTokenHandler = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const tokens = generateTokens(user);
    res.json(tokens);
  });
};

module.exports = { generateTokens, refreshTokenHandler };
