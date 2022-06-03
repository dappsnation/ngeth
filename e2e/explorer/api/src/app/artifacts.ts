import { ABIDescription } from "@type/solc";
import { Artifact } from "hardhat/types";

const artifacts: Record<string, Artifact> = {};

export function setArtifact(artifactList: Artifact | Artifact[]) {
  const list = (Array.isArray(artifactList)) ? artifactList : [artifactList];
  for (const artifact of list) {
    artifacts[artifact.contractName] = artifact;
  }
}

export function findABI(code: string): undefined | ABIDescription[] {
  return Object.values(artifacts).find(artifact => artifact.deployedBytecode === code)?.abi;
}