import { Link } from "@tanstack/react-router";
import { DASHBOARD_URL } from "#/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-neutral-200/80 bg-white py-12 text-neutral-600 text-xs">
      <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white font-bold text-[10px]">
            E
          </span>
          <p className="m-0 font-medium text-neutral-700">
            &copy; {year} Edge Microservices Monorepo. Built for Cloudflare Workers.
          </p>
        </div>

        <div className="flex items-center gap-6 font-medium text-neutral-500">
          <Link to="/products" className="transition hover:text-neutral-900">
            Products
          </Link>
          <Link to="/contact" className="transition hover:text-neutral-900">
            Contact
          </Link>
          <Link to="/guide" className="transition hover:text-neutral-900">
            Architecture Guide
          </Link>
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-neutral-900"
          >
            Admin Console
          </a>
        </div>
      </div>
    </footer>
  );
}
