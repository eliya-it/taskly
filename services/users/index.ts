import { app } from "./app";
import { ensureUsersTableExist } from "./utils/db";

const port = 5000;
app.listen(port, async () => {
  try {
    await ensureUsersTableExist();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error("Error during table creation:", error);
    process.exit(1);
  }
});
