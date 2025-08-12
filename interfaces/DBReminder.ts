export default interface DbReminder {
  googleEventId: string
  status: string
  medicine?: {
    notes?: string | null
  }
}
