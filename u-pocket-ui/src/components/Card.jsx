import { cn } from "../utils"

export const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-primary-white rounded-2xl shadow-sm border border-gray-100 p-6", className)}>
      {children}
    </div>
  )
}
