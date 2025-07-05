import jsPDF from 'jspdf';

export interface AdmissionData {
  _id: string;
  applicationId: string;
  studentName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  religion?: string;
  aadharNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  fathersName?: string;
  fathersPhone?: string;
  fathersOccupation?: string;
  fathersQualification?: string;
  mothersName?: string;
  mothersPhone?: string;
  mothersOccupation?: string;
  mothersQualification?: string;
  parentsAnnualIncome?: number;
  parentsAddress?: string;
  localGuardianName?: string;
  localGuardianPhone?: string;
  localGuardianOccupation?: string;
  localGuardianRelation?: string;
  localGuardianAddress?: string;
  tenthBoard?: string;
  tenthInstitution?: string;
  tenthStream?: string;
  tenthPercentage?: string;
  tenthYear?: string;
  twelfthBoard?: string;
  twelfthInstitution?: string;
  twelfthStream?: string;
  twelfthPercentage?: string;
  twelfthYear?: string;
  diplomaInstitution?: string;
  diplomaStream?: string;
  diplomaPercentage?: string;
  diplomaYear?: string;
  graduationUniversity?: string;
  graduationPercentage?: string;
  graduationYear?: string;
  programCategory?: string;
  programName?: string;
  specialization?: string;
  campus?: string;
  programType?: string;
  profilePhoto?: string;
  signature?: string;
  aadharCard?: string;
  tenthMarksheet?: string;
  twelfthMarksheet?: string;
  diplomaMarksheet?: string;
  graduationMarksheet?: string;
  submittedAt: string;
  paymentStatus: string;
  applicationStatus: string;
  paymentComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function generateAdmissionPDF(admission: AdmissionData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  const lineHeight = 7;
  const sectionGap = 15;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * lineHeight;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, margin, y);
    return y + lineHeight + 5;
  };

  // Helper function to add field
  const addField = (label: string, value: string | undefined, y: number, isBold = false) => {
    if (!value) return y;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const labelText = `${label}: `;
    const labelWidth = pdf.getTextWidth(labelText);
    
    pdf.text(labelText, margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    const valueHeight = addWrappedText(value, margin + labelWidth, y, contentWidth - labelWidth);
    return y + valueHeight + 3;
  };

  // Helper function to add image with better error handling
  const addImage = async (imageUrl: string, label: string, y: number) => {
    if (!imageUrl) return y;
    
    try {
      // Create a temporary image element
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          console.warn(`Failed to load image: ${label}`);
          resolve(null);
        };
        img.src = imageUrl;
      });

      if (!img.complete || img.naturalWidth === 0) {
        console.warn(`Image failed to load: ${label}`);
        return y;
      }

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx?.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate image dimensions to fit on page
      const maxWidth = contentWidth;
      const maxHeight = 80;
      let imgWidth = img.naturalWidth;
      let imgHeight = img.naturalHeight;
      
      if (imgWidth > maxWidth) {
        const ratio = maxWidth / imgWidth;
        imgWidth = maxWidth;
        imgHeight = imgHeight * ratio;
      }
      
      if (imgHeight > maxHeight) {
        const ratio = maxHeight / imgHeight;
        imgHeight = maxHeight;
        imgWidth = imgWidth * ratio;
      }

      // Check if we need a new page
      if (y + imgHeight + 20 > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Add label
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(label, margin, y);
      y += 5;

      // Add image
      pdf.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight);
      return y + imgHeight + 10;
    } catch (error) {
      console.error(`Error loading image ${label}:`, error);
      return y;
    }
  };

  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('ADMISSION APPLICATION', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Application ID: ${admission.applicationId}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.text(`Submitted: ${new Date(admission.submittedAt).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += sectionGap;

  // Personal Information
  yPosition = addSectionHeader('Personal Information', yPosition);
  yPosition = addField('Full Name', admission.studentName || `${admission.firstName} ${admission.lastName}`, yPosition, true);
  yPosition = addField('Email', admission.email, yPosition);
  yPosition = addField('Phone', admission.phone, yPosition);
  yPosition = addField('Date of Birth', admission.dateOfBirth ? new Date(admission.dateOfBirth).toLocaleDateString() : undefined, yPosition);
  yPosition = addField('Gender', admission.gender, yPosition);
  yPosition = addField('Religion', admission.religion, yPosition);
  yPosition = addField('Aadhar Number', admission.aadharNumber, yPosition);
  yPosition += 5;

  // Address Information
  yPosition = addSectionHeader('Address Information', yPosition);
  yPosition = addField('Permanent Address', admission.permanentAddress, yPosition);
  yPosition = addField('Temporary Address', admission.temporaryAddress, yPosition);
  yPosition = addField('City', admission.city, yPosition);
  yPosition = addField('State', admission.state, yPosition);
  yPosition = addField('Pincode', admission.pincode, yPosition);
  yPosition += 5;

  // Guardian Information
  yPosition = addSectionHeader('Guardian Information', yPosition);
  
  // Father's Details
  yPosition = addField('Father\'s Name', admission.fathersName, yPosition);
  yPosition = addField('Father\'s Phone', admission.fathersPhone, yPosition);
  yPosition = addField('Father\'s Occupation', admission.fathersOccupation, yPosition);
  yPosition = addField('Father\'s Qualification', admission.fathersQualification, yPosition);
  yPosition += 3;

  // Mother's Details
  yPosition = addField('Mother\'s Name', admission.mothersName, yPosition);
  yPosition = addField('Mother\'s Phone', admission.mothersPhone, yPosition);
  yPosition = addField('Mother\'s Occupation', admission.mothersOccupation, yPosition);
  yPosition = addField('Mother\'s Qualification', admission.mothersQualification, yPosition);
  yPosition += 3;

  yPosition = addField('Parents Annual Income', admission.parentsAnnualIncome ? `₹${admission.parentsAnnualIncome}` : undefined, yPosition);
  yPosition = addField('Parents Address', admission.parentsAddress, yPosition);
  yPosition += 5;

  // Local Guardian
  if (admission.localGuardianName) {
    yPosition = addSectionHeader('Local Guardian Information', yPosition);
    yPosition = addField('Name', admission.localGuardianName, yPosition);
    yPosition = addField('Phone', admission.localGuardianPhone, yPosition);
    yPosition = addField('Occupation', admission.localGuardianOccupation, yPosition);
    yPosition = addField('Relation', admission.localGuardianRelation, yPosition);
    yPosition = addField('Address', admission.localGuardianAddress, yPosition);
    yPosition += 5;
  }

  // Academic Information
  yPosition = addSectionHeader('Academic Information', yPosition);
  
  // 10th Standard
  yPosition = addField('10th Board', admission.tenthBoard, yPosition);
  yPosition = addField('10th Institution', admission.tenthInstitution, yPosition);
  yPosition = addField('10th Stream', admission.tenthStream, yPosition);
  yPosition = addField('10th Percentage', admission.tenthPercentage, yPosition);
  yPosition = addField('10th Year', admission.tenthYear, yPosition);
  yPosition += 3;

  // 12th Standard
  yPosition = addField('12th Board', admission.twelfthBoard, yPosition);
  yPosition = addField('12th Institution', admission.twelfthInstitution, yPosition);
  yPosition = addField('12th Stream', admission.twelfthStream, yPosition);
  yPosition = addField('12th Percentage', admission.twelfthPercentage, yPosition);
  yPosition = addField('12th Year', admission.twelfthYear, yPosition);
  yPosition += 3;

  // Diploma (if applicable)
  if (admission.diplomaInstitution) {
    yPosition = addField('Diploma Institution', admission.diplomaInstitution, yPosition);
    yPosition = addField('Diploma Stream', admission.diplomaStream, yPosition);
    yPosition = addField('Diploma Percentage', admission.diplomaPercentage, yPosition);
    yPosition = addField('Diploma Year', admission.diplomaYear, yPosition);
    yPosition += 3;
  }

  // Graduation (if applicable)
  if (admission.graduationUniversity) {
    yPosition = addField('Graduation University', admission.graduationUniversity, yPosition);
    yPosition = addField('Graduation Percentage', admission.graduationPercentage, yPosition);
    yPosition = addField('Graduation Year', admission.graduationYear, yPosition);
    yPosition += 5;
  }

  // Program Information
  yPosition = addSectionHeader('Program Information', yPosition);
  yPosition = addField('Program Category', admission.programCategory, yPosition);
  yPosition = addField('Program Name', admission.programName, yPosition);
  yPosition = addField('Program Type', admission.programType, yPosition);
  yPosition = addField('Specialization', admission.specialization, yPosition);
  yPosition = addField('Campus', admission.campus, yPosition);
  yPosition += 5;

  // Application Status
  yPosition = addSectionHeader('Application Status', yPosition);
  yPosition = addField('Payment Status', admission.paymentStatus, yPosition);
  yPosition = addField('Application Status', admission.applicationStatus, yPosition);
  yPosition += 5;

  // Payment Details
  yPosition = addSectionHeader('Payment Details', yPosition);
  yPosition = addField('Payment Complete', admission.paymentComplete ? 'Yes' : 'No', yPosition);
  yPosition = addField('Application ID', admission.applicationId, yPosition);
  yPosition = addField('Submitted Date', new Date(admission.submittedAt).toLocaleDateString(), yPosition);
  yPosition = addField('Submitted Time', new Date(admission.submittedAt).toLocaleTimeString(), yPosition);
  yPosition = addField('Created Date', new Date(admission.createdAt).toLocaleDateString(), yPosition);
  yPosition = addField('Last Updated', new Date(admission.updatedAt).toLocaleDateString(), yPosition);
  yPosition += 5;

  // Payment Summary
  yPosition = addSectionHeader('Payment Summary', yPosition);
  yPosition = addField('Application Fee Status', admission.paymentComplete ? 'Paid' : 'Pending', yPosition);
  yPosition = addField('Payment Method', admission.paymentStatus === 'completed' ? 'Online Payment' : 'Not Specified', yPosition);
  yPosition = addField('Application Processing', admission.applicationStatus.charAt(0).toUpperCase() + admission.applicationStatus.slice(1), yPosition);
  yPosition += sectionGap;

  // Documents Section
  yPosition = addSectionHeader('Uploaded Documents', yPosition);

  // Add images for documents
  const documents = [
    { url: admission.profilePhoto, label: 'Profile Photo' },
    { url: admission.signature, label: 'Signature' },
    { url: admission.aadharCard, label: 'Aadhar Card' },
    { url: admission.tenthMarksheet, label: '10th Marksheet' },
    { url: admission.twelfthMarksheet, label: '12th Marksheet' },
    { url: admission.diplomaMarksheet, label: 'Diploma Marksheet' },
    { url: admission.graduationMarksheet, label: 'Graduation Marksheet' }
  ];

  for (const doc of documents) {
    if (doc.url) {
      yPosition = await addImage(doc.url, doc.label, yPosition);
    }
  }

  // Save the PDF
  const fileName = `admission_${admission.applicationId}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
} 