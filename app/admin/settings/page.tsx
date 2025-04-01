"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useSettings } from "@/contexts/settings-context"
import { updateSettingsSection } from "@/services/settings-service"
import { ColorPicker } from "@/components/ui/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimatedLogo from "@/components/AnimatedLogo"
import SiteLogo from "@/components/site-logo"

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, refreshSettings } = useSettings()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // Local state for each settings section
  const [generalSettings, setGeneralSettings] = useState(settings.general)
  const [appearanceSettings, setAppearanceSettings] = useState(settings.appearance)
  const [serviceSettings, setServiceSettings] = useState(settings.services)
  const [notificationSettings, setNotificationSettings] = useState(settings.notifications)
  const [moderationSettings, setModerationSettings] = useState(settings.moderation)
  const [seoSettings, setSeoSettings] = useState(settings.seo)

  // Update local state when settings change
  useEffect(() => {
    setGeneralSettings(settings.general)
    setAppearanceSettings(settings.appearance)
    setServiceSettings(settings.services)
    setNotificationSettings(settings.notifications)
    setModerationSettings(settings.moderation)
    setSeoSettings(settings.seo)
  }, [settings])

  // Generic change handlers
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAppearanceSelectChange = (name: string, value: string) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAppearanceSwitchChange = (name: string, checked: boolean) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setServiceSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleModerationChange = (name: string, value: any) => {
    setModerationSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSeoSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Save settings based on active tab
  const handleSaveSettings = async () => {
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      let success = false

      switch (activeTab) {
        case "general":
          success = await updateSettingsSection("general", generalSettings)
          break
        case "appearance":
          success = await updateSettingsSection("appearance", appearanceSettings)
          break
        case "services":
          success = await updateSettingsSection("services", serviceSettings)
          break
        case "notifications":
          success = await updateSettingsSection("notifications", notificationSettings)
          break
        case "moderation":
          success = await updateSettingsSection("moderation", moderationSettings)
          break
        case "seo":
          success = await updateSettingsSection("seo", seoSettings)
          break
        default:
          break
      }

      if (success) {
        await refreshSettings()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError("Failed to save settings")
      }
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Configure your website settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshSettings} className="border-amber-200">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="services">Service Times</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your website's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  name="logoText"
                  value={generalSettings.logoText}
                  onChange={handleGeneralChange}
                  className="border-amber-200"
                />
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">Logo Preview:</p>
                  <SiteLogo size="md" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  className="min-h-[100px] border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={generalSettings.phoneNumber}
                  onChange={handleGeneralChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  className="min-h-[80px] border-amber-200"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker
                  label="Primary Color"
                  value={appearanceSettings.primaryColor}
                  onChange={(value) => handleAppearanceSelectChange("primaryColor", value)}
                />

                <ColorPicker
                  label="Secondary Color"
                  value={appearanceSettings.secondaryColor}
                  onChange={(value) => handleAppearanceSelectChange("secondaryColor", value)}
                />

                <ColorPicker
                  label="Accent Color"
                  value={appearanceSettings.accentColor}
                  onChange={(value) => handleAppearanceSelectChange("accentColor", value)}
                />

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={appearanceSettings.fontFamily}
                    onValueChange={(value) => handleAppearanceSelectChange("fontFamily", value)}
                  >
                    <SelectTrigger className="border-amber-200">
                      <SelectValue placeholder="Select a font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                      <SelectItem value="'Merriweather', serif">Merriweather</SelectItem>
                      <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                      <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableDarkMode">Enable Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch to dark mode</p>
                </div>
                <Switch
                  id="enableDarkMode"
                  checked={appearanceSettings.enableDarkMode}
                  onCheckedChange={(checked) => handleAppearanceSwitchChange("enableDarkMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  name="customCss"
                  value={appearanceSettings.customCss}
                  onChange={handleAppearanceChange}
                  className="min-h-[150px] font-mono text-sm border-amber-200"
                  placeholder=":root { /* Custom CSS variables */ }"
                />
                <p className="text-xs text-muted-foreground">
                  Add custom CSS to override default styles. Changes will be applied immediately.
                </p>
              </div>

              <div className="p-4 border rounded-md border-amber-200">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">Site Logo</p>
                    <SiteLogo size="lg" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">Animated Logo</p>
                    <AnimatedLogo />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Service Times Tab */}
        <TabsContent value="services">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Service Times</CardTitle>
              <CardDescription>Configure your church service schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sundayService1">Sunday Service 1</Label>
                <Input
                  id="sundayService1"
                  name="sundayService1"
                  value={serviceSettings.sundayService1}
                  onChange={handleServiceChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sundayService2">Sunday Service 2</Label>
                <Input
                  id="sundayService2"
                  name="sundayService2"
                  value={serviceSettings.sundayService2}
                  onChange={handleServiceChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wednesdayBible">Wednesday Bible Study</Label>
                <Input
                  id="wednesdayBible"
                  name="wednesdayBible"
                  value={serviceSettings.wednesdayBible}
                  onChange={handleServiceChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youthGroup">Youth Group</Label>
                <Input
                  id="youthGroup"
                  name="youthGroup"
                  value={serviceSettings.youthGroup}
                  onChange={handleServiceChange}
                  className="border-amber-200"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={notificationSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("enableEmailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePrayerAlerts">Prayer Request Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new prayer requests</p>
                </div>
                <Switch
                  id="enablePrayerAlerts"
                  checked={notificationSettings.enablePrayerAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("enablePrayerAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEventReminders">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders for upcoming events</p>
                </div>
                <Switch
                  id="enableEventReminders"
                  checked={notificationSettings.enableEventReminders}
                  onCheckedChange={(checked) => handleNotificationChange("enableEventReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableNewDevotionalAlerts">New Devotional Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when new devotionals are published
                  </p>
                </div>
                <Switch
                  id="enableNewDevotionalAlerts"
                  checked={notificationSettings.enableNewDevotionalAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("enableNewDevotionalAlerts", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Configure content moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireApprovalForPrayerRequests">Approve Prayer Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval before prayer requests are published
                  </p>
                </div>
                <Switch
                  id="requireApprovalForPrayerRequests"
                  checked={moderationSettings.requireApprovalForPrayerRequests}
                  onCheckedChange={(checked) => handleModerationChange("requireApprovalForPrayerRequests", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireApprovalForComments">Approve Comments</Label>
                  <p className="text-sm text-muted-foreground">Require admin approval before comments are published</p>
                </div>
                <Switch
                  id="requireApprovalForComments"
                  checked={moderationSettings.requireApprovalForComments}
                  onCheckedChange={(checked) => handleModerationChange("requireApprovalForComments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableProfanityFilter">Profanity Filter</Label>
                  <p className="text-sm text-muted-foreground">Automatically filter inappropriate language</p>
                </div>
                <Switch
                  id="enableProfanityFilter"
                  checked={moderationSettings.enableProfanityFilter}
                  onCheckedChange={(checked) => handleModerationChange("enableProfanityFilter", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictedWords">Restricted Words</Label>
                <Textarea
                  id="restrictedWords"
                  value={moderationSettings.restrictedWords.join(", ")}
                  onChange={(e) =>
                    handleModerationChange(
                      "restrictedWords",
                      e.target.value.split(",").map((word) => word.trim()),
                    )
                  }
                  className="min-h-[100px] border-amber-200"
                  placeholder="Enter comma-separated words to restrict"
                />
                <p className="text-xs text-muted-foreground">Enter words to be filtered, separated by commas</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoDeleteReportedContent">Auto-Delete Reported Content</Label>
                  <p className="text-sm text-muted-foreground">Automatically delete content after multiple reports</p>
                </div>
                <Switch
                  id="autoDeleteReportedContent"
                  checked={moderationSettings.autoDeleteReportedContent}
                  onCheckedChange={(checked) => handleModerationChange("autoDeleteReportedContent", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure search engine optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={handleSeoChange}
                  className="border-amber-200"
                />
                <p className="text-xs text-muted-foreground">
                  The title that appears in search engine results (50-60 characters recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={handleSeoChange}
                  className="min-h-[100px] border-amber-200"
                />
                <p className="text-xs text-muted-foreground">
                  The description that appears in search engine results (150-160 characters recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Social Media Image URL</Label>
                <Input
                  id="ogImage"
                  name="ogImage"
                  value={seoSettings.ogImage}
                  onChange={handleSeoChange}
                  className="border-amber-200"
                />
                <p className="text-xs text-muted-foreground">
                  The image that appears when your site is shared on social media (1200x630 pixels recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  name="twitterHandle"
                  value={seoSettings.twitterHandle}
                  onChange={handleSeoChange}
                  className="border-amber-200"
                />
                <p className="text-xs text-muted-foreground">Your Twitter handle (e.g., @faithcommunity)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

