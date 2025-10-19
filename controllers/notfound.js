const notfound = (req, res, next) => {
  res.status(404).json({ code: 404, status: false, messsage: "Api not found" });
};

module.exports = notfound;
