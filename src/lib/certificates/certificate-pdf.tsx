import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Premium styling for the landscape certificate
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#060919", // Very dark navy/midnight background
    color: "#e2e8f0",
    padding: 30,
    fontFamily: "Helvetica",
  },
  borderContainer: {
    border: "2px solid #b58920", // Gold border outline
    borderRadius: 8,
    flex: 1,
    padding: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  topBorderLine: {
    height: 4,
    backgroundColor: "#d97706", // Amber border bar
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
  },
  bottomBorderLine: {
    height: 4,
    backgroundColor: "#d97706",
    position: "absolute",
    bottom: 0,
    left: 40,
    right: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 15,
  },
  platformName: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 4,
    color: "#38bdf8", // Cool cyan accent
    textTransform: "uppercase",
    marginBottom: 10,
  },
  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "rgba(181, 137, 32, 0.3)",
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 3,
    color: "#fbbf24", // Premium gold color
    textAlign: "center",
    marginTop: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8", // Slate
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
  studentName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 10,
    textDecoration: "underline",
    textDecorationColor: "#fbbf24",
  },
  courseLabel: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 5,
    fontStyle: "italic",
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#818cf8", // Indigo color
    textAlign: "center",
    marginVertical: 5,
  },
  dateText: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    marginTop: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  signatureContainer: {
    alignItems: "center",
    width: 200,
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#475569",
    marginBottom: 6,
  },
  instructorName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  instructorRole: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  sealContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fbbf24",
    borderWidth: 2,
    borderColor: "#fbbf24",
    borderRadius: 50,
    padding: 10,
    width: 60,
    height: 60,
    textAlign: "center",
    lineHeight: 36,
  },
  certInfo: {
    alignItems: "flex-end",
    width: 200,
  },
  certIdLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  certIdValue: {
    fontSize: 9,
    fontFamily: "Courier",
    color: "#fbbf24",
    marginTop: 2,
  },
  footer: {
    textAlign: "center",
    fontSize: 8,
    color: "#475569",
    marginTop: 15,
  },
});

export interface CertificatePDFProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  certificateId: string;
  issuedAt: Date;
  platformName: string;
}

export function CertificatePDF({
  studentName,
  courseName,
  instructorName,
  certificateId,
  issuedAt,
  platformName,
}: CertificatePDFProps) {
  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Safe Fallbacks
  const safeStudentName = studentName || "Valued Student";
  const safeCourseName = courseName || "Advanced Coursework";
  const safeInstructorName = instructorName || "Shrvan Kumar Sagar";
  const safeCertificateId = certificateId || "CERT-PENDING";
  const safePlatformName = platformName || "Sagar Coaching Centre Bhagwanpur";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderContainer}>
          <View style={styles.topBorderLine} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.platformName}>{safePlatformName}</Text>
            <Text style={{ fontSize: 8, color: "#38bdf8", letterSpacing: 2, marginTop: -6 }}>sagarcoachingcentre.com</Text>
            <View style={styles.divider} />
            <Text style={styles.title}>CERTIFICATE OF EXCELLENCE</Text>
            <Text style={styles.subtitle}>Scholarship Exam Preparation</Text>
            <Text style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginVertical: 4 }}>This certifies that</Text>
          </View>

          {/* Body */}
          <View>
            <Text style={styles.studentName}>{safeStudentName}</Text>
            <Text style={styles.courseLabel}>has successfully completed the course</Text>
            <Text style={styles.courseName}>{safeCourseName}</Text>
            <Text style={styles.dateText}>on {formattedDate}</Text>
          </View>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            {/* Signature Left */}
            <View style={styles.signatureContainer}>
              <View style={styles.signatureLine} />
              <Text style={styles.instructorName}>{safeInstructorName}</Text>
              <Text style={styles.instructorRole}>Founder & Head Teacher</Text>
            </View>

            {/* Seal Center */}
            <View style={styles.sealContainer}>
              <Text style={styles.sealText}>SEAL</Text>
            </View>

            {/* ID / Verification Right */}
            <View style={styles.certInfo}>
              <Text style={styles.certIdLabel}>Certificate ID</Text>
              <Text style={styles.certIdValue}>{safeCertificateId}</Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Verify at: sagarcoachingcentre.com/certificates/verify/{safeCertificateId}
          </Text>

          <View style={styles.bottomBorderLine} />
        </View>
      </Page>
    </Document>
  );
}
