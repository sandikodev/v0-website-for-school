import { XCircle } from "lucide-react";
import { headers } from "next/headers";

export default async function TenantBannedPage() {
  const headersList = await headers();
  const tenantName = headersList.get("x-tenant-name") || "This site";
  const reason = headersList.get("x-tenant-status-reason");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Site Banned
          </h1>
          <p className="text-lg text-gray-600">
            {tenantName} has been permanently disabled
          </p>
        </div>

        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Reason:</span> {reason}
            </p>
          </div>
        )}

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            This site has been permanently banned due to violations of our terms of service.
          </p>
          <p>
            If you believe this is an error, please contact our support team.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="mailto:support@aksesekolah.id"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
