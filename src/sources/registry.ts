export interface CompanySourceConfig {
  company_name: string;
  board_token: string;
}

// A small, hardcoded registry of Greenhouse company board tokens for testing
export const GREENHOUSE_BOARDS: CompanySourceConfig[] = [
  { company_name: "Figma", board_token: "figma" },
  { company_name: "Vercel", board_token: "vercel" }
];

// A small registry of Lever company board tokens for testing
export const LEVER_BOARDS: CompanySourceConfig[] = [
  { company_name: "Spotify", board_token: "spotify" },
  { company_name: "Lever", board_token: "lever" }
];

// A small registry of Ashby company board tokens for testing
export const ASHBY_BOARDS: CompanySourceConfig[] = [
  { company_name: "Notion", board_token: "notion" },
  { company_name: "Linear", board_token: "linear" },
  { company_name: "Ashby", board_token: "ashby" }
];
