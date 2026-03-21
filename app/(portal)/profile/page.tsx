import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container max-w-md py-12">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, line_user_id, telegram_user_id, discord_user_id, roles")
    .eq("id", user.id)
    .single()

  const bindings = [
    { platform: "LINE", value: profile?.line_user_id },
    { platform: "Telegram", value: profile?.telegram_user_id },
    { platform: "Discord", value: profile?.discord_user_id },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{profile?.display_name ?? user.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Linked accounts</p>
          {bindings.map(({ platform, value }) => (
            <div key={platform} className="flex items-center justify-between">
              <span className="text-sm">{platform}</span>
              {value ? (
                <Badge variant="default">Linked</Badge>
              ) : (
                <Badge variant="outline">Not linked</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
