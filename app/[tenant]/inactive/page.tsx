import { Pause } from "lucide-react";
import { headers } from "next/headers";

export default async function TenantInactivePage() {
  const headersList = await headers();
  const tenantName = headersList.get("x-tenant-name") || "This site";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Pause className="w-10 h-10 text-gray-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Site Inactive
          </h1>
          <p className="text-lg text-gray-600">
            {tenantName} is currently not active
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            This site is currently inactive and not accepting visitors.
          </p>
          <p>
            Please check back later or contact the site administrator.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
