import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  Footprints,
  Heart,
  Headphones,
  Layers,
  Shirt,
  Users,
  Wind,
  Zap,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  shirt: Shirt,
  zap: Zap,
  wind: Wind,
  layers: Layers,
  footprints: Footprints,
  bed: BedDouble,
  users: Users,
  heart: Heart,
  headphones: Headphones,
};

export function getServiceIcon(key: string): LucideIcon {
  return MAP[key] ?? Shirt;
}
