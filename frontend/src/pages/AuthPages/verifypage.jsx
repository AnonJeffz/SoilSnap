import PageMeta from "../../components/common/PageMeta";
import { useLocation, Link } from "react-router";

export default function VerifyPage() {
    const query = new URLSearchParams(useLocation().search);
    const status = query.get("status");

    return (
        <>
            <PageMeta
                title="SoilSnap | Gmail Verification"
                description="Verify your SoilSnap account."
            />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">

                    {status === "success" ? (
                        <>
                            {/* Success Icon */}
                            <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900">
                                <svg
                                    className="w-12 h-12 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Gmail Successfully Verified!
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Your SoilSnap account is now verified. You can proceed to the dashboard.
                            </p>

                            <Link to="/home">
                                <button className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 dark:bg-green-500 dark:hover:bg-green-600 shadow-md">
                                    Go to Dashboard
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Invalid or missing status */}
                            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                                Verification Failed
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                The verification link may have expired or is invalid.
                            </p>

                            <Link to="/signin">
                                <button className="w-full py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-md">
                                    Go to Sign In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                `}
            </style>
        </>
    );
}
