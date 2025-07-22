import { initialTickets } from "@/data";
import { Ticket } from "../types";

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay

  return new Promise((resolve) => {
    resolve(initialTickets);
  });
  // Same as the commented code below, but using async/await syntax
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(initialTickets);
  //     }, 1000);
  //   });
};
