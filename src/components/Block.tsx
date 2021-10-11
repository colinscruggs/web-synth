const Block = (props: any) => {
  const { note, column, active, setActive } = props;
  return (
    <div 
      className={`${(active ? 'note-block-active ' : ' ')}` + 'note-block'}
      onClick={() => {setActive(column, note)}}
    >
      {note}
    </div>
  )
}

export default Block;