# AI Tool Selection Advisor: Microsoft 365 Copilot vs Copilot Studio vs Athena

A modern, responsive single-page web application to evaluate and select the optimal AI tool between:
1. **Microsoft 365 Copilot (Easy Mode)**: Turnkey out-of-the-box productivity for general users.
2. **Microsoft 365 Copilot Studio (Builder Multi-Step Workflow)**: Low-code visual canvas for multi-stage agentic automation.
3. **Athena (Internal System)**: Custom enterprise platform with tailored LLM routing and zero per-user seat tax.

---

## Key Features

### 1. Sticky Tool Recommendation Panel
- **Always Visible**: Stays pinned at the top even while scrolling down the questionnaire.
- **Left-to-Right Distribution Bar**: Visualizes the fit score (%) across all 3 tools in real time.
- **Currently Recommended Tool**: Prominently displays the winning tool with badge, theme, and decision rationale.
- **Live Annual Cost Ticker**: Shows total estimated annual cost in Thai Baht (THB).

### 2. Step-by-Step Question Flow
- **Question 1: Agentic Workflow Readiness**
  - Question: *"Would your team have a person to learn multi-stage agentic workflow?"*
  - Includes the official Microsoft workflow designer diagram: `https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/media/flow-designer/workflow-designer.png`
  - Answers: **Yes** or **No**.
  - **Rule**: If the answer is **No**, tool recommendation is strictly **Microsoft 365 (easy mode)**.
- **Question 2: Cost Estimation & Scale**
  - **Left-Hand Side**: Microsoft License Cost Calculator:
    - Variable **H**: Number of users who already have Microsoft 365 Advanced license.
    - Variable **U**: Number of users who need to use this AI agent.
    - **Formula**:
      - If $U \le H$, cost is **฿0 / year**.
      - Otherwise, cost is $(U - H) \times \$20 \times 12 \text{ months} \times 35 \text{ THB/USD}$.
      - Explicitly mentions: **This cost is for per year.**
  - **Right-Hand Side**: Athena internal system comparison details and placeholder for future organization-specific evaluation criteria.

### 3. Lightweight In-Browser Database (SQLite WASM)
- **100% Serverless & Zero-Cost**: Powered by `sql.js` (WebAssembly SQLite) running directly in the browser with `localStorage` persistence.
- **Configurable Variables**:
  - `usd_thb_rate`: Default `35.0` THB/USD
  - `m365_license_monthly_usd`: Default `$20.0` / user / month
  - `m365_months_per_year`: Default `12.0` months
  - `athena_high_cost_threshold_thb`: Default `฿210,000` / year
  - `athena_min_user_scale`: Default `30` users
- **Database Management Modal**:
  - Live variable editor (changes instantly recalculate the scoring).
  - Interactive SQL Query Console (run `SELECT`, `UPDATE` queries).
  - One-click SQLite binary file export (`.db`) and import.
  - Reset to default factory seed data.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Visit the local URL shown in terminal (e.g. `http://localhost:5173/`).

---

## Public Deployment

This application is built as a pure client-side SPA with relative assets (`base: './'`). You can deploy it anywhere with zero backend configuration:

### Option A: GitHub Pages (Automatic)
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The included workflow `.github/workflows/deploy.yml` will automatically build and publish the site.

### Option B: Vercel / Netlify
1. Connect the repository or drag & drop the `dist/` folder.
2. Build command: `npm run build`
3. Output directory: `dist`

### Option C: Cloudflare Pages / Static Hosting
1. Run `npm run build`.
2. Upload the `dist/` folder to any static web hosting provider or S3 bucket.
