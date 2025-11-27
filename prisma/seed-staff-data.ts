import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Use DIRECT_URL for seeding to bypass connection pooling
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seed Staff Positions
 */
const staffPositions = [
    { name: "A Rating", description: "A Rating position" },
    { name: "Audio 1 (A1)", description: "Audio 1 technician" },
    { name: "Audio 2 (A2)", description: "Audio 2 technician" },
    { name: "Audio Tech", description: "Audio technician" },
    { name: "Aug2024", description: "Aug2024 position" },
    { name: "AV Tech", description: "Audio/Visual technician" },
    { name: "B Rating", description: "B Rating position" },
    { name: "C Rating", description: "C Rating position" },
    { name: "Camera Operator", description: "Camera operator" },
    { name: "Carpenter", description: "Carpenter" },
    { name: "Carpenter 1 (C1)", description: "Carpenter 1" },
    { name: "Carpenter 2 (C2)", description: "Carpenter 2" },
    { name: "Climbing Rigger", description: "Climbing rigger" },
    { name: "EKU", description: "EKU position" },
    { name: "Electrics", description: "Electrics" },
    { name: "Electrics Tech", description: "Electrics technician" },
    { name: "Event Steward", description: "Event steward" },
    { name: "Fly Rail", description: "Fly rail operator" },
    { name: "Fly Rail Tech", description: "Fly rail technician" },
    { name: "Forklift Operator", description: "Forklift operator" },
    { name: "Graphics Operator", description: "Graphics operator" },
    { name: "Head Carpenter", description: "Head carpenter" },
    { name: "Head Fly Rail", description: "Head fly rail" },
    { name: "HTS Remote Event Manager ($0 Charge)", description: "HTS Remote Event Manager" },
    { name: "LED Wall Tech", description: "LED wall technician" },
    { name: "Lighting 1 (L1)", description: "Lighting 1 technician" },
    { name: "Lighting 2 (l2)", description: "Lighting 2 technician" },
    { name: "Lighting Designer", description: "Lighting designer" },
    { name: "Lighting Tech", description: "Lighting technician" },
    { name: "Manager", description: "Manager" },
    { name: "Master Electrician", description: "Master electrician" },
    { name: "Meeting Room Coordinator", description: "Meeting room coordinator" },
    { name: "Oct 2024", description: "Oct 2024 position" },
    { name: "OPEN", description: "Open position" },
    { name: "Production Assistant", description: "Production assistant" },
    { name: "Production Manager", description: "Production manager" },
    { name: "Production Technical Director", description: "Production technical director" },
    { name: "Projectionist", description: "Projectionist" },
    { name: "Prop", description: "Prop specialist" },
    { name: "Prop Tech", description: "Prop technician" },
    { name: "Rigger", description: "Rigger" },
    { name: "Rigger Lead", description: "Lead rigger" },
    { name: "Spotlight Operator", description: "Spotlight operator" },
    { name: "Stage Manager", description: "Stage manager" },
    { name: "Stagehand", description: "Stagehand" },
    { name: "Stedi-Cam/JIB Operator", description: "Stedi-Cam/JIB operator" },
    { name: "Steward", description: "Steward" },
    { name: "Structure Tech", description: "Structure technician" },
    { name: "Teleprompter Operator", description: "Teleprompter operator" },
    { name: "Truck Laborer", description: "Truck laborer" },
    { name: "Utility Tech", description: "Utility technician" },
    { name: "Video 1 (v1)", description: "Video 1 technician" },
    { name: "Video 2 (v2)", description: "Video 2 technician" },
    { name: "Video Tech", description: "Video technician" },
    { name: "Wardrobe", description: "Wardrobe specialist" },
    { name: "Weight Rail", description: "Weight rail operator" },
    { name: "Wig", description: "Wig specialist" },
    { name: "Working Steward", description: "Working steward" },
];

/**
 * Seed Work Types
 */
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

export async function seedStaffData() {
    console.log("🌱 Seeding Staff Positions and Work Types...");

    try {
        // Seed Staff Positions
        console.log("  📋 Creating Staff Positions...");
        for (const position of staffPositions) {
            await prisma.staffPosition.upsert({
                where: { name: position.name },
                update: {},
                create: position,
            });
        }
        console.log(`  ✅ Created/Updated ${staffPositions.length} staff positions`);

        // Seed Work Types
        console.log("  💼 Creating Work Types...");
        for (const workType of workTypes) {
            await prisma.workType.upsert({
                where: { name: workType.name },
                update: {},
                create: workType,
            });
        }
        console.log(`  ✅ Created ${workTypes.length} work types`);

        console.log("✅ Staff data seeding completed!");
    } catch (error) {
        console.error("❌ Error seeding staff data:", error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedStaffData()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
            await pool.end();
        });
}
