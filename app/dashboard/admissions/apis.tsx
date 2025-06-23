import { buildApiUrl, getApiHeaders } from '@/lib/api-config';

// Placeholder API for admissions management
// TODO: Replace with real API endpoints when backend is ready

export async function getAdmissions() {
  // For now, return mock data
  // TODO: Replace with: const response = await fetch(buildApiUrl('admissions/getadmissions'));
  await new Promise((res) => setTimeout(res, 500));
  return [
    {
      _id: '1',
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      courseId: 'c1',
      courseName: 'B.Tech Computer Science',
      paymentStatus: 'completed',
      applicationStatus: 'enrolled',
      amount: 50000,
      razorpayOrderId: 'order_123',
      razorpayPaymentId: 'pay_123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      studentName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      courseId: 'c2',
      courseName: 'MBA',
      paymentStatus: 'pending',
      applicationStatus: 'pending',
      amount: 60000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export async function getAdmissionById(id: string) {
  // For now, return mock data
  // TODO: Replace with: const response = await fetch(buildApiUrl(`admissions/getadmissionbyid/${id}`));
  await new Promise((res) => setTimeout(res, 300));
  return {
    _id: id,
    applicationId: 'APP75454712',
    studentName: 'CHINMOY KOCH',
    email: 'qwsdfg2@gmail.com',
    phone: '9101200131',
    dateOfBirth: '2025-06-10',
    gender: 'male',
    religion: 'jainism',
    aadharNumber: '123456789098',
    permanentAddress: 'near hostel 8',
    temporaryAddress: 'Assam Engineering College',
    city: 'guwahati',
    state: 'assam',
    pincode: '781013',
    fatherName: 'asdfg',
    fatherPhone: '1234567890',
    fatherOccupation: 'private-service',
    fatherQualification: 'diploma',
    motherName: 'qwertyuiop',
    motherPhone: '1234567890',
    motherOccupation: 'lawyer',
    motherQualification: 'post-graduation',
    parentsAnnualIncome: 123456,
    parentsAddress: 'near hostel 8\nAssam Engineering College',
    localGuardianName: 'qwertyuio',
    localGuardianPhone: '1234567890',
    localGuardianOccupation: 'retired',
    localGuardianRelation: 'grandmother',
    localGuardianAddress: 'werfgh',
    tenthBoard: 'icse',
    tenthInstitution: 'qwertyu',
    tenthStream: 'science',
    tenthPercentage: '67%',
    tenthYear: '2013',
    twelfthBoard: 'cbse',
    twelfthInstitution: 'qwerty',
    twelfthStream: 'science',
    twelfthPercentage: '86%',
    twelfthYear: '2015',
    diplomaInstitution: 'qwertyuio',
    diplomaStream: 'commerce',
    diplomaPercentage: '67%',
    diplomaYear: '2012',
    graduationUniversity: 'qwert',
    graduationPercentage: '45%',
    graduationYear: '2012',
    programCategory: '',
    programName: 'bvs',
    specialization: 'interior_design',
    campus: 'main',
    programType: 'vocational',
    profilePhoto: 'invoice (1).pdf',
    signature: 'highest_level_dfd.pdf',
    aadharCard: 'highest_level_dfd.pdf',
    tenthMarksheet: 'highest_level_dfd.pdf',
    twelfthMarksheet: 'invoice.pdf',
    diplomaMarksheet: 'invoice.pdf',
    graduationMarksheet: 'highest_level_dfd.pdf',
    paymentStatus: 'completed',
    applicationStatus: 'pending',
    amount: 50000,
    razorpayOrderId: 'order_123',
    razorpayPaymentId: 'pay_123',
    createdAt: '2025-06-22T06:57:43.744Z',
    updatedAt: '2025-06-22T06:57:43.744Z',
  };
}

export async function updateAdmissionStatus(id: string, status: string) {
  // For now, return mock success
  // TODO: Replace with:
  // const response = await fetch(buildApiUrl(`admissions/updatestatus/${id}`), {
  //   method: 'PUT',
  //   headers: getApiHeaders(),
  //   body: JSON.stringify({ status })
  // });
  await new Promise((res) => setTimeout(res, 300));
  return { success: true };
}

// TODO: Add these functions when backend is ready:
// export async function createAdmission(data: AdmissionData) { ... }
// export async function deleteAdmission(id: string) { ... }
// export async function updateAdmission(id: string, data: AdmissionData) { ... } 