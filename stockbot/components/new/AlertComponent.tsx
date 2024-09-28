'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AlertComponent = ({ alerts }) => {
  if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={alert.type}>
          <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export default AlertComponent