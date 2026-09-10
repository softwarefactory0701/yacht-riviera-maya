"use client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@yachtrivieramaya.com");
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("yrm-demo-session") === "true")
      router.replace("/overview");
  }, [router]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;
    setLoading(true);
    window.setTimeout(() => {
      sessionStorage.setItem("yrm-demo-session", "true");
      router.push("/overview");
    }, 650);
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <Image
          src="/demo/yacht-main.jpg"
          alt="Yate navegando en el Caribe"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 58vw"
        />
        <div className="login-overlay" />
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span>YACHT</span>
          <strong>RIVIERA MAYA</strong>
        </motion.div>
        <motion.div
          className="login-message"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <span>CONCIERGE OS</span>
          <h1>Operaciones, clientes y ventas bajo control.</h1>
          <p>
            Una plataforma privada para coordinar experiencias extraordinarias
            en el Caribe.
          </p>
        </motion.div>
      </section>
      <section className="login-panel">
        <motion.div
          className="login-form-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          <div className="login-mobile-brand">
            <span>YACHT</span>
            <strong>RIVIERA MAYA</strong>
          </div>
          <span className="eyebrow">ACCESO PRIVADO</span>
          <h2>Bienvenido</h2>
          <p>Accede a tu centro de operaciones.</p>
          <form onSubmit={submit}>
            <label>
              Correo electrónico
              <div className="login-input">
                <Mail />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </label>
            <label>
              Contraseña
              <div className="login-input">
                <LockKeyhole />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="login-spinner" />
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar sesión <ArrowRight />
                </>
              )}
            </button>
          </form>
          <div className="login-demo-note">
            <i />
            <span>Demo comercial · Acceso de presentación</span>
          </div>
        </motion.div>
        <small className="login-footer">
          Yacht Riviera Maya · Private Operations Platform
        </small>
      </section>
    </main>
  );
}
