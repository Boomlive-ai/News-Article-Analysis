
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const ArticleReliabilityReport = ({ summary, reliabilityAssessment }) => {
  const [showReport, setShowReport] = useState(false);

  // Function to handle PDF download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Article Reliability Report', 10, 10);
    doc.setFontSize(12);
    
    // Add formatted reliability assessment here
    doc.text('Reliability Assessment:', 10, 20);
    formatPDFContent(doc, reliabilityAssessment);

    doc.save('reliability_report.pdf');
  };

  // Function to format the reliability assessment content for the PDF
  const formatPDFContent = (doc, assessment) => {
    const lines = assessment.split('\n');
    let y = 30; // Initial Y position for text

    lines.forEach((line) => {
      let formattedLine = line.trim();

      if (formattedLine.startsWith('**')) {
        doc.setFontSize(12);
        doc.setFont('bold');
        formattedLine = formattedLine.replace(/\*\*/g, ''); // Remove the markdown bold indicators
        // Wrap text
        const textLines = doc.splitTextToSize(formattedLine, 190); // 190 is the width for the text
        textLines.forEach((textLine) => {
          doc.text(textLine, 10, y);
          y += 10; // Move down for the next line
        });
        doc.setFont('normal');
      } else if (formattedLine.startsWith('*')) {
        doc.setFontSize(12);
        formattedLine = formattedLine.replace(/\*/g, ''); // Remove bullet indicators
        // Wrap text
        const textLines = doc.splitTextToSize(formattedLine, 190);
        textLines.forEach((textLine) => {
          doc.text(textLine, 20, y); // Indent bullet points
          y += 10; // Move down for the next line
        });
      } else {
        doc.setFontSize(12);
        // Wrap text
        const textLines = doc.splitTextToSize(formattedLine, 190);
        textLines.forEach((textLine) => {
          doc.text(textLine, 10, y);
          y += 10; // Move down for the next line
        });
      }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
        <button onClick={() => setShowReport(!showReport)}>
          {showReport ? 'Hide Report' : 'View Reliability Report'}
        </button>
        <button onClick={downloadPDF} style={{ marginLeft: '10px' }}>
          Download Report as PDF
        </button>
      </div>

      {showReport && (
        <div style={{ marginTop: '20px', lineHeight: '1.6' }}>
          <h2>Reliability Report</h2>
          <h3>Reliability Assessment</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{formatAssessmentContent(reliabilityAssessment)}</div>
        </div>
      )}
    </div>
  );
};

// Function to format reliability assessment content for display
const formatAssessmentContent = (assessment) => {
  const formattedContent = assessment.split('\n').map((line, index) => {
    if (line.trim().startsWith('**')) {
      return <h4 key={index} style={{ fontWeight: 'bold' }}>{line.replace(/\*\*/g, '')}</h4>; // Bold subheadings
    } else if (line.trim().startsWith('*')) {
      return <li key={index}>{line.replace(/\*/g, '')}</li>; // Convert bullet points
    } else {
      return <p key={index} style={{ margin: '10px 0' }}>{line}</p>; // Regular paragraph with margin
    }
  });

  return <>{formattedContent}</>;
};

export default ArticleReliabilityReport;
