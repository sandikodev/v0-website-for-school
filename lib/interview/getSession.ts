import { prisma } from "@/lib/prisma";

export async function getInterviewSessionById(sessionId: string) {
  if (!sessionId) return null;

  return prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      interviewType: {
        include: {
          defaultForm: {
            include: {
              sections: {
                orderBy: { position: "asc" },
                include: {
                  questions: {
                    orderBy: { position: "asc" },
                    include: {
                      options: {
                        orderBy: { position: "asc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      submission: {
        select: {
          id: true,
          registrationNumber: true,
          namaLengkap: true,
        },
      },
      result: true,
    },
  });
}


