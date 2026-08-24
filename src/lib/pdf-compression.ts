import { PDFDocument } from "pdf-lib";

export interface PdfCompressionOptions {
  useObjectStreams?: boolean;
}

/**
 * Optimize and compress a PDF file in the browser or Node.js runtime.
 * Groups objects into compressed streams using PDF 1.5 object streams to reduce file size.
 */
export async function compressPdfFile(
  file: File,
  options: PdfCompressionOptions = {}
): Promise<File> {
  const { useObjectStreams = true } = options;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    // Save with object streams compression enabled
    const compressedBytes = await pdfDoc.save({
      useObjectStreams,
      addDefaultPage: false,
    });

    // If compressed size is smaller, return the optimized file; otherwise keep original
    if (compressedBytes.byteLength < file.size) {
      return new File([compressedBytes as unknown as BlobPart], file.name, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
    }

    return file;
  } catch (error) {
    console.warn("PDF compression fallback to original:", error);
    return file;
  }
}

/**
 * Optimize a PDF buffer on the server.
 */
export async function compressPdfBuffer(
  buffer: Buffer,
  options: PdfCompressionOptions = {}
): Promise<Buffer> {
  const { useObjectStreams = true } = options;

  try {
    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const compressedBytes = await pdfDoc.save({
      useObjectStreams,
      addDefaultPage: false,
    });

    if (compressedBytes.byteLength < buffer.length) {
      return Buffer.from(compressedBytes);
    }

    return buffer;
  } catch (error) {
    console.warn("PDF buffer compression fallback to original:", error);
    return buffer;
  }
}
