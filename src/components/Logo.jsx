
const Logo = () => {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="flex items-center gap-3 px-4">
        {/* Logo Image */}
        <div className="bg-blue-100 p-2 rounded-lg">
          <img
            src="/mypetsa-logo.png"
            alt="MyPetsa Logo"
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Logo Text */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-blue-700">In-Patient Chart</h1>
          <p className="text-xs text-gray-600 font-medium">
            Medical Records Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;
