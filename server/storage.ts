import { users, type User, type InsertUser, type Registration, type InsertRegistration } from "@shared/schema";
import { DatabaseStorage } from "./storage-db";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private registrations: Map<number, Registration>;
  currentId: number;
  currentRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.registrations = new Map();
    this.currentId = 1;
    this.currentRegistrationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    const createdAt = new Date();
    
    // Ensure all boolean fields have default values if undefined
    const registration: Registration = {
      id,
      firstName: insertRegistration.firstName,
      lastName: insertRegistration.lastName,
      email: insertRegistration.email,
      phone: insertRegistration.phone,
      countryOfOrigin: insertRegistration.countryOfOrigin,
      bankingAssistance: insertRegistration.bankingAssistance ?? false,
      housingSupport: insertRegistration.housingSupport ?? false,
      employmentAssistance: insertRegistration.employmentAssistance ?? false,
      administrativeSupport: insertRegistration.administrativeSupport ?? false,
      createdAt
    };
    
    this.registrations.set(id, registration);
    return registration;
  }
}

// Use MemStorage for easy local/demo use (no database required)
export const storage = new MemStorage();
