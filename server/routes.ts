import type { Express } from "express";
import { createServer, type Server } from "http";
import { google } from 'googleapis';
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch data from Google Sheets
  app.get('/api/actions', async (req, res) => {
    try {
      const data = await loadActionsFromGoogleSheets();
      res.json(data);
    } catch (error) {
      console.error('Error loading from Google Sheets:', error);
      // Fallback to static data if Google Sheets fails
      try {
        const fs = await import('fs');
        const path = await import('path');
        const staticData = JSON.parse(
          fs.readFileSync(
            path.resolve(process.cwd(), 'public', 'actions.json'),
            'utf-8'
          )
        );
        res.json(staticData);
      } catch (fallbackError) {
        res.status(500).json({ error: 'Failed to load actions data' });
      }
    }
  });

  // Future endpoint for status updates
  app.post('/api/update-status', async (req, res) => {
    const { actionId, newStatus } = req.body;
    
    try {
      // TODO: Update status in Google Sheets
      console.log(`Update status for ${actionId} to ${newStatus}`);
      res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function loadActionsFromGoogleSheets() {
  // Check if Google Sheets credentials are available
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  
  console.log('Checking environment variables:');
  console.log('API Key exists:', !!apiKey);
  console.log('Sheet ID exists:', !!sheetId);
  console.log('Sheet ID value:', sheetId);
  
  if (!apiKey || !sheetId) {
    throw new Error('Google Sheets credentials not configured');
  }

  const sheets = google.sheets({ version: 'v4', auth: apiKey });
  
  try {
    console.log('Making request to Google Sheets with ID:', sheetId);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Actions!A:O', // Adjust range based on your sheet structure
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in Google Sheets');
    }

    // First row should be headers
    const headers = rows[0];
    const actions = [];

    // Process each data row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const action: any = {};
      
      // Map columns to action properties
      headers.forEach((header: string, index: number) => {
        const value = row[index] || '';
        
        switch (header.toLowerCase()) {
          case 'id':
            action.id = value;
            break;
          case 'city':
            action.city = value;
            break;
          case 'country':
            action.country = value;
            break;
          case 'actionname':
            action.actionName = value;
            break;
          case 'category':
            action.category = value;
            break;
          case 'sector':
            action.sector = value;
            break;
          case 'costtier':
            action.costTier = value;
            break;
          case 'investmentusd':
            action.investmentUSD = value ? parseInt(value) : undefined;
            break;
          case 'status':
            action.status = value;
            break;
          case 'reductionpotentialpct':
            action.reductionPotentialPct = value || undefined;
            break;
          case 'implementationtimeyears':
            action.implementationTimeYears = value || undefined;
            break;
          case 'description':
            action.description = value;
            break;
          case 'owner':
            action.owner = value || undefined;
            break;
          case 'lastupdated':
            action.lastUpdated = value;
            break;
          case 'tags':
            action.tags = value ? value.split(';').map((tag: string) => tag.trim()) : undefined;
            break;
        }
      });
      
      if (action.id) {
        actions.push(action);
      }
    }

    return actions;
  } catch (error) {
    console.error('Google Sheets API error:', error);
    throw error;
  }
}
