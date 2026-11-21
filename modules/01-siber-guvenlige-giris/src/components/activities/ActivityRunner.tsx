"use client";

import type { ActivityDef } from "@/content/types";
import { CareerActivity } from "./CareerActivity";
import { EcosystemActivity } from "./EcosystemActivity";
import { ExploreMatchActivity } from "./ExploreMatchActivity";
import { MatchActivity } from "./MatchActivity";
import { ScenarioActivity } from "./ScenarioActivity";
import { TimelineActivity } from "./TimelineActivity";

export function ActivityRunner({ activity, onComplete }: { activity: ActivityDef; onComplete: () => void }) {
  switch (activity.type) {
    case "match":
      return <MatchActivity def={activity} onComplete={onComplete} />;
    case "timeline":
      return <TimelineActivity def={activity} onComplete={onComplete} />;
    case "ecosystem":
      return <EcosystemActivity def={activity} onComplete={onComplete} />;
    case "scenario":
      return <ScenarioActivity def={activity} onComplete={onComplete} />;
    case "explore-match":
      return <ExploreMatchActivity def={activity} onComplete={onComplete} />;
    case "career":
      return <CareerActivity def={activity} onComplete={onComplete} />;
  }
}
