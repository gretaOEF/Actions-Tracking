#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvPath = path.join(process.cwd(), 'data', 'actions.csv');
const jsonPath = path.join(process.cwd(), 'public', 'actions.json');

try {
  // Read CSV file
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Transform records to match schema
  const actions = records.map(record => {
    const action = {
      id: record.id,
      city: record.city,
      country: record.country,
      actionName: record.actionName,
      category: record.category,
      sector: record.sector,
      costTier: record.costTier,
      status: record.status,
      description: record.description,
      lastUpdated: record.lastUpdated,
    };

    // Add optional fields if present
    if (record.investmentUSD && record.investmentUSD !== '') {
      action.investmentUSD = parseInt(record.investmentUSD, 10);
    }

    if (record.reductionPotentialPct && record.reductionPotentialPct !== '') {
      action.reductionPotentialPct = record.reductionPotentialPct;
    }

    if (record.implementationTimeYears && record.implementationTimeYears !== '') {
      action.implementationTimeYears = record.implementationTimeYears;
    }

    if (record.owner && record.owner !== '') {
      action.owner = record.owner;
    }

    if (record.tags && record.tags !== '') {
      action.tags = record.tags.split(';').map(tag => tag.trim());
    }

    return action;
  });

  // Ensure public directory exists
  const publicDir = path.dirname(jsonPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write JSON file
  fs.writeFileSync(jsonPath, JSON.stringify(actions, null, 2));
  
  console.log(`✅ Successfully converted ${records.length} actions from CSV to JSON`);
  console.log(`📁 Output: ${jsonPath}`);

} catch (error) {
  console.error('❌ Error building data:', error.message);
  process.exit(1);
}
