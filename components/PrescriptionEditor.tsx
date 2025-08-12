'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Medicine {
  nameOfMedicine: string
  noOfTablets: number
  whenToTake: number[] // [morning, afternoon, evening] as 1 or 0
  notes?: string // New field for side effects/notes
}

export default function PrescriptionEditor({
  medicines,
  onSave,
}: {
  medicines: Medicine[]
  onSave: (medicines: Medicine[]) => void
}) {
  const [editedMedicines, setEditedMedicines] = useState(medicines)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMedicine = (index: number, field: string, value: any) => {
    const updated = [...editedMedicines]
    updated[index] = { ...updated[index], [field]: value }
    setEditedMedicines(updated)
  }

  const removeMedicine = (index: number) => {
    const updated = editedMedicines.filter((_, i) => i !== index)
    setEditedMedicines(updated)
  }

  const addMedicine = () => {
    setEditedMedicines([
      ...editedMedicines,
      {
        nameOfMedicine: '',
        noOfTablets: 1,
        whenToTake: [1, 0, 0], // Default to morning only
        notes: '',
      },
    ])
  }

  return (
    <div className="space-y-4">
      {editedMedicines.map((medicine, index) => (
        <Card key={index} className="p-4 dark:bg-gray-900 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Medicine {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeMedicine(index)}
                className="dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Remove
              </Button>
            </div>
            <Input
              value={medicine.nameOfMedicine}
              onChange={(e) => updateMedicine(index, 'nameOfMedicine', e.target.value)}
              placeholder="Medicine name"
              className="dark:bg-gray-950 dark:border-gray-700"
            />
            <Input
              type="number"
              min="1"
              value={medicine.noOfTablets}
              onChange={(e) =>
                updateMedicine(index, 'noOfTablets', Number.parseInt(e.target.value) || 1)
              }
              placeholder="Number of tablets"
              className="dark:bg-gray-950 dark:border-gray-700"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">When to take:</p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[0] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[0] = e.target.checked ? 1 : 0
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Morning</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[1] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[1] = e.target.checked ? 1 : 0
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Afternoon</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[2] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[2] = e.target.checked ? 1 : 0
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Evening</span>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor={`notes-${index}`}>Side Effects/Notes</Label>
              <Input
                id={`notes-${index}`}
                value={medicine.notes || ''}
                onChange={(e) => updateMedicine(index, 'notes', e.target.value)}
                placeholder="e.g., Felt dizzy after this pill"
                className="dark:bg-gray-950 dark:border-gray-700"
              />
            </div>
          </div>
        </Card>
      ))}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={addMedicine}
          className="flex-1 bg-transparent dark:bg-gray-900 dark:hover:bg-gray-700"
        >
          Add Medicine
        </Button>
        <Button
          onClick={() => onSave(editedMedicines)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={editedMedicines.some((med) => !med.nameOfMedicine.trim())}
        >
          Create Calendar Reminders
        </Button>
      </div>
    </div>
  )
}
