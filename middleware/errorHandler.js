const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      error: `${err.details[0].message}`,
    });
  }
  console.log("errorstack", err.stack);
  res.status(500).json({
    error: "något gick fel på servern",
  });
};
export default errorHandler;
