-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "emergencyNumber" TEXT NOT NULL DEFAULT '12345',
    "hotlineNumber" TEXT NOT NULL DEFAULT '+20 3 1234 5678',
    "whatsappNumber" TEXT,
    "addressEn" TEXT NOT NULL DEFAULT '',
    "addressAr" TEXT NOT NULL DEFAULT '',
    "workingHoursEn" TEXT NOT NULL DEFAULT '',
    "workingHoursAr" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT,
    "patientRightsEn" TEXT NOT NULL DEFAULT '',
    "patientRightsAr" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
