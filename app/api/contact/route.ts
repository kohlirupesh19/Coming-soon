import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

function isValidPayload(payload: ContactPayload): boolean {
  return (
    payload.name.trim().length >= 2 &&
    /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(payload.email) &&
    payload.company.trim().length >= 2 &&
    payload.projectType.trim().length > 0 &&
    payload.message.trim().length >= 20
  );
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { success: false, error: "Please complete all fields with valid information." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    message: "Thanks for reaching out. We will get back to you soon."
  });
}
