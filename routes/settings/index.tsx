import * as React from 'react';
import { useState } from 'react';
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Smartphone, 
  Mail, 
  Moon, 
  Sun, 
  Monitor,
  Laptop,
  Check,
  LogOut
} from 'lucide-react';
import { useAppStore } from '../../store';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Button, 
  Input, 
  Label, 
  Textarea, 
  Switch, 
  Avatar, 
  cn, 
  Select,
  Badge
} from '../../components/ui';

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'security';

// --- Sub-components for each section ---

const AccountSettings = () => {
  const { user } = useAppStore();
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <Card className="dark:bg-card dark:border-slate-700/50">
          <CardHeader>
             <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
                <Avatar 
                   src={user?.avatarUrl} 
                   fallback={user?.name?.charAt(0) || 'U'} 
                   className="h-20 w-20 text-xl border-4 border-slate-50 dark:border-slate-800" 
                />
                <div className="space-y-2">
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">Remove</Button>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-slate-400">JPG, GIF or PNG. Max size of 800K.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label htmlFor="name">Full Name</Label>
                   <Input id="name" defaultValue={user?.name || ''} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="email">Email Address</Label>
                   <Input id="email" defaultValue={user?.email || ''} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="role">Role</Label>
                   <Input id="role" defaultValue={user?.role || ''} disabled className="bg-slate-50 dark:bg-slate-900/50 opacity-70" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="phone">Phone Number</Label>
                   <Input id="phone" placeholder="+1 (555) 000-0000" />
                </div>
             </div>

             <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us a little about yourself..." className="resize-none" rows={4} />
                <p className="text-xs text-slate-500">Brief description for your profile. URLs are hyperlinked.</p>
             </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
             <Button>Save Changes</Button>
          </CardFooter>
       </Card>

       <Card className="border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
             <CardTitle className="text-red-700 dark:text-red-400">Delete Account</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                Permanently remove your Personal Account and all of its contents from the Nexus platform. This action is not reversible, so please continue with caution.
             </p>
             <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Personal Account</Button>
          </CardContent>
       </Card>
    </div>
  );
};

const AppearanceSettings = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <Card className="dark:bg-card dark:border-slate-700/50">
          <CardHeader>
             <CardTitle>Theme Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label>Interface Theme</Label>
                <div className="grid grid-cols-3 gap-4 pt-2">
                   <div 
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all",
                        theme === 'light' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700"
                      )}
                      onClick={() => theme !== 'light' && toggleTheme()}
                   >
                      <div className="space-y-2 rounded-md bg-[#f8fafc] p-2">
                         <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#e2e8f0]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#e2e8f0]" />
                         </div>
                         <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#e2e8f0]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#e2e8f0]" />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 p-2">
                         <Sun className="h-4 w-4 text-slate-900 dark:text-white" />
                         <span className="text-sm font-medium text-slate-900 dark:text-white">Light Mode</span>
                      </div>
                   </div>

                   <div 
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all",
                        theme === 'dark' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700"
                      )}
                      onClick={() => theme !== 'dark' && toggleTheme()}
                   >
                      <div className="space-y-2 rounded-md bg-[#000000] p-2 border border-white/10">
                         <div className="space-y-2 rounded-md bg-[#09090b] p-2 border border-white/10">
                            <div className="h-2 w-[80px] rounded-lg bg-white/20" />
                            <div className="h-2 w-[100px] rounded-lg bg-white/20" />
                         </div>
                         <div className="flex items-center space-x-2 rounded-md bg-[#09090b] p-2 border border-white/10">
                            <div className="h-4 w-4 rounded-full bg-white/20" />
                            <div className="h-2 w-[100px] rounded-lg bg-white/20" />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 p-2">
                         <Moon className="h-4 w-4 text-slate-900 dark:text-white" />
                         <span className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</span>
                      </div>
                   </div>

                   <div className="cursor-not-allowed opacity-50 rounded-lg border-2 border-slate-200 dark:border-slate-700 p-1">
                      <div className="space-y-2 rounded-md bg-slate-200 dark:bg-slate-800 p-2">
                         <div className="h-20 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-600" />
                      </div>
                      <div className="flex items-center gap-2 p-2">
                         <Monitor className="h-4 w-4 text-slate-900 dark:text-white" />
                         <span className="text-sm font-medium text-slate-900 dark:text-white">System</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                      <Label className="text-base">Reduced Motion</Label>
                      <p className="text-xs text-slate-500">Minimize animations throughout the application.</p>
                   </div>
                   <Switch checked={false} onCheckedChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-xs text-slate-500">Increase information density on lists and tables.</p>
                   </div>
                   <Switch checked={false} onCheckedChange={() => {}} />
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <Card className="dark:bg-card dark:border-slate-700/50">
          <CardHeader>
             <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                   <Mail className="h-4 w-4" /> Email Notifications
                </h3>
                <div className="grid gap-4 pl-6">
                   <div className="flex items-center justify-between">
                      <Label className="font-normal" htmlFor="email-security">Security alerts</Label>
                      <Switch id="email-security" checked={true} onCheckedChange={() => {}} />
                   </div>
                   <div className="flex items-center justify-between">
                      <Label className="font-normal" htmlFor="email-tickets">New ticket assignments</Label>
                      <Switch id="email-tickets" checked={true} onCheckedChange={() => {}} />
                   </div>
                   <div className="flex items-center justify-between">
                      <Label className="font-normal" htmlFor="email-marketing">Marketing & Updates</Label>
                      <Switch id="email-marketing" checked={false} onCheckedChange={() => {}} />
                   </div>
                </div>
             </div>

             <div className="h-px bg-slate-100 dark:bg-slate-800" />

             <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                   <Smartphone className="h-4 w-4" /> Push Notifications
                </h3>
                <div className="grid gap-4 pl-6">
                   <div className="flex items-center justify-between">
                      <Label className="font-normal" htmlFor="push-mentions">Mentions and comments</Label>
                      <Switch id="push-mentions" checked={true} onCheckedChange={() => {}} />
                   </div>
                   <div className="flex items-center justify-between">
                      <Label className="font-normal" htmlFor="push-reminders">Ticket reminders</Label>
                      <Switch id="push-reminders" checked={true} onCheckedChange={() => {}} />
                   </div>
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  );
};

const SecuritySettings = () => {
   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <Card className="dark:bg-card dark:border-slate-700/50">
            <CardHeader>
               <CardTitle>Password & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label>Change Password</Label>
                  <Input type="password" placeholder="Current Password" />
                  <Input type="password" placeholder="New Password" />
                  <Input type="password" placeholder="Confirm New Password" />
                  <Button className="mt-2" variant="outline">Update Password</Button>
               </div>

               <div className="h-px bg-slate-100 dark:bg-slate-800" />

               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-base">Two-Factor Authentication</Label>
                     <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
               </div>
            </CardContent>
         </Card>

         <Card className="dark:bg-card dark:border-slate-700/50">
            <CardHeader>
               <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                     <div className="flex items-center gap-3">
                        <Laptop className="h-8 w-8 text-slate-400" />
                        <div>
                           <p className="text-sm font-medium text-slate-900 dark:text-white">Windows 11 - Chrome</p>
                           <p className="text-xs text-slate-500">New York, USA • Active now</p>
                        </div>
                     </div>
                     <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg opacity-60">
                     <div className="flex items-center gap-3">
                        <Smartphone className="h-8 w-8 text-slate-400" />
                        <div>
                           <p className="text-sm font-medium text-slate-900 dark:text-white">iPhone 14 - Safari</p>
                           <p className="text-xs text-slate-500">New York, USA • 2 hours ago</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm"><LogOut className="h-4 w-4" /></Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

// --- Main Settings Page ---
export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="md:w-64 shrink-0">
           <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={cn(
                       "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all",
                       activeTab === item.id 
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-white" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                 >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                 </button>
              ))}
           </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
           {activeTab === 'account' && <AccountSettings />}
           {activeTab === 'appearance' && <AppearanceSettings />}
           {activeTab === 'notifications' && <NotificationSettings />}
           {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};