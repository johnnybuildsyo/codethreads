import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure dotenv to look for .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'johnnybuildsyo';
const REPO_NAME = 'publicbuilders';
const OUTPUT_DIR = path.resolve('./_mocks');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'mockCommits.json');

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN is not set in the environment variables.');
  process.exit(1);
}

// Fetch basic commit data
const fetchCommits = async () => {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching commits: ${response.statusText}`);
  }

  const commits = await response.json();
  return commits.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: {
      name: commit.commit.author.name,
      date: commit.commit.author.date,
    },
    files: [], // Placeholder for detailed file changes
  }));
};

// Fetch detailed commit data, including file changes
const fetchCommitDetails = async (sha) => {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching commit details: ${response.statusText}`);
  }

  const commit = await response.json();
  return {
    files: commit.files.map(file => ({
      filename: file.filename,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch || '',
    })),
  };
};

// Save the detailed commits to a JSON file
const saveToFile = (data) => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Mock data saved to ${OUTPUT_FILE}`);
};

// Main function to fetch commits and details
const main = async () => {
  try {
    const commits = await fetchCommits();

    // Fetch detailed file changes for each commit
    const detailedCommits = await Promise.all(
      commits.map(async (commit) => {
        const details = await fetchCommitDetails(commit.sha);
        return { ...commit, ...details };
      })
    );

    // Save the detailed commits to a file
    saveToFile(detailedCommits);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

main();
