import { cn } from "../utils"

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-dark mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 bg-primary-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red transition-all",
          error && "border-primary-red focus:ring-primary-red",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-primary-red">{error}</p>}
    </div>
  )
}
