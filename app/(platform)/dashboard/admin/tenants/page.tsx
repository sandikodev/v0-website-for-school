import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DomainCell } from "./domain-cell";
import { StatusCell } from "./status-cell";

export const dynamic = 'force-dynamic';

/**
 * Get tenant URL based on environment
 */
function getTenantUrl(slug: string, customDomain?: string | null): string {
  // Determine environment
  // Priority: NEXT_PUBLIC_PLATFORM_DOMAIN > NODE_ENV
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN;
  const nodeEnv = process.env.NODE_ENV;
  
  // Debug log (remove after testing)
  console.log('[getTenantUrl] Environment:', {
    platformDomain,
    nodeEnv,
    slug,
    customDomain,
  });
  
  // Determine if production
  const isProduction = nodeEnv === 'production' || (!platformDomain && nodeEnv !== 'development');
  
  // Use correct base domain
  const baseDomain = platformDomain || (isProduction ? 'aksesekolah.id' : 'aksesekolah.local');
  
  console.log('[getTenantUrl] Result:', {
    isProduction,
    baseDomain,
  });
  
  // If custom domain is set, use it
  if (customDomain) {
    const protocol = isProduction ? 'https' : 'http';
    const port = isProduction ? '' : ':3000';
    return `${protocol}://${customDomain}${port}`;
  }
  
  // Use subdomain based on environment
  const protocol = isProduction ? 'https' : 'http';
  const port = isProduction ? '' : ':3000';
  
  return `${protocol}://${slug}.${baseDomain}${port}`;
}

/**
 * Admin Tenants Page
 * 
 * Manage all schools in the platform
 */
export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
      isActive: true,
      status: true,
      statusReason: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schools</h2>
          <p className="text-sm text-muted-foreground">
            Manage all schools in the platform
          </p>
        </div>
        <Button>Add School</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools ({tenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.length === 0 ? (
              <p className="text-sm text-muted-foreground">No schools yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Domain</th>
                      <th className="text-left py-3 px-4 font-medium">Users</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((tenant: typeof tenants[0]) => (
                      <tr key={tenant.id} className="border-b border-border">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {tenant.slug}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <DomainCell url={getTenantUrl(tenant.slug, tenant.domain)} />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {tenant._count.users}
                        </td>
                        <td className="py-3 px-4">
                          <StatusCell 
                            tenantId={tenant.id}
                            currentStatus={tenant.status as "active" | "inactive" | "suspended" | "banned"}
                            statusReason={tenant.statusReason}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(tenant.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
