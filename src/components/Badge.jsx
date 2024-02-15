import React from 'react'

function Badge({text,colors}) {
  return (
    <span className={`p-1 text-xs font-bold rounded-lg ${colors}`}>
        {text}
    </span>
  )
}

export default Badge