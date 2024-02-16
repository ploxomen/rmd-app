import React from 'react'

function MainIntranet({page}) {
  return (
    <main className='px-6 pt-4 pb-4 overflow-y-auto' style={{"height":"calc(100dvh - 90px)"}}>
      {page}
    </main>
  )
}

export default MainIntranet