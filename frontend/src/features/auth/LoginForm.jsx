import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/workspaces");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />
      <Button type="submit" isLoading={isLoggingIn} className="mt-2 w-full">
        Log in
      </Button>
    </form>
  );
}
