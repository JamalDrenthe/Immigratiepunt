import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post("/api/register", async (req, res) => {
    try {
      const data = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(data);
      return res.status(201).json({ success: true, data: registration });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred",
      });
    }
  });

  // Get all service types
  app.get("/api/services", async (_req, res) => {
    try {
      // This is just static data, could be expanded to be dynamic from database
      const services = [
        {
          id: 1,
          name: "banking",
          imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
          icon: "university"
        },
        {
          id: 2,
          name: "housing",
          imageUrl: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6",
          icon: "home"
        },
        {
          id: 3,
          name: "employment",
          imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
          icon: "briefcase"
        },
        {
          id: 4,
          name: "administrative",
          imageUrl: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91",
          icon: "file-text"
        }
      ];
      
      return res.status(200).json({ success: true, data: services });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
