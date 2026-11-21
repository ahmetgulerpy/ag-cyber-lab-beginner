"use client";

import type { ComponentType } from "react";
import { VisualCIA, VisualATV, VisualRisk, VisualSurface, VisualVector, VisualExploit } from "./visuals-a";
import { VisualAuthFlow, VisualLeast, VisualDepth, VisualZeroTrust, VisualPolicy, VisualBehavior } from "./visuals-b";
import { LabCIA, LabATV, LabRisk, LabSurface } from "./labs-a";
import { LabVector, LabExploit, LabAuth, LabPrivilege } from "./labs-b";
import { LabDepth, LabZeroTrust, LabPolicy, LabPhishing } from "./labs-c";

export const VISUALS: Record<string, ComponentType> = {
  "cia-triad": VisualCIA,
  "asset-threat-vulnerability": VisualATV,
  "risk-yonetimi": VisualRisk,
  "attack-surface": VisualSurface,
  "attack-vector": VisualVector,
  "exploit-payload": VisualExploit,
  "authn-authz": VisualAuthFlow,
  "least-privilege": VisualLeast,
  "defense-in-depth": VisualDepth,
  "zero-trust": VisualZeroTrust,
  "security-policy": VisualPolicy,
  "security-awareness": VisualBehavior,
};

export const LABS: Record<string, ComponentType<{ onDone: () => void }>> = {
  "cia-triad": LabCIA,
  "asset-threat-vulnerability": LabATV,
  "risk-yonetimi": LabRisk,
  "attack-surface": LabSurface,
  "attack-vector": LabVector,
  "exploit-payload": LabExploit,
  "authn-authz": LabAuth,
  "least-privilege": LabPrivilege,
  "defense-in-depth": LabDepth,
  "zero-trust": LabZeroTrust,
  "security-policy": LabPolicy,
  "security-awareness": LabPhishing,
};
