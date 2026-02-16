import { z } from "zod";
import type { ConnectorDocument } from "../types";

export const ConnectorInputSchema = z.object({
  ticker: z.string(),
  companyName: z.string(),
  irUrls: z.array(z.string().url()).optional()
});

export type ConnectorInput = z.infer<typeof ConnectorInputSchema>;

export interface Connector {
  name: string;
  fetch(input: ConnectorInput): Promise<ConnectorDocument[]>;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
