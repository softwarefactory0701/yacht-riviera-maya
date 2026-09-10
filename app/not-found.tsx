import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span>YACHT RIVIERA MAYA</span>
      <h1>No encontramos esta sección.</h1>
      <p>La página que buscas no existe o cambió de ubicación.</p>
      <Link href="/overview" className="btn">
        Volver al inicio
      </Link>
    </main>
  );
}
