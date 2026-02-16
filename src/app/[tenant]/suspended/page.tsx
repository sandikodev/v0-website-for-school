import { Ban } from "lucide-react";
import { headers } from "next/headers";

export default async function TenantSuspendedPage() {
  const headersList = await headers();
  const tenantName = headersList.get("x-tenant-name") || "This site";
  const reason = headersList.get("x-tenant-status-reason");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Ban className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Site Suspended
          </h1>
          <p className="text-lg text-gray-600">
            {tenantName} is temporarily unavailable
          </p>
        </div>

        {reason && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Reason:</span> {reason}
            </p>
          </div>
        )}

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            This site has been temporarily suspended by the administrator.
          </p>
          <p>
            If you are the site owner, please contact support for more information.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="mailto:support@aksesekolah.id"
            className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
