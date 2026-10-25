"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

const DEMO_ACCESS_KEY = "edugenie-demo-access";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [notice, setNotice] = useState("");

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Demo-only access: credentials are deliberately not stored or sent anywhere.
    sessionStorage.setItem(DEMO_ACCESS_KEY, "active");
    if (remember) {
      localStorage.setItem(DEMO_ACCESS_KEY, "active");
    } else {
      localStorage.removeItem(DEMO_ACCESS_KEY);
    }

    setPassword("");
    router.push("/app");
  }

  return (
    <main className="login-shell">
      <div className="login-backdrop login-backdrop-one" aria-hidden="true" />
      <div className="login-backdrop login-backdrop-two" aria-hidden="true" />

      <section className="login-card" aria-label="EduGenie sign in">
        <aside className="login-welcome">
          <span className="login-orb login-orb-one" aria-hidden="true" />
          <span className="login-orb login-orb-two" aria-hidden="true" />
          <span className="login-orb login-orb-three" aria-hidden="true" />

          <div className="login-welcome-copy">
            <div className="login-brand">
              <span className="login-brand-mark"><Sparkles size={18} fill="currentColor" /></span>
              <span>EduGenie</span>
            </div>
            <p className="login-eyebrow">WELCOME</p>
            <h2>A smarter way<br />to learn.</h2>
            <p className="login-welcome-description">
              Find clarity in every subject. Ask a question, explore an idea, and
              take the next step with confidence.
            </p>
            <div className="login-welcome-footer">
              <BookOpen size={15} />
              <span>Your personal learning studio</span>
            </div>
          </div>
          <span className="login-blue-curve" aria-hidden="true" />
        </aside>

        <div className="login-form-panel">
          <form className="login-form" onSubmit={signIn} autoComplete="off">
            <span className="login-form-kicker">EDUGENIE LEARNING STUDIO</span>
            <h1>Sign in</h1>
            <p className="login-form-subtitle">Welcome back. Your next idea starts here.</p>

            <label className="login-field-label" htmlFor="login-email">Email address</label>
            <div className="login-input-wrap">
              <Mail size={17} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                required
              />
            </div>

            <label className="login-field-label" htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter any password"
                autoComplete="off"
                required
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showPassword ? "HIDE" : "SHOW"}</span>
              </button>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="login-text-button"
                onClick={() => setNotice("Demo access has no password recovery. Enter any email and password to continue.")}
              >
                Forgot password?
              </button>
            </div>

            <button className="login-submit" type="submit">Sign in</button>

            <div className="login-divider"><span>or</span></div>

            <button
              className="login-other"
              type="button"
              onClick={() => setNotice("Social sign-in is not configured. Use the demo email and password fields above.")}
            >
              Sign in with other
            </button>

            {notice && <p className="login-notice" role="status">{notice}</p>}

            <p className="login-signup">
              New to EduGenie?{" "}
              <button
                type="button"
                className="login-text-button"
                onClick={() => setNotice("Account registration is not enabled in this demo. Enter any email and password to continue.")}
              >
                Sign up
              </button>
            </p>

            <p className="login-demo-note">
              Demo sign-in only. Any valid email and non-empty password opens the
              study space. Your password is not saved or sent.
            </p>
          </form>
        </div>
      </section>

      <p className="login-page-footnote">EDUGENIE <span /> LEARN AT YOUR OWN PACE</p>
    </main>
  );
}
