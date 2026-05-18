import { useState } from 'react'
import { AddTab } from './AdminAddTab'
import { PendingTab } from './AdminPendingTab'
import { EditTab } from './AdminEditTab'
import { InhalteTab } from './AdminInhalteTab'

interface Props {
  onClose: () => void
}

type Tab = 'pending' | 'add' | 'edit' | 'inhalte'

export function AdminOverlay({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('pending')

  const tabs: [Tab, string][] = [
    ['pending',  'Einreichungen'],
    ['add',      'Hinzufügen'],
    ['edit',     'Bearbeiten'],
    ['inhalte',  'Inhalte'],
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                tab === id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'pending'  && <PendingTab />}
        {tab === 'add'      && <AddTab />}
        {tab === 'edit'     && <EditTab />}
        {tab === 'inhalte'  && <InhalteTab />}

      </div>
    </div>
  )
}
