import type { IncomingMessage, ServerResponse } from "node:http";
import { insertRegistrationSchema } from "@shared/schema";
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

let nextRegistrationId = 1;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const data = insertRegistrationSchema.parse(req.body);
    const registration = {
      id: nextRegistrationId++,
      ...data,
      bankingAssistance: data.bankingAssistance ?? false,
      housingSupport: data.housingSupport ?? false,
      employmentAssistance: data.employmentAssistance ?? false,
      administrativeSupport: data.administrativeSupport ?? false,
      createdAt: new Date(),
    };

    return res.status(201).json({ success: true, data: registration });
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
