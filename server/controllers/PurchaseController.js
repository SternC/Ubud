import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import PDFDocument from 'pdfkit';
import User from "../models/User.js";


function drawLine(doc, y, color = '#aaaaaa') {
    doc.strokeColor(color)
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
}

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
    doc.fontSize(28)
       .fillColor('#333')
       .text('INVOICE', 50, 60); 

    doc.moveDown(0.5);
    doc.fontSize(10)
       .text(`INVOICE # ${id}`, 50, doc.y);
    doc.text(`Date: ${formattedDate}`, 50, doc.y);
    doc.text('Status: Paid', 50, doc.y);

    doc.rect(380, 50, 170, 40).fillAndStroke('#2980b9', '#2980b9');
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
    const col3 = 370; // Quantity
    const col4 = 465; // Total
    const colWidths = {
        harga: 65,
        kuantitas: 40,
        total: 65
    };
    const headerHeight = 20;

    doc.rect(50, tableTop, 500, headerHeight).fill('#2c3e50');
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
    
    doc.rect(summaryX, summaryY + 30, summaryWidth,20).fill('#2980b9');
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
    doc.fillColor('#555')
       .text('Notes: This receipt is valid without a signature. Keep it for your reference.', 50, doc.y);

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
