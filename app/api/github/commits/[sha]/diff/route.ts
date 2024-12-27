import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface GitHubFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sha: string }> }
) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.provider_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sha } = await context.params;
  const { searchParams } = new URL(request.url);
  const fullName = searchParams.get("repo");

  if (!fullName) {
    return NextResponse.json(
      { error: "Missing repository name" },
      { status: 400 }
    );
  }

  // Get commit details with files
  const response = await fetch(
    `https://api.github.com/repos/${fullName}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const commit = await response.json();

  // Return structured data for each file
  const files = (commit.files || []).map((file: GitHubFile) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    oldValue:
      file.status === "added"
        ? ""
        : file.patch
            ?.split("\n")
            .filter((line) => line.startsWith("-"))
            .map((line) => line.slice(1))
            .join("\n") || "",
    newValue:
      file.status === "removed"
        ? ""
        : file.patch
            ?.split("\n")
            .filter((line) => line.startsWith("+"))
            .map((line) => line.slice(1))
            .join("\n") || "",
  }));

  return NextResponse.json(files);
}
