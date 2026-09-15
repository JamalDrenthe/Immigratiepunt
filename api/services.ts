import type { IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & {
  method?: string;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const services = [
  {
    id: 1,
    name: "banking",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
    icon: "university",
  },
  {
    id: 2,
    name: "housing",
    imageUrl: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6",
    icon: "home",
  },
  {
    id: 3,
    name: "employment",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    icon: "briefcase",
  },
  {
    id: 4,
    name: "administrative",
    imageUrl: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91",
    icon: "file-text",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  return res.status(200).json({ success: true, data: services });
}
