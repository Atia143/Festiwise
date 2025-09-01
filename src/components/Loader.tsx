"use client";
import { useEffect, useState } from "react";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 3000); // 2s fade + buffer
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="festiwise-loader">
      <div className="content">
        <div className="emoji">🎪</div>
        <div className="text">FestiWise</div>
      </div>
    </div>
  );
}
