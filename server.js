require('dotenv').config();

const app = require('./src/index');
const { testConnection } = require('./src/infrastructure/database/mysql');

const PORT = process.env.PORT || 3000;

async function startServer() {
    const connectionInfo = await testConnection();
    console.log(`MySQL connected to ${connectionInfo.host}:${connectionInfo.port}/${connectionInfo.database}`);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Unable to start server:', error.message);
    process.exit(1);
});