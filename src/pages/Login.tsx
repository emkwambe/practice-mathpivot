import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <SignIn
        routing="path"
        path="/login"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#111111] border border-[#1F1F1F] shadow-none",
            headerTitle: "text-white",
            headerSubtitle: "text-[#8A8A8A]",
            socialButtonsBlockButton: "bg-[#1F1F1F] border-[#333333] text-white hover:bg-[#2A2A2A]",
            formFieldLabel: "text-[#8A8A8A]",
            formFieldInput: "bg-[#0A0A0A] border-[#1F1F1F] text-white",
            footerActionLink: "text-[#C9A86C]",
            primaryButton: "bg-[#C9A86C] text-black hover:bg-[#D4B87A]",
          },
        }}
      />
    </div>
  );
}
