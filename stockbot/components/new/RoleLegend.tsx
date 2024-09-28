'use client'

import React from 'react'

interface Role {
  name: string
  color: string
}

interface RoleLegendProps {
  roles: Role[]
  onSelectAgent: (agent: string) => void
}

interface RoleLegendProps {
  roles: Role[]
  onSelectAgent: (agent: string) => void
}

const RoleLegend: React.FC<RoleLegendProps> = ({ roles, onSelectAgent }) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Roles</h3>
      <ul className="space-y-2">
        {roles.map((role) => (
          <li 
            key={role.name} 
            className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-muted-foreground/10`}
            onClick={() => onSelectAgent(role.name)}
          >
            <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: role.color }}></div>
            <span>{role.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoleLegend