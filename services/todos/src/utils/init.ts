import dotenv from "dotenv";

dotenv.config();
const checkMissingEnvVars = () => {
  const missingVars: string[] = [];
  if (!process.env.PGUSER) missingVars.push("PGUSER");
  if (!process.env.POSTGRES_PASSWORD) missingVars.push("POSTGRES_PASSWORD");
  if (!process.env.PGHOST) missingVars.push("PGHOST");
  if (!process.env.PGPORT) missingVars.push("PGPORT");
  if (!process.env.PGDB) missingVars.push("PGDB");
  if (missingVars.length > 0) {
    console.error(
      `Error: Missing the following environment variables: ${missingVars.join(
        ", "
      )}`
    );
    console.error(
      "Please ensure that all required environment variables are set."
    );
    console.error("Refer to the .env.example file for the required variables.");
    process.exit(1);
  }
};

const constructDBUrl = () => {
  return `postgres://${process.env.PGUSER}:${process.env.POSTGRES_PASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;
};

let DB_URL: string = "";

if (process.env.NODE_ENV !== "test") {
  checkMissingEnvVars();
  DB_URL = constructDBUrl();
}

export { DB_URL };
