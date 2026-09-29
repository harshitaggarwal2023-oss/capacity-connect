import { Queue, Worker, Job } from 'bullmq';
import { prisma } from './prisma';
import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const certificateQueue = new Queue('certificate-generation', { connection });

interface CertificateJobData {
  enrollmentId: string;
  userId: string;
  courseName: string;
  userName: string;
}

export const generateCertificate = async (
  enrollmentId: string,
  userId: string,
  courseName: string,
  userName: string
) => {
  return await certificateQueue.add('generate', { enrollmentId, userId, courseName, userName });
};

export const certificateWorker = new Worker('certificate-generation', async (job: Job<CertificateJobData>) => {
  const { enrollmentId, userId, courseName, userName } = job.data;
  
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  const buffers: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FAF9F6");
  doc.lineWidth(4).strokeColor("#1a3d2b").rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
  doc.lineWidth(1).strokeColor("#c9962a").rect(26, 26, doc.page.width - 52, doc.page.height - 52).stroke();

  doc.moveDown(3);
  doc.fillColor("#1a3d2b").fontSize(32).text("CERTIFICATE OF COMPLETION", { align: "center" });
  doc.moveDown(1.5);
  doc.fillColor("#555555").fontSize(16).text("This certifies that", { align: "center" });
  doc.moveDown(0.8);
  doc.fillColor("#1a3d2b").fontSize(26).text(userName, { align: "center" });
  doc.moveDown(0.8);
  doc.fillColor("#555555").fontSize(16).text("has successfully completed all required modules and assessments for", { align: "center" });
  doc.moveDown(0.8);
  doc.fillColor("#2c3e6b").fontSize(22).text(courseName, { align: "center" });
  doc.moveDown(2);
  doc.fillColor("#777777").fontSize(12).text(
    `Issued by CAPACITY CONNECT Platform on ${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`,
    { align: "center" }
  );

  doc.end();

  return new Promise<string>((resolve, reject) => {
    doc.on("end", async () => {
      try {
        const buffer = Buffer.concat(buffers);
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "certificates", resource_type: "raw", format: "pdf", public_id: `cert-${enrollmentId}` },
            async (err, res) => {
              if (err) return reject(err);
              const secureUrl = res?.secure_url || "";
              await prisma.certificate.upsert({
                where: { enrollmentId },
                update: { url: secureUrl },
                create: { enrollmentId, userId, url: secureUrl },
              });
              resolve(secureUrl);
            }
          );
          uploadStream.end(buffer);
        } else {
          const mockUrl = `/certificates/demo-${enrollmentId}.pdf`;
          await prisma.certificate.upsert({
            where: { enrollmentId },
            update: { url: mockUrl },
            create: { enrollmentId, userId, url: mockUrl },
          });
          resolve(mockUrl);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}, { connection });
