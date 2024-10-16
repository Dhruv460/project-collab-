import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: "mradhruv27@gmail.com",
				pass: "mpnn pjfm ivdn aapf",
			},
		});

		await transporter.sendMail({
			from: "mradhruv27@gmail.com",
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
export default sendEmail;