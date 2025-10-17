import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import PDFDocument from 'pdfkit';



export const downloadReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // 1. Ambil data transaksi
    const transaction = await Purchase.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 2. Persiapkan response headers untuk file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${transactionId}.pdf"`);

    // 3. Buat dokumen PDF menggunakan pdfkit
    const doc = new PDFDocument({ margin: 50 });

    // Pipa (pipe) dokumen PDF langsung ke response stream
    doc.pipe(res);

    // --- Isi Konten PDF ---

    doc
      .fontSize(25)
      .text('INVOICE / BUKTI PEMBELIAN', { align: 'center' });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Transaction ID: ${transaction.id}`, { continued: true })
      .text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, { align: 'right' });

    doc.moveDown();

    // Detail Produk
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

    // Footer
    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Terima kasih telah berbelanja.', { align: 'center' });

    // --- Akhiri dokumen dan kirim ke browser ---
    doc.end();

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF receipt" });
  }
};
// POST /api/purchase → Buy a course
export const createPurchase = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check for duplicates
    const existing = await Purchase.findOne({ where: { userId, courseId } });
    if (existing) {
      return res.status(400).json({ message: "You already own this course" });
    }

    // Get course info
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Create purchase with title and price
    const purchase = await Purchase.create({
      userId,
      courseId,
      title: course.title,
      price: course.price,
    });

    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating purchase" });
  }
};

// GET /api/purchases/:userId → Get all purchased courses
export const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    const purchases = await Purchase.findAll({
      where: { userId },
      attributes: ["id", "courseId", "title", "price", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const formatted = purchases.map((p) => ({
      id: p.id,
      courseId: p.courseId,
      title: p.title,
      price: p.price,
      date: new Date(p.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching purchases" });
  }
};

// GET /api/transactions/:userId → Get formatted transactions
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
