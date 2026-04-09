import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to test SMTP settings
  app.post("/api/test-email", async (req, res) => {
    const { to } = req.body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ 
        error: "SMTP credentials not found. Please set EMAIL_USER and EMAIL_PASS in the Settings menu." 
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Cadenx Music" <${process.env.EMAIL_USER}>`,
        to: to || process.env.EMAIL_USER,
        subject: "SMTP Test - Cadenx Music",
        text: "Your SMTP settings are working perfectly! You can now send enrollment confirmations and other notifications from the app.",
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000;">SMTP Test Successful</h2>
            <p>Your SMTP settings are working perfectly! You can now send enrollment confirmations and other notifications from the app.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated test message from your Cadenx Music app.</p>
          </div>
        `,
      });
      res.json({ success: true, message: "Test email sent successfully!" });
    } catch (error) {
      console.error("SMTP Error:", error);
      let errorMessage = "Failed to send email. Check your credentials and port settings.";
      
      if (error.code === 'EAUTH' || error.message.includes('535')) {
        errorMessage = "Authentication failed. If using Gmail, you MUST enable '2-Step Verification' in your Google Account and then generate an 'App Password'. Regular passwords are not accepted. Check the Settings menu in AI Studio.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // API to handle enrollment email with PDF attachment
  app.post("/api/enroll", async (req, res) => {
    const { enrollmentData, batchName } = req.body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // We don't want to block the enrollment if email fails, but we should log it
      console.error("SMTP credentials not found. Skipping email.");
      return res.status(200).json({ success: true, warning: "Enrollment saved but email notification skipped due to missing credentials." });
    }

    try {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      
      // Generate PDF Content
      doc.fontSize(25).text('Enrollment Confirmation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(`Course: ${batchName || enrollmentData.course}`);
      doc.text(`Student Name: ${enrollmentData.name}`);
      doc.text(`Email: ${enrollmentData.email}`);
      doc.text(`Phone: ${enrollmentData.phone}`);
      doc.text(`Location: ${enrollmentData.city}, ${enrollmentData.country}`);
      doc.text(`Social Handle: ${enrollmentData.socialHandle}`);
      doc.text(`Experience Level: ${enrollmentData.experience}`);
      doc.moveDown();
      doc.fontSize(12).text('Message from Student:', { underline: true });
      doc.text(enrollmentData.message || 'No message provided.');
      doc.moveDown();
      doc.text(`Enrolled on: ${new Date().toLocaleString()}`);
      
      doc.end();

      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send to Admin
        await transporter.sendMail({
          from: `"Cadenx Academy" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `New Enrollment: ${enrollmentData.name} - ${batchName}`,
          text: `A new student has enrolled in ${batchName}. See attached PDF for details.`,
          attachments: [
            {
              filename: `Enrollment_${enrollmentData.name.replace(/\s+/g, '_')}.pdf`,
              content: pdfBuffer
            }
          ]
        });

        // Send Confirmation to Student
        await transporter.sendMail({
          from: `"Cadenx Academy" <${process.env.EMAIL_USER}>`,
          to: enrollmentData.email,
          subject: `Enrollment Confirmed: ${batchName}`,
          text: `Hi ${enrollmentData.name},\n\nYour enrollment for ${batchName} has been received. We are excited to have you on board!\n\nBest regards,\nCadenx Academy Team`,
        });

        res.json({ success: true, message: "Enrollment processed and emails sent." });
      });
    } catch (error) {
      console.error("Enrollment Email Error:", error);
      let errorMessage = "Failed to process enrollment email.";
      
      if (error.code === 'EAUTH' || error.message.includes('535')) {
        errorMessage = "SMTP Authentication failed. Please check your App Password in Settings.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
