"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

export default function ButtonWithSpinner({
  href,
  children,
  variant = "default",
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  const variantStyles = {
    default: "bg-gray-200 text-black hover:bg-gray-300",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-black hover:bg-yellow-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded ${variantStyles[variant]}`}
    >
      {isLoading ? <Spinner color={variant} size="sm" /> : children}
    </button>
  );
}

//usage
// import ButtonWithSpinner from "./ButtonWithSpinner";

// export default function App() {
//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <ButtonWithSpinner href="/default" variant="default">
//         Default Button
//       </ButtonWithSpinner>
//       <ButtonWithSpinner href="/primary" variant="primary">
//         Primary Button
//       </ButtonWithSpinner>
//       <ButtonWithSpinner href="/secondary" variant="secondary">
//         Secondary Button
//       </ButtonWithSpinner>
//       <ButtonWithSpinner href="/success" variant="success">
//         Success Button
//       </ButtonWithSpinner>
//       <ButtonWithSpinner href="/warning" variant="warning">
//         Warning Button
//       </ButtonWithSpinner>
//       <ButtonWithSpinner href="/danger" variant="danger">
//         Danger Button
//       </ButtonWithSpinner>
//     </div>
//   );
// }
