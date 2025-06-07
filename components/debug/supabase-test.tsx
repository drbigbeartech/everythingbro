"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Database, Wifi } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConnectionStatus {
  supabaseInstalled: boolean
  envVariables: boolean
  connection: "idle" | "testing" | "success" | "error"
  tables: "idle" | "checking" | "found" | "missing"
  auth: "idle" | "checking" | "working" | "error"
  error?: string
}

export default function SupabaseTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    supabaseInstalled: false,
    envVariables: false,
    connection: "idle",
    tables: "idle",
    auth: "idle",
  })

  useEffect(() => {
    checkSupabaseInstallation()
  }, [])

  const checkSupabaseInstallation = () => {
    // Check if Supabase is installed
    const supabaseInstalled = typeof supabase !== "undefined"

    // Check environment variables more thoroughly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("Environment check:", {
      url: supabaseUrl,
      keyExists: !!supabaseKey,
      keyLength: supabaseKey?.length,
    })

    const envVariables = !!(supabaseUrl && supabaseKey)

    setStatus((prev) => ({
      ...prev,
      supabaseInstalled,
      envVariables,
    }))

    if (supabaseInstalled && envVariables) {
      testConnection()
    }
  }

  const testConnection = async () => {
    setStatus((prev) => ({ ...prev, connection: "testing" }))

    try {
      // Test basic connection
      const { data, error } = await supabase.from("_supabase_migrations").select("*").limit(1)

      if (error && !error.message.includes("does not exist")) {
        throw error
      }

      setStatus((prev) => ({ ...prev, connection: "success" }))
      checkTables()
    } catch (error) {
      console.error("Connection test failed:", error)
      setStatus((prev) => ({
        ...prev,
        connection: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }

  const checkTables = async () => {
    setStatus((prev) => ({ ...prev, tables: "checking" }))

    try {
      // Check if our main tables exist
      const { data: productsData, error: productsError } = await supabase.from("products").select("id").limit(1)

      const { data: servicesData, error: servicesError } = await supabase.from("services").select("id").limit(1)

      const { data: usersData, error: usersError } = await supabase.from("users").select("id").limit(1)

      // If any table exists without error, we have tables
      const tablesExist = !productsError || !servicesError || !usersError

      setStatus((prev) => ({
        ...prev,
        tables: tablesExist ? "found" : "missing",
      }))

      checkAuth()
    } catch (error) {
      console.error("Table check failed:", error)
      setStatus((prev) => ({
        ...prev,
        tables: "missing",
      }))
      checkAuth()
    }
  }

  const checkAuth = async () => {
    setStatus((prev) => ({ ...prev, auth: "checking" }))

    try {
      // Test auth functionality
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setStatus((prev) => ({ ...prev, auth: "working" }))
    } catch (error) {
      console.error("Auth check failed:", error)
      setStatus((prev) => ({
        ...prev,
        auth: "error",
        error: error instanceof Error ? error.message : "Auth error",
      }))
    }
  }

  const getStatusIcon = (state: string) => {
    switch (state) {
      case "success":
      case "found":
      case "working":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
      case "missing":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "testing":
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "success":
      case "found":
      case "working":
        return <Badge className="bg-green-100 text-green-800">Working</Badge>
      case "error":
      case "missing":
        return <Badge variant="destructive">Error</Badge>
      case "testing":
      case "checking":
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Supabase Connection Test
          </CardTitle>
          <CardDescription>Checking if Supabase is properly installed and configured</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Check */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.supabaseInstalled ? "success" : "error")}
              <div>
                <p className="font-medium">Supabase Package</p>
                <p className="text-sm text-gray-600">@supabase/supabase-js installed</p>
              </div>
            </div>
            {getStatusBadge(status.supabaseInstalled ? "success" : "error")}
          </div>

          {/* Environment Variables Check */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.envVariables ? "success" : "error")}
              <div>
                <p className="font-medium">Environment Variables</p>
                <p className="text-sm text-gray-600">SUPABASE_URL and ANON_KEY configured</p>
              </div>
            </div>
            {getStatusBadge(status.envVariables ? "success" : "error")}
          </div>

          {/* Connection Test */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.connection)}
              <div>
                <p className="font-medium">Database Connection</p>
                <p className="text-sm text-gray-600">Can connect to Supabase instance</p>
              </div>
            </div>
            {getStatusBadge(status.connection)}
          </div>

          {/* Tables Check */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.tables)}
              <div>
                <p className="font-medium">Database Tables</p>
                <p className="text-sm text-gray-600">Required tables exist</p>
              </div>
            </div>
            {getStatusBadge(status.tables)}
          </div>

          {/* Auth Check */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.auth)}
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-gray-600">Auth service working</p>
              </div>
            </div>
            {getStatusBadge(status.auth)}
          </div>

          {/* Error Display */}
          {status.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {status.error}
              </p>
            </div>
          )}

          {/* Environment Info */}
          <div className="p-3 bg-gray-50 border rounded-lg">
            <p className="text-sm font-medium mb-2">Configuration Details:</p>
            <div className="space-y-1 text-xs font-mono">
              <p>
                <span className="text-gray-600">Supabase URL:</span>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
                  : "Not configured"}
              </p>
              <p>
                <span className="text-gray-600">Anon Key:</span>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30)}...`
                  : "Not configured"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={checkSupabaseInstallation} variant="outline" size="sm">
              <Wifi className="h-4 w-4 mr-2" />
              Retest Connection
            </Button>

            {status.tables === "missing" && (
              <Button asChild size="sm">
                <a href="/setup">Setup Database</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {status.connection === "success" && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test specific Supabase functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from("products").select("count").single()
                  alert(`Products query test: ${error ? error.message : "Success"}`)
                } catch (e) {
                  alert(`Products query test failed: ${e}`)
                }
              }}
            >
              Test Products Query
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from("services").select("count").single()
                  alert(`Services query test: ${error ? error.message : "Success"}`)
                } catch (e) {
                  alert(`Services query test failed: ${e}`)
                }
              }}
            >
              Test Services Query
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
