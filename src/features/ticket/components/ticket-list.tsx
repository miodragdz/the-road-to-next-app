// commented code is for fatching data on client side
// "use client";

import { getTickets } from "../queries/get-tickets";
import { TicketItem } from "./ticket-item";
import { Ticket } from ".prisma/generated/client";

const TicketList = async () => {
  const tickets = (await getTickets()) as Ticket[];
  // const [tickets, setTickets] = useState<Ticket[]>([]);

  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     const result = await getTickets();

  //     setTickets(result);
  //   };

  //   fetchTickets();
  // }, []);

  return (
    <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export { TicketList };
