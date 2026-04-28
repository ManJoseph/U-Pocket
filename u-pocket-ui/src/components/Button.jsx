import { cn } from "../utils"

export const Button = ({ className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-primary-red text-white hover:bg-opacity-90 active:scale-95",
    secondary: "bg-accent-yellow text-neutral-dark hover:bg-opacity-90 active:scale-95",
    outline: "border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white",
    ghost: "text-neutral-dark hover:bg-gray-100"
  }

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
