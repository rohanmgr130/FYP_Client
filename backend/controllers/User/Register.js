const User = require('../../models/user/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../../services/sendMail');

const registerUser = async (req, res) => {
  console.log('sdgdsg');

  const { fullname, email, contact, password, role } = req.body;
  console.log('sdgdsg');

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      fullname,
      email,
      contact,
      password: hashedPassword,
      role,
      verificationToken
    });

    const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
    const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

    await sendEmail({ to: email, subject: "Email Verification", html });

    res.status(201).json({ message: "Registration successful, check your email to verify." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
    const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

    await sendEmail({ to: email, subject: "Resend Email Verification", html });

    res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend email", error: error.message });
  }
};

module.exports = { registerUser, verifyEmail, resendVerificationEmail };
