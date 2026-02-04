const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');

(async () => {
	try {
		await connectDB();
		const PORT = process.env.PORT;
		app.listen(PORT, () => {
			console.log(`Server started at port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
})();
