import { prisma } from "@/lib/prisma";

export const getTickets = async () => {
  return await prisma.ticket.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// import { initialTickets } from "@/data";
// import { Ticket } from "../types";

// export const getTickets = async (): Promise<Ticket[]> => {
//   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay

//   // throw new Error("Failed to fetch tickets"); // Simulating an error

//   return new Promise((resolve) => {
//     resolve(initialTickets);
//   });

//   // Same as the commented code below, but using async/await syntax
//   //   return new Promise((resolve) => {
//   //     setTimeout(() => {
//   //       resolve(initialTickets);
//   //     }, 1000);
//   //   });
// };
