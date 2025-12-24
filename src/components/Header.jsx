import Logo from "./Logo";

const Header = ({ onPrint, canPrint = true }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border-b-2 border-blue-200 pb-3 print:border-b print:border-gray-800 print:pb-1.5 print:mb-2 gap-3">
      <Logo />
      {canPrint && (
        <button
          onClick={onPrint}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm w-full sm:w-auto print:hidden hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Print Chart
        </button>
      )}
    </div>
  );
};

export default Header;
