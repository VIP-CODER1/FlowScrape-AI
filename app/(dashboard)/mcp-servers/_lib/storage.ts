export type McpServerChain = {
  id: string;
  name: string;
  goals: string;
  steps: string[];
  preChecks: string[];
  createdAt: string;
};

export type McpServer = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  chains: McpServerChain[];
};

const STORAGE_KEY = 'flowscrape_mcp_servers_v1';

export function loadMcpServers(): McpServer[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as McpServer[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveMcpServers(servers: McpServer[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
}

export function createMcpServer(input: { name: string; description: string }): McpServer {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    description: input.description.trim(),
    createdAt: new Date().toISOString(),
    chains: [],
  };
}

export function findMcpServerById(id: string): McpServer | undefined {
  return loadMcpServers().find((server) => server.id === id);
}

export function upsertMcpServer(updatedServer: McpServer) {
  const allServers = loadMcpServers();
  const nextServers = allServers.some((server) => server.id === updatedServer.id)
    ? allServers.map((server) => (server.id === updatedServer.id ? updatedServer : server))
    : [updatedServer, ...allServers];

  saveMcpServers(nextServers);
}
