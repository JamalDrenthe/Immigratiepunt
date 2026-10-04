import type { IncomingMessage, ServerResponse } from "node:http";
import { insertHelperSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

type VercelRequest = IncomingMessage & {
  body?: unknown;
  method?: string;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

let nextHelperId = 1;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const data = insertHelperSchema.parse(req.body);
    const helper = {
      id: nextHelperId++,
      ...data,
      monthlyDonation: data.monthlyDonation ?? false,
      createdAt: new Date(),
    };

    return res.status(201).json({ success: true, data: helper });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: fromZodError(error).message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
}
