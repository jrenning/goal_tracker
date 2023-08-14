import React, { ReactNode } from 'react'


type EditableSectionProps = {
    children: ReactNode
    className: string
}

function EditableSection({children, className}: EditableSectionProps) {
  return (
    <div className={className} contentEditable={true}>
        {children}
    </div>
  )
}

export default EditableSection