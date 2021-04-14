interface TinkerConfig {
  connections: TinkerConnection[]
}

interface TinkerConnection {
  name: string
  command: string
}
