interface textUpperCardProps {
  title: string
}
const TextUpperCard = ({ title }: textUpperCardProps) => {
  return <h2 className="mb-3 text-sm uppercase text-gray-400">{title}</h2>
}

export default TextUpperCard
