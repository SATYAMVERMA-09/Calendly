import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { PORT } from './config/env.js';

export async function startServer() {
    await connectDatabase(); 
    app.listen(PORT, async () => {
        console.log(`[server]: running on ${PORT}`);
    });

}
startServer().catch((err) =>{
    console.log('[Server]: Failed to start',err);
    process.exit(1);
});