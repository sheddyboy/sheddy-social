import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex mt-4 max-w-4xl mx-auto gap-6">
      <div className="w-full">
        <div className="h-screen flex items-center">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
