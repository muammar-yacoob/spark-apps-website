#!/bin/bash
#
# create-saas.sh -- scaffold a new SaaS project from the SparkStack boilerplate.
#
# Usage:
#   ./scripts/create-saas.sh
#   ./scripts/create-saas.sh my-app
#
# Creates ~/projects/<name>, copies the boilerplate, configures names/metadata,
# and prints remaining manual steps.

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
R="\e[31m" Y="\e[33m" G="\e[32m" C="\e[36m" W="\e[97m" DIM="\e[2m" B="\e[1m" X="\e[0m"

# ── Helpers ───────────────────────────────────────────────────────────────────
abort()   { echo -e "\n${Y}Aborted.${X}"; exit 0; }
confirm() { read -r -p "$1" A; [[ "$A" =~ ^[Yy]$ ]] || abort; }
ask()     { local prompt="$1" default="${2:-}"; read -r -p "$prompt" A; echo "${A:-$default}"; }

# ── Resolve boilerplate directory (follows symlinks) ─────────────────────────
SCRIPT_SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SCRIPT_SOURCE" ]; do
  SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
  SCRIPT_SOURCE="$(readlink "$SCRIPT_SOURCE")"
  [[ "$SCRIPT_SOURCE" != /* ]] && SCRIPT_SOURCE="$SCRIPT_DIR/$SCRIPT_SOURCE"
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
BOILERPLATE="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$BOILERPLATE/package.json" ]; then
  echo -e "${R}Error:${X} Cannot find SparkStack boilerplate at $BOILERPLATE"
  exit 1
fi

PROJECTS_DIR="$HOME/projects"

echo -e "\n${C}======================================${X}"
echo -e "${B}${W}  SparkStack -- New SaaS Project${X}"
echo -e "${C}======================================${X}\n"
echo -e "${DIM}Boilerplate:${X} $BOILERPLATE"
echo -e "${DIM}Target dir:${X}  $PROJECTS_DIR/<name>\n"

# ── Step 1: Gather project info ───────────────────────────────────────────────
echo -e "${C}Step 1:${X} ${W}Project details${X}\n"

NAME="${1:-}"
if [ -z "$NAME" ]; then
  NAME=$(ask "  Project name (kebab-case, e.g. my-cool-app): ")
fi
NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')

if [ -z "$NAME" ]; then
  echo -e "${R}Error:${X} Project name cannot be empty."
  exit 1
fi

DEST="$PROJECTS_DIR/$NAME"

if [ -d "$DEST" ]; then
  echo -e "\n  ${Y}$DEST already exists.${X}"
  confirm "  Overwrite? (y/N) "
  rm -rf "$DEST"
fi

DOMAIN=$(ask "  Domain (e.g. mycoolapp.com, blank to skip): ")
DESCRIPTION=$(ask "  Description (one line, used for metadata + SEO): ")

# ── Derive display name from kebab-case ───────────────────────────────────────
# "my-cool-app" -> "MyCoolApp"
DISPLAY_NAME=$(echo "$NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g' | sed 's/ //g')

echo -e "\n${DIM}  Name:${X}        $NAME"
echo -e "${DIM}  Display:${X}     $DISPLAY_NAME"
[ -n "$DOMAIN" ]      && echo -e "${DIM}  Domain:${X}     $DOMAIN"
[ -n "$DESCRIPTION" ] && echo -e "${DIM}  Description:${X} $DESCRIPTION"
echo ""

confirm "  Proceed? (y/N) "

# ── Step 2: Copy boilerplate ──────────────────────────────────────────────────
echo -e "\n${C}Step 2:${X} ${W}Copying boilerplate${X}\n"

mkdir -p "$DEST"
rsync -a --info=progress2 \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.turbo' \
  --exclude='.vercel' \
  "$BOILERPLATE/" "$DEST/"

echo -e "\n  ${G}Copied to $DEST${X}\n"

# ── Step 3: Configure project ────────────────────────────────────────────────
echo -e "${C}Step 3:${X} ${W}Configuring project${X}\n"

cd "$DEST"

# 3a. package.json -- name and description
echo -e "  ${DIM}Updating package.json...${X}"
TMPFILE=$(mktemp)
if [ -n "$DESCRIPTION" ]; then
  jq --arg n "$NAME" --arg d "$DESCRIPTION" '.name = $n | .description = $d' package.json > "$TMPFILE"
else
  jq --arg n "$NAME" '.name = $n' package.json > "$TMPFILE"
fi
mv "$TMPFILE" package.json

# 3b. CLAUDE.md -- replace SparkStack references
echo -e "  ${DIM}Updating CLAUDE.md...${X}"
sed -i "s/\*\*SparkStack\*\*/\*\*$DISPLAY_NAME\*\*/g" CLAUDE.md
sed -i "s/SparkStack/$DISPLAY_NAME/g" CLAUDE.md
sed -i "s/spark-stack/$NAME/g" CLAUDE.md

# 3c. twitter-image.tsx -- alt text
echo -e "  ${DIM}Updating twitter-image.tsx alt text...${X}"
if [ -n "$DOMAIN" ]; then
  sed -i "s/Spark-Stripe - sparkstripe\.com/$DISPLAY_NAME - $DOMAIN/g" app/twitter-image.tsx
else
  sed -i "s/Spark-Stripe - sparkstripe\.com/$DISPLAY_NAME/g" app/twitter-image.tsx
fi

# 3d. taglines.ts -- generate from description or use defaults
echo -e "  ${DIM}Updating taglines.ts...${X}"
if [ -n "$DESCRIPTION" ]; then
  # Extract a few words from description for tagline seeds
  SHORT=$(echo "$DESCRIPTION" | head -c 30)
  cat > lib/config/taglines.ts << TAGEOF
/**
 * Centralized taglines used across the app:
 * - PageLoader (rotating swipe-up animation)
 * - Dashboard header (under app name)
 * - Landing page (optional)
 *
 * TODO: Replace these with taglines specific to your app.
 * Keep each half under ~35 chars. Split at ", " for OG card.
 * Original description: $DESCRIPTION
 */
export const TAGLINES = [
  'Ship faster, build smarter.',
  'Your next project, launched.',
  'From idea to production.',
  'Build it. Ship it.',
  'The stack that ships.',
];
TAGEOF
fi

# 3e. site.ts -- update support email if domain given
if [ -n "$DOMAIN" ]; then
  echo -e "  ${DIM}Noting domain for site.ts...${X}"
  # site.ts derives SITE_NAME from package.json automatically, and SITE_URL from env.
  # Just leave a note about setting NEXT_PUBLIC_APP_URL.
fi

echo -e "\n  ${G}Configuration complete.${X}\n"

# ── Step 4: Initialize git ───────────────────────────────────────────────────
echo -e "${C}Step 4:${X} ${W}Initializing git${X}\n"

git init -q
git add -A
git commit -q -m "init: scaffold from SparkStack boilerplate"
echo -e "  ${G}Git initialized with initial commit.${X}\n"

# ── Step 5: Install dependencies ──────────────────────────────────────────────
echo -e "${C}Step 5:${X} ${W}Installing dependencies${X}\n"

read -r -p "  Run 'bun install' now? (Y/n) " RUN_BUN
if [[ ! "$RUN_BUN" =~ ^[Nn]$ ]]; then
  bun install
  echo ""
fi

# ── Step 6: Open in VS Code ──────────────────────────────────────────────────
read -r -p "  Open in VS Code? (Y/n) " OPEN_CODE
if [[ ! "$OPEN_CODE" =~ ^[Nn]$ ]]; then
  code "$DEST"
fi

# ── Step 7: Print next steps ─────────────────────────────────────────────────
echo -e "\n${C}======================================${X}"
echo -e "${B}${W}  Setup Complete!${X}"
echo -e "${C}======================================${X}\n"

echo -e "${W}Project:${X} $DEST\n"

echo -e "${W}Next steps:${X}\n"

echo -e "  ${C}1.${X} ${W}Environment variables${X}"
echo -e "     cp .env.example .env.local"
echo -e "     # Fill in: DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET"
[ -n "$DOMAIN" ] && echo -e "     # Set: NEXT_PUBLIC_APP_URL=https://$DOMAIN"
echo ""

echo -e "  ${C}2.${X} ${W}Database${X}"
echo -e "     bun db:push"
echo ""

echo -e "  ${C}3.${X} ${W}Taglines${X} ${DIM}(lib/config/taglines.ts)${X}"
echo -e "     Replace placeholder taglines with lines specific to your app."
echo -e "     Keep each half under ~35 chars. Split at \", \" for OG card."
echo ""

echo -e "  ${C}4.${X} ${W}OG image config${X} ${DIM}(lib/og/config.ts)${X}"
echo -e "     Update: ogConfig.features, ogConfig.cta, ogConfig.socialProof"
echo -e "     Replace app/favicon.png with your app's favicon (must be PNG)"
echo -e "     Add mascots to lib/og/res/mascots/ (auto-discovered)"
echo -e "     See: lib/og/DEPLOYMENT.txt for Vercel pitfalls"
echo ""

echo -e "  ${C}5.${X} ${W}Spark AI kit${X} ${DIM}(lib/spark-ai/)${X}"
echo -e "     Download your kit from sparkbrain.app and replace all files."
echo -e "     Set: NEXT_PUBLIC_SPARK_AI_API_KEY in .env.local for local dev"
echo ""

echo -e "  ${C}6.${X} ${W}SparkStripe kit${X} ${DIM}(lib/spark-stripe/)${X}"
echo -e "     Download your kit from sparkstripe.com and replace all files."
echo -e "     Set: SPARK_STRIPE_WEBHOOK_SECRET in .env.local"
echo -e "     Wire getIdentity() to your auth in both .tsx and .ts files"
echo -e "     Create: app/api/webhooks/spark-stripe/route.ts"
echo ""

echo -e "  ${C}7.${X} ${W}SEO audit${X} ${DIM}(seo/)${X}"
echo -e "     Feed seo/audit.txt to Claude Code for a full audit."
echo -e "     Copy templates from seo/templates/ to public/"
echo -e "     Walk through seo/post-deploy-checklist.md after first deploy"
echo ""

echo -e "  ${C}8.${X} ${W}Bottled email${X} ${DIM}(optional)${X}"
echo -e "     See docs/bottled-api-reference.md for the email API"
echo -e "     Set: BOTTLED_API_KEY in .env.local"
echo ""

echo -e "  ${C}9.${X} ${W}Start developing${X}"
echo -e "     bun dev"
echo -e "     Visit: http://localhost:3000/opengraph-image (verify OG card)"
echo ""

echo -e "${DIM}Full setup guide: docs/setup-guide.md${X}"
echo -e "${DIM}Claude Code prompts: docs/setup-guide.md section 8${X}\n"
