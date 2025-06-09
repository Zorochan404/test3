
import { redirect } from "next/navigation";

export default function Home() {
  // Make sure this redirect works properly
  redirect("/auth/login");
  
  // Add a fallback return in case redirect doesn't work
  return null;
}

