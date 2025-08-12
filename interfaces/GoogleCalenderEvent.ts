export default interface GoogleCalendarEvent {
  id: string
  summary?: string
  description?: string
  start: {
    dateTime: string
  }
  extendedProperties?: {
    private?: {
      medicineName?: string
      notes?: string
      medicineApp?: string
    }
  }
}