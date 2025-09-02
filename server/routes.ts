import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Static file serving for actions.json is handled by the default static middleware
  // No additional routes needed for this MVP as we're using client-side data loading
  
  // Future API endpoints can be added here:
  // app.post('/api/update-status', async (req, res) => {
  //   // Handle status updates when backend integration is ready
  // });

  const httpServer = createServer(app);
  return httpServer;
}
