import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import PDFDocument from 'pdfkit';



export const downloadReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Purchase.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${transactionId}.pdf"`);

 
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);



    doc
      .fontSize(25)
      .text('INVOICE / BUKTI PEMBELIAN', { align: 'center' });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Transaction ID: ${transaction.id}`, { continued: true })
      .text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, { align: 'right' });

    doc.moveDown();

    doc
      .fontSize(16)
      .text('Detail Produk:', { underline: true });
    
    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Course Title: ${transaction.title}`);

    doc
      .fontSize(12)
      .text(`Price: $${Number(transaction.price).toFixed(2)}`);

    doc.moveDown(2);


    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Terima kasih telah berbelanja.', { align: 'center' });

  
    doc.end();

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF receipt" });
  }
};

export const createPurchase = async (req, res) => {
  console.log("📥 Received purchase request:", req.body);
  try {
    const { userId, courseId } = req.body;

    // Prevent duplicates
    const existing = await Purchase.findOne({ where: { userId, courseId } });
    if (existing) {
      return res.status(400).json({ message: "You already own this course" });
    }

    // Find course by string ID
    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      userId,
      courseId,
      title: course.title,
      price: course.price,
    });

    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Error creating purchase" });
  }
};

export const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    const purchases = await Purchase.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          attributes: ["id", "title", "price"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = purchases.map((p) => ({
      id: p.id,
      courseId: p.courseId,
      title:
        (p.Course && p.Course.title) || 
        p.title ||                      
        "(Unknown Course)",
      price:
        (p.Course && p.Course.price) ||
        p.price ||
        0,
      date: new Date(p.createdAt).toLocaleString(),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(" Error fetching purchases:", error);
    res.status(500).json({ message: "Error fetching purchases" });
  }
};



export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Purchase.findAll({
      where: { userId },
      attributes: ["id", "title", "price", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const formatted = transactions.map((t) => ({
      id: t.id,
      courseTitle: t.title,
      price: t.price,
      date: new Date(t.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Course, attributes: ["id", "title"] },
        { model: (await import("../models/User.js")).default, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(purchases);
  } catch (error) {
    console.error("Error fetching all purchases:", error);
    res.status(500).json({ message: "Error fetching all purchases" });
  }
};


export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    await purchase.destroy();
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ message: "Error deleting purchase" });
  }
};
