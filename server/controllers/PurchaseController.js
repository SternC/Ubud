import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import PDFDocument from 'pdfkit';
import User from "../models/User.js";
import path from "path";
import fs from "fs";


function drawLine(doc, y, color = '#aaaaaa') {
    doc.strokeColor(color)
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
}

function renderReceiptPage(doc, tx, userData, logoPath) {
  const { id, title, price, createdAt } = tx;

  const numericPrice = Number(price);
  const formattedPrice = numericPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const recipientName = userData?.name ?? "Nama Pelanggan";
  const recipientEmail = userData?.email ?? "Email Pelanggan";

  // HEADER
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 15, { width: 40 });
    doc.fontSize(28).fillColor("#333").text("INVOICE", 100, 25);
  }

  doc.moveDown(0.5);
  doc.fontSize(10).text(`INVOICE # ${id}`, 50, doc.y);
  doc.text(`Date: ${formattedDate}`, 50, doc.y);
  doc.text("Status: Paid", 50, doc.y);

  doc.rect(380, 50, 170, 40).fillAndStroke("#1f4c7b", "#1f4c7b");
  doc.fillColor("#ffffff")
    .fontSize(10)
    .text("TOTAL PAID", 390, 55, { width: 150, align: "right" });

  doc.fontSize(16).text(formattedPrice, 390, 70, {
    width: 150,
    align: "right",
  });

  doc.fillColor("#000000");
  doc.moveDown(4);

  // CUSTOMER INFO
  const detailY = doc.y;
  doc.fontSize(12).fillColor("#333").text("TO:", 50, detailY);
  doc.fontSize(10).fillColor("#555").text(recipientName, 50, detailY + 15);
  doc.text(`Email: ${recipientEmail}`, 50, detailY + 30);

  doc.moveDown(4);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ccc");
  doc.moveDown(1);

  // TABLE HEADER
  const tableTop = doc.y;
  doc.rect(50, tableTop, 500, 20).fill("#0b2a45");
  doc.fillColor("#ffffff")
    .fontSize(9)
    .text("Details", 55, tableTop + 6)
    .text("Price", 275, tableTop + 6, { width: 65, align: "right" })
    .text("Quantity", 370, tableTop + 6, { width: 40, align: "right" })
    .text("Total", 465, tableTop + 6, { width: 65, align: "right" });

  // TABLE ROW
  const rowTop = tableTop + 20;
  doc.rect(50, rowTop, 500, 20).fill("#f9f9f9");
  doc.fillColor("#000000")
    .text(title, 55, rowTop + 5)
    .text(formattedPrice, 275, rowTop + 5, { width: 65, align: "right" })
    .text("1", 370, rowTop + 5, { width: 40, align: "right" })
    .text(formattedPrice, 465, rowTop + 5, { width: 65, align: "right" });

  doc.moveDown(3);

  // SUMMARY
  const summaryY = doc.y;
  const summaryX = 400;
  const summaryWidth = 150;

  doc.fontSize(10).fillColor("#555");
  doc.text("Sub Total:", summaryX, summaryY, { continued: true })
    .text(formattedPrice, summaryX - 15, summaryY, {
      width: summaryWidth,
      align: "right",
    });

  doc.text("Tax (0%):", summaryX, summaryY + 15, { continued: true })
    .text("$ 0", summaryX - 15, summaryY + 15, {
      width: summaryWidth,
      align: "right",
    });

  doc.rect(summaryX, summaryY + 30, summaryWidth, 20).fill("#1f4c7b");
  doc.fillColor("#ffffff")
    .fontSize(12)
    .text("TOTAL:", summaryX, summaryY + 35, { continued: true })
    .text(formattedPrice, summaryX - 15, summaryY + 35, {
      width: summaryWidth,
      align: "right",
    });

  doc.moveDown(3);

  // FOOTER
  doc.fillColor("#000")
    .fontSize(10)
    .text("THANK YOU", 450, doc.y, { align: "right" });
}

export const downloadAllReceipts = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Purchase.findAll({
      where: { userId },
      include: [{ model: User, attributes: ["name", "email"] }],
      order: [["createdAt", "ASC"]],
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found." });
    }

    const doc = new PDFDocument({ margin: 50, autoFirstPage: false });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="all-receipts-${userId}.pdf"`
    );

    doc.pipe(res);

    const logoPath = path.resolve("../client/public/logo.png");

    transactions.forEach((tx, index) => {
      doc.addPage();
      renderReceiptPage(doc, tx, tx.User, logoPath);
    });

    doc.end();
  } catch (error) {
    console.error("Bulk PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate bulk PDF" });
  }
};


export const downloadReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Purchase.findByPk(transactionId, {
        include: [{ 
            model: User, 
            attributes: ['name', 'email'], 
        }] 
    });
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

  
    const { id, title, price, createdAt, User: userData } = transaction;
    const numericPrice = Number(price);
    const formattedPrice = numericPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    
    const recipientName = userData ? userData.name : "Nama Pelanggan"; 
    const recipientEmail = userData ? userData.email : "Email Pelanggan"; 

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${id}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });

    doc.on('error', (err) => {
        console.error('PDF Document Error - Stream Failed:', err);
        if (!res.headersSent) {
             res.status(500).send('Error generating PDF content.');
        } else {
             res.end();
        }
    });

    doc.pipe(res);

    //HEADER
    const logoPath = path.resolve("../client/public/logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 15, { width: 40 });
      doc.fontSize(28)
        .fillColor("#333")
        .text("INVOICE", 100, 25);
    }

    doc.moveDown(0.5);
    doc.fontSize(10)
       .text(`INVOICE # ${id}`, 50, doc.y);
    doc.text(`Date: ${formattedDate}`, 50, doc.y);
    doc.text('Status: Paid', 50, doc.y);

    doc.rect(380, 50, 170, 40).fillAndStroke('#1f4c7b', '#1f4c7b');
    doc.fillColor('#ffffff')
       .fontSize(10)
       .text('TOTAL PAID', 390, 55, { width: 150, align: 'right' });
    doc.fontSize(16)
       .text(formattedPrice, 390, 70, { width: 150, align: 'right' });

    doc.fillColor('#000000'); 
    doc.moveDown(4);


    //Information
    const detailY = doc.y;

    doc.fontSize(12).fillColor('#333').text('TO:', 50, detailY);
    doc.fontSize(10).fillColor('#555').text(recipientName, 50, detailY + 15);
    doc.text(`Email: ${recipientEmail}`, 50, detailY + 30); 

    doc.moveDown(4);
    drawLine(doc, doc.y, '#cccccc'); 
    doc.moveDown(1);


    //Product Detail
    const tableTop = doc.y;
    const col1 = 50;  // Details
    const col2 = 275; // Price
    const col3 = 370; 
    const col4 = 465; 
    const colWidths = {
        harga: 65,
        kuantitas: 40,
        total: 65
    };
    const headerHeight = 20;

    doc.rect(50, tableTop, 500, headerHeight).fill('#0b2a45');
    doc.fillColor('#ffffff')
       .fontSize(9)
       .text('Details', col1 + 5, tableTop + 6)
       .text('Price', col2, tableTop + 6, { width: colWidths.harga, align: 'right' })
       .text('Quantity', col3, tableTop + 6, { width: colWidths.kuantitas, align: 'right' })
       .text('Total', col4, tableTop + 6, { width: colWidths.total, align: 'right' });
    
  
    const contentTop = tableTop + headerHeight;
    const rowHeight = 20;
    
    doc.rect(50, contentTop, 500, rowHeight).fill('#f9f9f9');
    doc.fillColor('#000000')
       .fontSize(9)
       .text(title, col1 + 5, contentTop + 5) 
       .text(formattedPrice, col2, contentTop + 5, { width: colWidths.harga, align: 'right' }) 
       .text('1', col3, contentTop + 5, { width: colWidths.kuantitas, align: 'right' })
       .text(formattedPrice, col4, contentTop + 5, { width: colWidths.total, align: 'right' }); 

    doc.moveDown(3);


    //Summary
    const summaryY = doc.y;
    const summaryX = 400;
    const summaryWidth = 150;

    doc.fontSize(10).fillColor('#555');
    
    doc.text('Sub Total:', summaryX, summaryY, { continued: true })
       .text(formattedPrice, summaryX - 15, summaryY, { width: summaryWidth, align: 'right' });

    doc.text('Tax (0%):', summaryX, summaryY + 15, { continued: true })
       .text('$ 0', summaryX - 15, summaryY + 15, { width: summaryWidth, align: 'right' });
    
    doc.rect(summaryX, summaryY + 30, summaryWidth,20).fill('#1f4c7b');
    doc.fillColor('#ffffff')
       .fontSize(12)
       .text('TOTAL:', summaryX, summaryY + 35, { continued: true })
       .text(formattedPrice, summaryX - 15, summaryY + 35, { width: summaryWidth, align: 'right' });

    
    doc.moveDown(3);

    // Notes
    doc.fillColor('#000')
       .fontSize(10)
       .text('THANK YOU', 450, doc.y, { align: 'right' });
    
    doc.moveDown(2);
   

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

    const existing = await Purchase.findOne({ where: { userId, courseId } });
    if (existing) {
      return res.status(400).json({ message: "You already own this course" });
    }
    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
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

export const downloadPurchaseReport = async (req, res) => {
  try {
    // Fetch all purchase data
    const purchases = await Purchase.findAll({
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Course, attributes: ["title", "price"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!purchases.length) {
      return res.status(404).json({ message: "No purchases found." });
    }

    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=purchase-report.pdf"
    );

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    // 🧾 HEADER
    const logoPath = path.resolve("../client/public/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 70 });
    }

    doc
      .fontSize(22)
      .fillColor("#1A1A1A")
      .text("Purchase Report", 50, 55, { align: "center" });
    doc
      .fontSize(10)
      .fillColor("#777")
      .text(`Generated on: ${new Date().toLocaleString()}`, 50, 85, {align:"center"});

    doc.moveDown(2);
    doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();
    doc.moveDown(1.5);

    // 🧍 TABLE HEADER
    const tableTop = 130;
    const columnWidths = { id: 40, user: 120, email: 140, course: 130, price: 60, date: 80 };
    const headerHeight = 25;

    doc
      .rect(50, tableTop, 500, headerHeight)
      .fill("#2C3E50")
      .fillColor("#FFFFFF")
      .fontSize(10)
      .text("ID", 55, tableTop + 8)
      .text("User", 95, tableTop + 8)
      .text("Email", 200, tableTop + 8)
      .text("Course", 340, tableTop + 8)
      .text("Price", 470, tableTop + 8, { width: 50, align: "right" });

    // 🧾 TABLE BODY
    let y = tableTop + headerHeight;
    let totalRevenue = 0;

    purchases.forEach((purchase, index) => {
      const isEven = index % 2 === 0;
      const fillColor = isEven ? "#F9F9F9" : "#FFFFFF";

      doc
        .rect(50, y, 500, 25)
        .fill(fillColor)
        .fillColor("#000000")
        .fontSize(9)
        .text(purchase.id.toString(), 55, y + 8)
        .text(purchase.User?.name || "N/A", 95, y + 8)
        .text(purchase.User?.email || "N/A", 200, y + 8)
        .text(purchase.Course?.title || purchase.title, 340, y + 8)
        .text(`$${purchase.price.toFixed(2)}`, 470, y + 8, {
          width: 50,
          align: "right",
        });

      y += 25;
      totalRevenue += purchase.price;

      if (y > 720) {
        doc.addPage();
        y = 50;
      }
    });

   
    doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor("#cccccc").stroke();
    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor("#2C3E50")
      .text("Summary", 50, y + 25)
      .moveDown(0.5)
      .fontSize(10)
      .fillColor("#555")
      .text(`Total Purchases: ${purchases.length}`, 50, doc.y)
      .text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 50, doc.y + 15);

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#999")
      .text(
        "This report is restricted for internal use only.",
        50,
        doc.y,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("❌ Error generating purchase report:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error generating purchase report" });
    }
  }
};

export const getCoachTransactions = async (req, res) => {
  try {
    const { profileId, is_coach } = req.user;

    if (!is_coach) {
      return res.status(403).json({ message: "Only coaches can access this data" });
    }

    const purchases = await Purchase.findAll({
      include: [
        {
          model: Course,
          where: { coachId: profileId },
          attributes: ["id", "title", "price"],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = purchases.map((p) => ({
      id: p.id,
      studentName: p.User?.name || "Unknown",
      studentEmail: p.User?.email || "Unknown",
      courseTitle: p.Course?.title || "Unknown",
      price: p.Course?.price || 0,
      date: new Date(p.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching coach transactions:", error);
    res.status(500).json({ message: "Error fetching coach transactions" });
  }
};