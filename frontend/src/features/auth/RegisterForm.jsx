import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Account created — welcome to TaskFlow.");
      navigate("/workspaces");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        placeholder="Lakshay Aggarwal"
        error={errors.name?.message}
        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
      />
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
        placeholder="At least 6 characters"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        })}
      />
      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === watch("password") || "Passwords don't match",
        })}
      />
      <Button type="submit" isLoading={isRegistering} className="mt-2 w-full">
        Create account
      </Button>
    </form>
  );
}
