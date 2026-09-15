export interface ChatCardData {
  title: string;
  price: string;
  image: string;
  details: string;
  badge?: string;
  actionText?: string;
}

export interface MessageItem {
  id: string;
  sender: "user" | "agent" | "system";
  senderName?: string;
  timestamp: string;
  text: string;
  card?: ChatCardData;
  ticketId?: string;
  category?: "Booking" | "Maintenance" | "Refund" | "Support" | "General";
  priority?: "Low" | "Medium" | "High" | "Critical";
  status?: "Open" | "In Progress" | "Resolved" | "Escalated";
  approvalRequired?: boolean;
}

export const QUICK_PROMPTS = [
  "Check room availability for next Friday",
  "AC not working in room 204",
  "What is your cancellation and refund policy?",
  "Do you offer airport pickup service?",
  "What are your check-in timings?",
];

export function getAIResponse(userMessage: string): {
  replyText: string;
  card?: ChatCardData;
  ticketId?: string;
  category?: MessageItem["category"];
  priority?: MessageItem["priority"];
  status?: MessageItem["status"];
} {
  const lower = userMessage.toLowerCase();

  // 1. Room booking inquiry (Matches Screen 3 from user screenshot)
  if (
    lower.includes("book") ||
    lower.includes("availability") ||
    lower.includes("friday") ||
    lower.includes("room") && lower.includes("price")
  ) {
    return {
      replyText:
        "Yes! We have several luxury suites available for your dates. Here is our most popular option matching your preference:",
      category: "Booking",
      priority: "Medium",
      status: "In Progress",
      ticketId: "#1243",
      card: {
        title: "Deluxe Room",
        price: "$120/night",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
        details: "King bed · Free Wifi · Breakfast included",
        badge: "Available Now",
        actionText: "Reserve This Suite",
      },
    };
  }

  // 2. Room 204 AC Maintenance Issue (Matches Ticket #1245 from user screenshot)
  if (
    lower.includes("ac") ||
    lower.includes("air conditioning") ||
    lower.includes("not working") ||
    lower.includes("cooling") ||
    lower.includes("204") ||
    lower.includes("maintenance")
  ) {
    return {
      replyText:
        "I have immediately logged ticket #1245 for room 204 with our on-duty engineering team. A technician is being dispatched right now with an estimated arrival time of under 12 minutes. Would you like a chilled beverage sent up while you wait?",
      category: "Maintenance",
      priority: "High",
      status: "Open",
      ticketId: "#1245",
    };
  }

  // 3. Refund & Cancellation Policy
  if (
    lower.includes("refund") ||
    lower.includes("cancel") ||
    lower.includes("policy")
  ) {
    return {
      replyText:
        "According to our Nexio24 Hospitality Policy: Bookings can be modified or cancelled free of charge up to 24 hours prior to check-in. In case of emergency cancellations, refunds are processed within 3-5 business days. Would you like me to look up an existing booking ID for you?",
      category: "Refund",
      priority: "Medium",
      status: "Open",
      ticketId: "#1244",
    };
  }

  // 4. Airport Pickup & Valet (Matches Ticket #1242 from user screenshot)
  if (
    lower.includes("airport") ||
    lower.includes("pickup") ||
    lower.includes("transfer") ||
    lower.includes("car")
  ) {
    return {
      replyText:
        "We offer private executive airport transfers 24/7! Our chauffeur will greet you at arrivals with an electronic welcome sign. Please provide your flight number and arrival time to confirm the booking.",
      category: "Support",
      priority: "Low",
      status: "Open",
      ticketId: "#1242",
    };
  }

  // 5. Check-in & Check-out Timings
  if (
    lower.includes("check-in") ||
    lower.includes("check in") ||
    lower.includes("checkout") ||
    lower.includes("time")
  ) {
    return {
      replyText:
        "Standard check-in begins at 3:00 PM and check-out is at 11:00 AM. You can also use our keyless mobile check-in via the Nexio app anytime to skip the front desk entirely!",
      category: "General",
      priority: "Low",
      status: "Resolved",
    };
  }

  // Default intelligent assistant response
  return {
    replyText:
      "Thank you for contacting Nexio24 Guest Operations. I have registered your inquiry and our operations hub is standing by. How else may I assist you with your stay or technical needs?",
    category: "Support",
    priority: "Low",
    status: "Open",
    ticketId: `#${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

