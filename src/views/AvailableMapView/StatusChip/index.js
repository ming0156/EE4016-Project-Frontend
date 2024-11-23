import React from 'react'
const MACHINEID_COL = 1;

const StatusChip = ({bgColor, message, meta, openDialog, type, sx}) => {
  return (
    <div
        style={{
            height: '30px',
            width: '80px',
            backgroundColor: bgColor,
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
            borderRadius: '5px',
            cursor: 'pointer',
            ...sx
        }}
        onClick={() => {
          // console.log(meta)
            openDialog(meta?.rowData[MACHINEID_COL] ?? -1, type ?? '');
        }}
    >
        <p style={{ position: 'relative', bottom: '11px', color: 'white' , userSelect: 'none'}}>{message}</p>
    </div>
  )
}

export default StatusChip