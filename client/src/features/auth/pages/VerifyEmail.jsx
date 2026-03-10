import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "../api/authApi";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (!token) {
      setStatus({ 
        type: "error", 
        text: "No verification token provided. Please check your email for the verification link." 
      });
      setIsLoading(false);
      return;
    }

    // Verify the email with the token
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus({ type: "success", text: response.data.message });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Email verification failed";
        setStatus({ type: "error", text: errorMsg });
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      setStatus({ type: "error", text: "Email address required" });
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      setStatus({ 
        type: "success", 
        text: "Verification email has been sent to your inbox. Check your email!" 
      });
    } catch (error) {
      setStatus({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to send verification email" 
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:py-14">
      <section className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40 p-8 md:p-10">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
              {isLoading ? (
                <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : status.type === "success" ? (
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify Your Email</h1>
            <p className="text-slate-600 text-sm mb-6">
              {isLoading
                ? "Verifying your email address..."
                : status.type === "success"
                ? "Email verified successfully! Redirecting to login..."
                : "Email verification encountered an issue"}
            </p>

            {status.text && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm mb-6 ${
                  status.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {status.text}
              </div>
            )}

            {status.type === "error" && !isLoading && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-3">
                    Didn't receive the email or it expired? Request a new verification link.
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 mb-3"
                  />
                  <button
                    onClick={handleResendEmail}
                    disabled={isResending || !email}
                    className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>

                <Link
                  to="/login"
                  className="block w-full rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Login
                </Link>
              </div>
            )}

            {status.type === "success" && (
              <Link
                to="/login"
                className="block w-full rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Go to Login
              </Link>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Having trouble? <a href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">Contact Support</a>
        </p>
      </section>
    </main>
  );
}

export default VerifyEmail;
