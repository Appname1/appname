export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="w-8 h-8 border-2 border-[#E4E2DA] border-t-[#B8860B] rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}