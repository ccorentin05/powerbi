import { fabricIcons, type FabricIconName } from '../assets/fabric-icons'

interface FabricIconProps {
  name: FabricIconName
  size?: number
  className?: string
  alt?: string
}

export default function FabricIcon({ name, size = 24, className = '', alt }: FabricIconProps) {
  return (
    <img
      src={fabricIcons[name]}
      alt={alt ?? name}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block' }}
    />
  )
}
