
import React from "react";
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-semibold text-lg">M</span>
      </div>
      <span className="text-xl font-bold text-foreground">Match</span>
    </Link>
  );
};

export default HeaderLogo;
