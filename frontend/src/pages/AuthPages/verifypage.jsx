import { useSearchParams, Link } from "react-router"; 
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

export default function VerifyPage() {
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get("status");
    const messageParam = searchParams.get("message");
    const [status, setStatus] = useState("loading");
    const [errorMessage, setErrorMessage] = useState("");

    // Check status from URL parameters
    useEffect(() => {
        if (statusParam === "success") {
            setStatus("success");
        } else if (statusParam === "error") {
            setStatus("failed");
            setErrorMessage(messageParam || "Verification failed");
        } else {
            setStatus("failed");
            setErrorMessage("Invalid verification link");
        }
    }, [statusParam, messageParam]);

    return (
        <>
            <PageMeta title="Verifying Email" description="Email verification" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                    {status === "success" && (
                        <>
                            <div className="mb-4">
                                <svg className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                                Email Verified Successfully!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-3">
                                Your SOILSNAP account is now verified. You can now sign in to access your account.
                            </p>
                            <Link to="/signin">
                                <button className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                    Sign In Now
                                </button>
                            </Link>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div className="mb-4">
                                <svg className="mx-auto h-16 w-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-3">
                                {errorMessage || "The verification link is invalid or expired."}
                            </p>
                            <Link to="/signin">
                                <button className="mt-6 w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                                    Go to Sign In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
