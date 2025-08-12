export default interface Reminder {
  id: string
  medicine: string
  time: string
  status: "pending" | "taken" | "missed" | "scheduled"
  date: string
  description?: string
  notes?: string
}