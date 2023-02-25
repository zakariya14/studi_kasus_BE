const invoiceModel = require("./invoiceModel");
const { policyFor } = require("../../utils/index");
const { subject } = require("@casl/ability");

const show = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", { ...invoice, user_id: invoice.user._id });
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk melihat invoice ini",
      });
    }

    let { order_id } = req.params;
    let invoice = await invoiceModel.findOne({ order: order_id }).populate("order").populate("user");
    return res.json(invoice);
  } catch (error) {
    return res.json({ error: 1, message: "Error When getting invoice" });
  }
};

module.exports = { show };
