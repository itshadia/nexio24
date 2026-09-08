-- ==============================================================================
-- 03_seed_data.sql
-- Insert Seed Knowledge Base SOPs, Sample Tickets, and Historical Runs
-- ==============================================================================

-- 1. Seed Knowledge Documents
INSERT INTO public.knowledge_documents (title, source, category, content)
VALUES
  (
    'Hotel FAQs',
    'sop',
    'FAQ',
    'Standard check-in begins at 3:00 PM. Check-out is strictly at 11:00 AM. Keyless mobile entry is supported via the Nexio app. Complimentary high-speed gigabit Wi-Fi 6 is available across all suites.'
  ),
  (
    'Booking & Cancellation Policy',
    'policy',
    'Policy',
    'Bookings can be modified or cancelled free of charge up to 24 hours prior to check-in. Cancellations made within 24 hours are subject to a 1-night charge. Refunds above $100 require operational manager review.'
  ),
  (
    'In-Room HVAC & Maintenance Guide',
    'manual',
    'Maintenance',
    'Error E-04 on suite thermostats signals a thermal relay switch lock. Engineering staff must be dispatched immediately with an SLA of under 15 minutes. Reset breaker on sub-panel 4B.'
  ),
  (
    'Executive Transportation SOP',
    'manual',
    'Services',
    'Private airport transfers are provided 24/7 with our electric executive fleet. Standard airport shuttle is $35 per trip and complimentary for guests in the Presidential Penthouse.'
  )
ON CONFLICT DO NOTHING;

-- 2. Seed Initial Operational Tickets
INSERT INTO public.tickets (ticket_number, channel, customer_name, customer_email, customer_room, subject, category, priority, status)
VALUES
  (
    'TICK-1245',
    'chat',
    'Hassan Raza',
    'hassan.raza@email.com',
    'Room 204',
    'AC not working in room 204',
    'maintenance',
    'high',
    'open'
  ),
  (
    'TICK-1244',
    'chat',
    'Sarah Ahmed',
    'sarah.ahmed@email.com',
    'Room 108',
    'Booking modification & date shift',
    'booking',
    'medium',
    'in_progress'
  ),
  (
    'TICK-1243',
    'chat',
    'Ali Khan',
    'ali.khan@email.com',
    'Deluxe Suite 312',
    'Room availability inquiry for next Friday',
    'booking',
    'low',
    'resolved'
  ),
  (
    'TICK-1242',
    'chat',
    'Zara Malik',
    'zara.malik@email.com',
    'Executive Suite 501',
    'Airport pickup service request',
    'general',
    'low',
    'resolved'
  ),
  (
    'TICK-1241',
    'email',
    'Sara Khan',
    'sara@example.com',
    'Room 108',
    'Refund request for delayed order ORD-10021',
    'refund',
    'high',
    'in_progress'
  )
ON CONFLICT (ticket_number) DO NOTHING;

