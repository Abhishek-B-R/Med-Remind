export default interface Reminder {
  id: string
  medicine: string
  time: string | null
  date: string | null
  status: string
  description?: string
  notes?: string
}
