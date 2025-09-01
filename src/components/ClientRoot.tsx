
"use client";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => setShowLoader(false), 3000);
		return () => clearTimeout(timeout);
	}, []);

		if (showLoader) return <Loader />;
		return (
			<>
				<div style={{position: 'fixed', top: 0, left: 0, zIndex: 99999, background: 'red', color: 'white', padding: 8}}>DEBUG: children rendered</div>
				{children}
			</>
		);
}
