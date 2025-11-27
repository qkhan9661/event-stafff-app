import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Use DIRECT_URL for seeding to bypass connection pooling
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Clean up work types - delete all and re-seed with only the 8 defined types
 */
async function cleanWorkTypes() {
    console.log("🧹 Cleaning up work types...");

    try {
        // Delete all existing work types
        console.log("  🗑️  Deleting all existing work types...");
        const deleted = await prisma.workType.deleteMany({});
        console.log(`  ✅ Deleted ${deleted.count} work types`);

        // Re-seed with the correct 8 work types
        const workTypes = [
            { name: "Full-time", description: "Regular full-time employment" },
            { name: "Part-time", description: "Part-time employment" },
            { name: "Temporary", description: "Temporary work assignment" },
            { name: "Contract", description: "Contract-based work" },
            { name: "Gig / On-demand", description: "On-demand gig work" },
            { name: "Volunteer", description: "Volunteer work" },
            { name: "Internship", description: "Internship or training position" },
            { name: "Seasonal", description: "Seasonal work" },
        ];

        console.log("  💼 Creating work types...");
        for (const workType of workTypes) {
            await prisma.workType.create({
                data: workType,
            });
        }
        console.log(`  ✅ Created ${workTypes.length} work types`);

        console.log("✅ Work types cleanup completed!");
    } catch (error) {
        console.error("❌ Error cleaning work types:", error);
        throw error;
    }
}

// Run the cleanup
cleanWorkTypes()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
