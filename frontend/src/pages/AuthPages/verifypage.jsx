import { useParams, Link } from "react-router"; 
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api"; 

export default function VerifyPage() {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");

    // Verify account on mount
    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await api.get(`/api/users/verify/${token}`);

                // Assuming your backend now returns { success: true } on verification
                if (response.data?.success) {
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            } catch (error) {
                console.error("Verification error:", error.response || error);
                setStatus("failed");
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <>
            <PageMeta title="Verifying Email" description="Email verification" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                    {status === "loading" && (
                        <h2 className="text-gray-700 dark:text-gray-200 text-lg">
                            Verifying your account...
                        </h2>
                    )}

                    {status === "success" && (
                        <>
                            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                                Email Verified Successfully!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-3">
                                Your SOILSNAP account is now verified.
                            </p>
                            <Link to="/home">
                                <button className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                    Go to Dashboard Now
                                </button>
                            </Link>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-3">
                                The verification link is invalid or expired.
                            </p>
                            <Link to="/signin">
                                <button className="mt-6 w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
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
