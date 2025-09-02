// This is a placeholder storage interface for future database integration
// Currently the app uses static JSON data from public/actions.json

export interface IStorage {
  // Future methods for climate actions can be added here
  // For now, the app loads data directly from the static JSON file
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage for future use
  }
}

export const storage = new MemStorage();
