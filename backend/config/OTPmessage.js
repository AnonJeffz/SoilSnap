export function generateOtpHtml(otp) {
    return `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f0fdf4; padding: 40px 20px;">
        <div style="
            max-width: 500px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
            text-align: center; 
            padding: 30px;
            color: #333;
        ">
            
            <!-- Header -->
            <div style="background-color: #22c55e; padding: 15px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #fff; font-size: 28px; margin: 0;">SOILSNAP</h1>
            </div>

            <!-- Body -->
            <div style="padding: 25px 15px;">
                <p style="font-size: 18px; font-weight: 600; color: #166534; margin-bottom: 15px;">
                    Your OTP for resetting your password is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    color: #22c55e;
                    margin: 20px 0;
                    letter-spacing: 3px;
                    background-color: #ecfdf5;
                    padding: 15px 0;
                    border-radius: 8px;
                ">
                    ${otp}
                </div>

                <p style="font-size: 14px; color: #4b5563;">
                    This OTP is valid for 10 minutes.
                </p>

                <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f0fdf4; padding: 12px; font-size: 12px; color: #4b5563; border-radius: 0 0 12px 12px;">
                &copy; ${new Date().getFullYear()} SOILSNAP. All rights reserved.
            </div>
        </div>
    </div>
    `;
}
export function successMessage() {
    return `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f0fdf4; padding: 40px 20px;">
        <div style="
            max-width: 500px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
            text-align: center; 
            padding: 30px;
            color: #333;
        ">
            
            <!-- Header -->
            <div style="background-color: #22c55e; padding: 15px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #fff; font-size: 28px; margin: 0;">SOILSNAP</h1>
            </div>

            <!-- Body -->
            <div style="padding: 25px 15px;">
                <h2 style="font-size: 22px; font-weight: bold; color: #166534; margin-bottom: 15px;">
                    Password Successfully Changed!
                </h2>

                <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px;">
                    Your SOILSNAP account password has been updated.
                </p>

                <p style="font-size: 14px; color: #6b7280;">
                    If you did not request this change, please contact our support team immediately.
                </p>

                <a href="https://soilsnap-production.up.railway.app/signin" style="
                    display: inline-block;
                    margin-top: 25px;
                    padding: 12px 25px;
                    background-color: #22c55e;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: all 0.2s ease-in-out;
                " onmouseover="this.style.backgroundColor='#16a34a'" onmouseout="this.style.backgroundColor='#22c55e'">
                    Sign In
                </a>
            </div>

            <!-- Footer -->
            <div style="background-color: #f0fdf4; padding: 12px; font-size: 12px; color: #4b5563; border-radius: 0 0 12px 12px;">
                &copy; ${new Date().getFullYear()} SOILSNAP. All rights reserved.
            </div>
        </div>
    </div>
    `;
}
