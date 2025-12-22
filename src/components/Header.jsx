import Logo from "./Logo";

const Header = ({ onPrint, canPrint = true }) => {
  return (
    <div className="flex justify-between items-center mb-4 border-b-2 border-blue-200 pb-3 print:border-b print:pb-2 print:mb-2">
      <Logo />
      {canPrint && (
        <button
          onClick={onPrint}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm print:hidden hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Print Chart
        </button>
      )}
    </div>
  );
};

export default Header;
