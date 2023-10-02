
exports.testFunction = async (req, res) => {
  try {
    res.status(200).json({
      success:true,
      message:"Server is working properly."
    })

  } catch (error) {
    res.status(502).json({
      success: false,
      message: error.message
    })

  }
}