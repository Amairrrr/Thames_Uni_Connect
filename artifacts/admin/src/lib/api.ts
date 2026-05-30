const getKey = () => localStorage.getItem("tuc_admin_key") ?? "";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": getKey(),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export type Stats = {
  totalUsers: number;
  totalEnquiries: number;
  byStatus: Record<string, number>;
  byCountry: Record<string, number>;
  byCourse: Record<string, number>;
  byDestination: Record<string, number>;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  courseInterest: string;
  registeredAt: string;
};

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  course: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
};

export async function fetchStats(): Promise<Stats> {
  return apiFetch("/api/admin/stats");
}

export async function fetchStudents(): Promise<Student[]> {
  return apiFetch("/api/admin/users");
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  return apiFetch("/api/admin/enquiries");
}

export async function updateEnquiryStatus(id: number, status: string): Promise<Enquiry> {
  return apiFetch(`/api/enquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function sendContactEmail({
  toEmail,
  toName,
  message,
}: {
  toEmail: string;
  toName: string;
  message: string;
}): Promise<void> {
  await apiFetch("/api/admin/send-email", {
    method: "POST",
    body: JSON.stringify({ toEmail, toName, message }),
  });
}

export async function verifyAdminKey(key: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/stats", {
      headers: { "x-admin-key": key },
    });
    return res.ok;
  } catch {
    return false;
  }
}
