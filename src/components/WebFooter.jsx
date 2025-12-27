const WebFooter = () => {
  const START_YEAR = 2025;

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white print:hidden">
      <div className="flex flex-col items-center justify-center gap-3 py-8 px-4">
        {/* Logo + Brand Name (Single Row, Centered) */}
        <div className="flex items-center gap-3">
          <img
            src="/kabs-logo.png"
            alt="Kabs Digital Logo"
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
          />
          <a
            href="https://www.kabsdigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm sm:text-base tracking-wide transition-all duration-300 bg-clip-text text-transparent hover:scale-105 hover:underline"
            style={{
              fontFamily: "'Poppins', sans-serif",
              backgroundImage: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
              textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Kabs Digital
          </a>
        </div>

        {/* Divider */}
        <span
          className="w-48 h-0.5 rounded-full"
          style={{
            backgroundImage: "linear-gradient(90deg, #3B82F6, #1E3A8A)",
          }}
        ></span>

        {/* Tagline */}
        <p
          className="text-[10px] sm:text-xs uppercase font-medium text-center transition-all duration-300 hover:text-blue-600"
          style={{
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: "0.15em",
            fontStyle: "italic",
            backgroundImage: "linear-gradient(to right, #1E40AF, #3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Innovations in One Click
        </p>

        {/* Copyright */}
        <p
          className="text-[9px] text-gray-500"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          © {START_YEAR} - {new Date().getFullYear()} Kabs Digital
        </p>
      </div>
    </footer>
  );
};

export default WebFooter;
