import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../shared/api/client";
import { initiateGoogleAuth } from "../api/authApi";

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

function Register() {
  const [form, setForm] = useState(initialRegisterForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setStatus({ type: "", text: "" });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (!form.agree) {
      setStatus({ type: "error", text: "Please accept the terms to continue" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setStatus({ 
        type: "success", 
        text: "Account created! Check your email to verify your account and then sign in." 
      });
      setForm(initialRegisterForm);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus({ type: "error", text: error.response?.data?.message || "Registration failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    initiateGoogleAuth();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:py-14">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
        <div className="grid min-h-[700px] grid-cols-1 md:grid-cols-2">
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
                Join the movement,
                <br />
                <span className="text-emerald-500">make a difference</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
                Become part of a community working together to improve neighborhoods and hold authorities accountable through transparent civic action.
              </p>
            </div>

            <div className="space-y-5">
              <div className="max-w-sm rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-slate-800">Already have an account?</p>
                <p className="mt-1 text-sm text-slate-500">Sign in to continue reporting issues.</p>
              </div>
              <div className="flex items-center gap-5 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Easy signup
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Free forever
                </span>
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center bg-white p-8 md:p-10">
            <div className="w-full max-w-sm">
              <h2 className="text-3xl font-bold text-slate-800">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign up to start reporting and tracking civic issues.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="register-name">
                    Full Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="register-email">
                    Email Address
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="register-password"
                    >
                      Password
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="register-confirm-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="register-confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  I agree to the platform terms and privacy policy.
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
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
                  {status.text}
                </div>
              )}

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-wide text-slate-400">Or sign up with</span>
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
                Sign up with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Already registered?
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                to="/login"
                className="block w-full rounded-lg border border-emerald-300 px-4 py-2.5 text-center text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Sign in to your account
              </Link>

              <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
                By creating an account, you acknowledge that you have read and agree to our Terms of Service.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Register;