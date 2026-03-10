import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../shared/api/client";
import { initiateGoogleAuth, resendVerificationEmail } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [status, setStatus] = useState({ type: "", text: "", emailNotVerified: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "", emailNotVerified: false });
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (form.remember) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userName", response.data.user.name);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }

      setStatus({ type: "success", text: response.data.message || "Login successful" });

      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate("/admin", { replace: true });
          return;
        }
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      const isEmailNotVerified = error.response?.status === 403;
      
      setStatus({ 
        type: "error", 
        text: errorMessage,
        emailNotVerified: isEmailNotVerified
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!form.email) {
      setStatus({ type: "error", text: "Please enter your email" });
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(form.email);
      setStatus({ 
        type: "success", 
        text: "Verification email sent! Check your inbox.",
        emailNotVerified: false
      });
    } catch (error) {
      setStatus({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to resend verification email",
        emailNotVerified: false
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleAuth = () => {
    initiateGoogleAuth();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:py-14">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
        <div className="grid min-h-[660px] grid-cols-1 md:grid-cols-2">
          <aside className="relative flex flex-col justify-between bg-[#e9f4ee] p-8 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-lg font-semibold text-emerald-600 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                EcoMap
              </div>

              <h1 className="mt-10 text-4xl font-extrabold leading-tight text-emerald-950 md:text-5xl">
                Welcome back
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
                Sign in to your account to track your reports, vote on issues, and engage with your community.
              </p>
            </div>

            <div className="space-y-5">
              <div className="max-w-sm rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-slate-800">Quick access to your dashboard</p>
                <p className="mt-1 text-sm text-slate-500">Track and manage all your reports in one place.</p>
              </div>
              <div className="flex items-center gap-5 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Secure login
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Real-time updates
                </span>
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center bg-white p-8 md:p-10">
            <div className="w-full max-w-sm">
              <h2 className="text-3xl font-bold text-slate-800">Sign in to your account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Please enter your email and password.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Keep me logged in
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {status.text && (
                <div
                  className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                    status.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <p>{status.text}</p>
                  {status.emailNotVerified && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="mt-2 text-xs font-semibold underline hover:no-underline disabled:opacity-60"
                    >
                      {isResending ? "Sending..." : "Resend verification email"}
                    </button>
                  )}
                </div>
              )}

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-wide text-slate-400">Or continue with</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                New to ecomap?
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/register"
                className="block w-full rounded-lg border border-emerald-300 px-4 py-2.5 text-center text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Create an account
              </Link>

              <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
                By signing in, you acknowledge that you have read and agree to our Terms of Service.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Login;