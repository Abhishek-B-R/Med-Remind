export default interface HistoryEntry {
  id: string
  medicine: string
  time: string
  date: string
  status: "pending" | "taken" | "missed" | "scheduled"
  notes?: string
  actualTakenTime?: string
}
