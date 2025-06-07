import SupabaseTest from "@/components/debug/supabase-test"

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Debug & Testing</h1>
        <p className="text-gray-600">Test your Supabase connection and verify that everything is working correctly.</p>
      </div>

      <SupabaseTest />
    </div>
  )
}
