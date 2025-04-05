
import React from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          The page at {location.pathname} was not found
        </p>
        <Link
          to="/dashboard"
          className="text-credit-green-700 hover:text-credit-green-800 font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
