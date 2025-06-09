import { dirname } from "path";
import { fileURLToPath } from "url";

// Fix the __dirname issue in ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rest of your server code