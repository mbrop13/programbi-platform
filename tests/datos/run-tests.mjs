import { createJiti } from "jiti";
import { join } from "node:path";

const jiti = createJiti(import.meta.url, {
  alias: {
    "@": join(process.cwd()),
  },
});

async function main() {
  await jiti.import("./tramos.test.ts");
  await jiti.import("./textos.test.ts");
  await jiti.import("./seo.test.ts");
  await jiti.import("./revision.test.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
