import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const name = searchParams.get("name");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "citizen");
      if (name) {
        localStorage.setItem("userName", decodeURIComponent(name));
      }

      // Redirect to appropriate page
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // No token and no error - something went wrong
      navigate("/login?error=unknown", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
