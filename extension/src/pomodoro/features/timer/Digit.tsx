const Digit: React.FC<{ count: number }> = ({ count }) => {
  const leftDigit = count >= 10 ? count.toString()[0] : '0'
  const rightDigit = count >= 10 ? count.toString()[1] : count.toString()
  return (
    <>
      <span className="inline-block w-4 text-center text-black-500">{leftDigit}</span>
      <span className="inline-block w-4 text-center text-black-500">{rightDigit}</span>
    </>
  )
}

export default Digit
