import { app } from "./app";
import { ensureTablesExist } from "./src/utils/db";
const port = 4000;
app.listen(port, async () => {
  try {
    if (process.env.NODE_ENV !== "test") await ensureTablesExist();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error("Error during table creation:", error);
    process.exit(1);
  }
});
