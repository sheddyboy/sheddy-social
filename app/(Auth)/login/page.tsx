import LogInForm from "@/components/LogInForm";

interface LogInPageProps {}

export default function LogInPage({}: LogInPageProps) {
  return (
    <div className="flex mt-4 max-w-4xl mx-auto gap-6">
      <div className="w-full">
        <div className="h-screen flex items-center">
          <LogInForm />
        </div>
      </div>
    </div>
  );
}
