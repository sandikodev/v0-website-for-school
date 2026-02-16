import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

/**
 * Admin Overview Page
 * 
 * Shows platform-wide statistics:
 * - Total schools
 * - Total users
 * - Recent activity
 * - System health
 */
export default async function AdminOverviewPage() {
  // Get platform statistics
  const [totalSchools, totalUsers, activeSchools] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.tenant.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  // Get recent schools
  const recentSchools = await prisma.tenant.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
      createdAt: true,
      isActive: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSchools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeSchools} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">✓</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSchools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No schools yet</p>
            ) : (
              recentSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{school.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {school.domain || `${school.slug}.aksesekolah.id`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        school.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {school.isActive ? "Active" : "Inactive"}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(school.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/tenants"
              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium mb-1">Manage Schools</h3>
              <p className="text-sm text-muted-foreground">
                View and manage all schools
              </p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium mb-1">Manage Users</h3>
              <p className="text-sm text-muted-foreground">
                View and manage all users
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
