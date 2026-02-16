import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

/**
 * Admin Settings Page
 * 
 * Platform settings and configuration
 */
export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Platform settings and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform Name</label>
              <input
                type="text"
                defaultValue="AkseSekolah.id"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Platform Domain</label>
              <input
                type="text"
                defaultValue="aksesekolah.id"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">SMTP Host</label>
              <input
                type="text"
                placeholder="smtp.example.com"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SMTP Port</label>
              <input
                type="text"
                placeholder="587"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-muted-foreground">
                  Auto logout after inactivity
                </div>
              </div>
              <select className="px-3 py-2 border border-border rounded-md">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
