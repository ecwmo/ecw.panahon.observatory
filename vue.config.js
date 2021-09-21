module.exports = {
  publicPath:
    "PUBLIC_PATH" in process.env ? `/${process.env.PUBLIC_PATH}/` : "/",
};
