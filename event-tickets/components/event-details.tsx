import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventDetailsProps {
  event: {
    id: string
    name: string
    description: string
    longDescription?: string
    lineup?: string[]
    schedule?: { time: string; activity: string }[]
  }
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-4 bg-purple-100">
        <TabsTrigger value="about" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          Acerca de
        </TabsTrigger>
        {event.lineup && (
          <TabsTrigger value="lineup" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Artistas
          </TabsTrigger>
        )}
        {event.schedule && (
          <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Horario
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="about" className="space-y-4">
        <div className="prose max-w-none text-gray-700">
          <p>{event.longDescription || event.description}</p>
        </div>
      </TabsContent>

      {event.lineup && (
        <TabsContent value="lineup" className="space-y-4">
          <ul className="space-y-2">
            {event.lineup.map((artist, index) => (
              <li key={index} className="p-3 bg-purple-50 rounded-md border border-purple-100 text-gray-700">
                {artist}
              </li>
            ))}
          </ul>
        </TabsContent>
      )}

      {event.schedule && (
        <TabsContent value="schedule" className="space-y-4">
          <ul className="space-y-2">
            {event.schedule.map((item, index) => (
              <li
                key={index}
                className="p-3 bg-purple-50 rounded-md border border-purple-100 flex justify-between text-gray-700"
              >
                <span className="font-medium">{item.time}</span>
                <span>{item.activity}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      )}
    </Tabs>
  )
}
