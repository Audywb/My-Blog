import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const hashed = await bcrypt.hash("admin2026", 10);

    await prisma.user.create({
        data: {
            username: "admin",
            password: hashed,
        },
    });

    console.log("✅ Seeded admin user");
}

main()
    .catch(console.error)
    .finally(() => process.exit(0));