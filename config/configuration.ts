export default () => ({
  mongodb_uri: process.env.MONGODB_URI,
  port: process.env.PORT,
  host: process.env.HOST,
  node_env: process.env.NODE_ENV,
  jwt_secret: process.env.SECRET,
});
