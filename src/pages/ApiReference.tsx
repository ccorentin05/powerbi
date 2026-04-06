import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  Key,
  Cloud,
  Database,
  FileText,
  Users,
  Code2,
  AlertTriangle,
  Package,
  Terminal,
  Globe,
  Play,
  Layers,
  Timer,
  Lightbulb,
  ExternalLink,
  BookOpen,
} from 'lucide-react'

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface Endpoint {
  method: HttpMethod
  path: string
  description: string
  example?: string
}

interface EndpointCategory {
  id: string
  title: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  endpoints: Endpoint[]
}

interface CodeTemplate {
  id: string
  title: string
  language: 'python' | 'powershell'
  code: string
}

interface RateLimit {
  api: string
  limit: string
  window: string
  notes: string
}

interface SDK {
  name: string
  language: string
  install: string
  description: string
  color: string
}

/* ================================================================== */
/*  Data                                                               */
/* ================================================================== */

const methodColors: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: '#10b981' },
  POST: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: '#3b82f6' },
  PATCH: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' },
  DELETE: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: '#ef4444' },
}

const endpointCategories: EndpointCategory[] = [
  {
    id: 'datasets',
    title: 'Datasets / Semantic Models',
    icon: Database,
    endpoints: [
      {
        method: 'GET',
        path: '/groups/{groupId}/datasets',
        description: 'Lister les datasets d\'un workspace',
        example: `GET https://api.powerbi.com/v1.0/myorg/groups/{groupId}/datasets

// Response
{
  "value": [
    {
      "id": "cfafbeb1-8037-4d0c-896e-a46fb27ff229",
      "name": "SalesDataset",
      "configuredBy": "user@contoso.com",
      "isRefreshable": true,
      "isOnPremGatewayRequired": false
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/datasets/{datasetId}/refreshes',
        description: 'Declencher un refresh du dataset',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes

// Request body (optional - enhanced refresh)
{
  "type": "Full",
  "commitMode": "transactional",
  "maxParallelism": 2,
  "retryCount": 2,
  "objects": [
    { "table": "Sales", "partition": "Current Year" }
  ]
}`,
      },
      {
        method: 'GET',
        path: '/groups/{groupId}/datasets/{datasetId}/refreshes',
        description: 'Historique des refreshes',
        example: `GET https://api.powerbi.com/v1.0/myorg/groups/{groupId}/datasets/{datasetId}/refreshes?$top=5

// Response
{
  "value": [
    {
      "requestId": "...",
      "refreshType": "ViaApi",
      "startTime": "2024-01-15T08:00:00Z",
      "endTime": "2024-01-15T08:05:32Z",
      "status": "Completed"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/datasets/{datasetId}/executeQueries',
        description: 'Executer une requete DAX',
        example: `POST https://api.powerbi.com/v1.0/myorg/datasets/{datasetId}/executeQueries

// Request body
{
  "queries": [
    {
      "query": "EVALUATE TOPN(10, 'Sales', 'Sales'[Amount], DESC)"
    }
  ],
  "serializerSettings": {
    "includeNulls": true
  }
}`,
      },
      {
        method: 'PATCH',
        path: '/groups/{groupId}/datasets/{datasetId}',
        description: 'Modifier les parametres du dataset',
        example: `PATCH https://api.powerbi.com/v1.0/myorg/groups/{groupId}/datasets/{datasetId}

// Request body
{
  "targetStorageMode": "PremiumFiles",
  "queryScaleOutSettings": {
    "autoSyncReadOnlyReplicas": true,
    "maxReadOnlyReplicas": -1
  }
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/datasets/{datasetId}/Default.TakeOver',
        description: 'Prendre possession du dataset',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FileText,
    endpoints: [
      {
        method: 'GET',
        path: '/groups/{groupId}/reports',
        description: 'Lister les rapports d\'un workspace',
        example: `GET https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports

// Response
{
  "value": [
    {
      "id": "5b218778-e7a5-4d73-8187-f10824047715",
      "reportType": "PowerBIReport",
      "name": "Sales Report",
      "datasetId": "cfafbeb1-8037-4d0c-896e-a46fb27ff229"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/reports/{reportId}/Clone',
        description: 'Cloner un rapport',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId}/Clone

// Request body
{
  "name": "Sales Report - Copy",
  "targetWorkspaceId": "target-workspace-guid",
  "targetModelId": "target-dataset-guid"
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/reports/{reportId}/Export',
        description: 'Exporter un rapport (PDF/PPTX/PNG)',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId}/ExportTo

// Request body
{
  "format": "PDF",
  "powerBIReportConfiguration": {
    "pages": [
      { "pageName": "ReportSection1" }
    ],
    "defaultBookmark": {
      "name": "BookmarkName"
    }
  }
}`,
      },
      {
        method: 'GET',
        path: '/groups/{groupId}/reports/{reportId}/pages',
        description: 'Obtenir les pages du rapport',
        example: `GET https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId}/pages

// Response
{
  "value": [
    {
      "name": "ReportSection1",
      "displayName": "Overview",
      "order": 0
    }
  ]
}`,
      },
    ],
  },
  {
    id: 'workspaces',
    title: 'Workspaces (Groups)',
    icon: Layers,
    endpoints: [
      {
        method: 'GET',
        path: '/groups',
        description: 'Lister les workspaces accessibles',
        example: `GET https://api.powerbi.com/v1.0/myorg/groups?$filter=contains(name,'Sales')&$top=10

// Response
{
  "value": [
    {
      "id": "f089354e-8366-4e18-aea3-4cb4a3a50b48",
      "name": "Sales Team Workspace",
      "type": "Workspace",
      "isOnDedicatedCapacity": true
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/groups',
        description: 'Creer un workspace',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups?workspaceV2=True

// Request body
{
  "name": "New Sales Workspace"
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/users',
        description: 'Ajouter un utilisateur au workspace',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/users

// Request body
{
  "emailAddress": "user@contoso.com",
  "groupUserAccessRight": "Admin"
  // Options: Admin, Member, Contributor, Viewer
}`,
      },
      {
        method: 'DELETE',
        path: '/groups/{groupId}/users/{userEmail}',
        description: 'Retirer un utilisateur du workspace',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin APIs',
    icon: Shield,
    endpoints: [
      {
        method: 'GET',
        path: '/admin/groups',
        description: 'Obtenir tous les workspaces (admin tenant)',
        example: `GET https://api.powerbi.com/v1.0/myorg/admin/groups?$top=100&$filter=state eq 'Active'

// Response
{
  "value": [
    {
      "id": "...",
      "name": "Finance Workspace",
      "state": "Active",
      "capacityId": "...",
      "type": "Workspace"
    }
  ]
}`,
      },
      {
        method: 'GET',
        path: '/admin/datasets',
        description: 'Obtenir tous les datasets (admin tenant)',
      },
      {
        method: 'GET',
        path: '/admin/users',
        description: 'Obtenir tous les utilisateurs Power BI',
      },
      {
        method: 'POST',
        path: '/admin/workspaces/getInfo',
        description: 'Scanner API (gouvernance et inventaire)',
        example: `POST https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo?lineage=True&datasourceDetails=True

// Request body
{
  "workspaces": [
    "f089354e-8366-4e18-aea3-4cb4a3a50b48"
  ]
}

// Response: scanId to poll with GET /admin/workspaces/scanResult/{scanId}`,
      },
    ],
  },
  {
    id: 'embed',
    title: 'Embed APIs',
    icon: Code2,
    endpoints: [
      {
        method: 'POST',
        path: '/groups/{groupId}/reports/{reportId}/GenerateToken',
        description: 'Generer un token d\'embed pour un rapport',
        example: `POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId}/GenerateToken

// Request body
{
  "accessLevel": "View",
  "allowSaveAs": false,
  "identities": [
    {
      "username": "user@contoso.com",
      "roles": ["SalesRegion"],
      "datasets": ["datasetId"]
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/groups/{groupId}/datasets/GenerateToken',
        description: 'Generer un token d\'embed pour un dataset',
        example: `POST https://api.powerbi.com/v1.0/myorg/GenerateToken

// Request body (multi-resource token)
{
  "datasets": [
    { "id": "dataset-guid" }
  ],
  "reports": [
    { "id": "report-guid", "allowEdit": true }
  ],
  "targetWorkspaces": [
    { "id": "workspace-guid" }
  ]
}`,
      },
    ],
  },
  {
    id: 'fabric',
    title: 'Fabric REST APIs',
    icon: Cloud,
    endpoints: [
      {
        method: 'GET',
        path: '/workspaces',
        description: 'Lister les workspaces Fabric',
        example: `GET https://api.fabric.microsoft.com/v1/workspaces

// Response
{
  "value": [
    {
      "id": "...",
      "displayName": "My Fabric Workspace",
      "type": "Workspace",
      "capacityId": "..."
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/workspaces/{workspaceId}/items',
        description: 'Creer un item Fabric (lakehouse, notebook, etc.)',
        example: `POST https://api.fabric.microsoft.com/v1/workspaces/{workspaceId}/items

// Request body
{
  "displayName": "MyLakehouse",
  "type": "Lakehouse"
}`,
      },
      {
        method: 'GET',
        path: '/workspaces/{workspaceId}/lakehouses',
        description: 'Lister les lakehouses',
      },
      {
        method: 'POST',
        path: '/workspaces/{workspaceId}/notebooks/run',
        description: 'Executer un notebook',
      },
      {
        method: 'GET',
        path: '/capacities',
        description: 'Lister les capacites Fabric',
        example: `GET https://api.fabric.microsoft.com/v1/capacities

// Response
{
  "value": [
    {
      "id": "...",
      "displayName": "FabricCapacityF64",
      "sku": "F64",
      "state": "Active",
      "region": "westeurope"
    }
  ]
}`,
      },
      {
        method: 'PATCH',
        path: '/capacities/{capacityId}',
        description: 'Mettre a jour la capacite (pause/resume)',
        example: `// Pause capacity
POST https://management.azure.com/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{capName}/suspend?api-version=2023-11-01

// Resume capacity
POST https://management.azure.com/subscriptions/{subId}/resourceGroups/{rg}/providers/Microsoft.Fabric/capacities/{capName}/resume?api-version=2023-11-01`,
      },
    ],
  },
]

const authMethods = [
  {
    id: 'service-principal',
    title: 'Service Principal',
    icon: Key,
    badge: 'Recommande',
    badgeColor: '#10b981',
    description:
      'Enregistrez une application Azure AD, accordez les permissions Power BI, et ajoutez le Service Principal au workspace comme Admin ou Member. Ideal pour l\'automatisation en production.',
    pythonCode: `import msal
import requests

app = msal.ConfidentialClientApplication(
    client_id="YOUR_APP_ID",
    client_credential="YOUR_SECRET",
    authority="https://login.microsoftonline.com/YOUR_TENANT_ID"
)

token = app.acquire_token_for_client(
    scopes=["https://analysis.windows.net/powerbi/api/.default"]
)

headers = {"Authorization": f"Bearer {token['access_token']}"}

# Example: list workspaces
response = requests.get(
    "https://api.powerbi.com/v1.0/myorg/groups",
    headers=headers
)
print(response.json())`,
    powershellCode: `# Install module: Install-Module -Name MicrosoftPowerBIMgmt
$clientId = "YOUR_APP_ID"
$clientSecret = "YOUR_SECRET" | ConvertTo-SecureString -AsPlainText -Force
$tenantId = "YOUR_TENANT_ID"

$credential = New-Object System.Management.Automation.PSCredential($clientId, $clientSecret)
Connect-PowerBIServiceAccount -ServicePrincipal -Credential $credential -TenantId $tenantId

# List workspaces
Get-PowerBIWorkspace -Scope Organization -First 10`,
  },
  {
    id: 'master-user',
    title: 'Master User',
    icon: Users,
    badge: 'Dev Only',
    badgeColor: '#f59e0b',
    description:
      'Utilisez un compte utilisateur avec licence Pro ou PPU. Simple pour le dev/test mais non recommande en production (necessite MFA disabled, risque de verrouillage).',
    pythonCode: `import msal
import requests

app = msal.PublicClientApplication(
    client_id="YOUR_APP_ID",
    authority="https://login.microsoftonline.com/YOUR_TENANT_ID"
)

# Interactive login (for dev/test)
token = app.acquire_token_interactive(
    scopes=["https://analysis.windows.net/powerbi/api/.default"]
)

# Or with username/password (not recommended)
token = app.acquire_token_by_username_password(
    username="user@contoso.com",
    password="password",
    scopes=["https://analysis.windows.net/powerbi/api/.default"]
)

headers = {"Authorization": f"Bearer {token['access_token']}"}`,
    powershellCode: `# Interactive login
Connect-PowerBIServiceAccount

# Or with credentials
$credential = Get-Credential
Connect-PowerBIServiceAccount -Credential $credential

# List workspaces
Get-PowerBIWorkspace -Scope Individual`,
  },
  {
    id: 'managed-identity',
    title: 'Managed Identity',
    icon: Cloud,
    badge: 'Azure',
    badgeColor: '#3b82f6',
    description:
      'Pour les items Fabric et services Azure (Azure Functions, Logic Apps, etc.). Zero gestion de credentials, rotation automatique des tokens.',
    pythonCode: `from azure.identity import DefaultAzureCredential
import requests

# Works automatically in Azure (Functions, App Service, etc.)
credential = DefaultAzureCredential()
token = credential.get_token(
    "https://analysis.windows.net/powerbi/api/.default"
)

headers = {"Authorization": f"Bearer {token.token}"}

# Also works with Fabric API
fabric_token = credential.get_token(
    "https://api.fabric.microsoft.com/.default"
)`,
    powershellCode: `# In Azure Automation / Azure Functions
Connect-AzAccount -Identity

$token = Get-AzAccessToken -ResourceUrl "https://analysis.windows.net/powerbi/api"
$headers = @{
    "Authorization" = "Bearer $($token.Token)"
}

# Call API directly
$response = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups" \\
    -Headers $headers -Method Get`,
  },
]

const codeTemplates: CodeTemplate[] = [
  {
    id: 'refresh-all',
    title: 'Refresh tous les datasets d\'un workspace',
    language: 'python',
    code: `import msal, requests, time

def get_token(client_id, client_secret, tenant_id):
    app = msal.ConfidentialClientApplication(
        client_id, client_credential=client_secret,
        authority=f"https://login.microsoftonline.com/{tenant_id}"
    )
    token = app.acquire_token_for_client(
        scopes=["https://analysis.windows.net/powerbi/api/.default"]
    )
    return token["access_token"]

def refresh_all_datasets(group_id, token):
    headers = {"Authorization": f"Bearer {token}"}
    base = "https://api.powerbi.com/v1.0/myorg"

    # List all datasets in workspace
    datasets = requests.get(
        f"{base}/groups/{group_id}/datasets", headers=headers
    ).json()["value"]

    results = []
    for ds in datasets:
        if not ds.get("isRefreshable", False):
            continue
        print(f"Refreshing: {ds['name']}...")
        resp = requests.post(
            f"{base}/groups/{group_id}/datasets/{ds['id']}/refreshes",
            headers=headers,
            json={"notifyOption": "MailOnFailure"}
        )
        results.append({
            "name": ds["name"],
            "status": resp.status_code,
            "success": resp.status_code == 202
        })
        time.sleep(1)  # Avoid rate limiting

    return results

# Usage
token = get_token("APP_ID", "SECRET", "TENANT_ID")
results = refresh_all_datasets("workspace-guid", token)
for r in results:
    status = "OK" if r["success"] else "FAILED"
    print(f"  {r['name']}: {status}")`,
  },
  {
    id: 'export-pdf',
    title: 'Exporter un rapport en PDF',
    language: 'python',
    code: `import requests, time

def export_report_to_pdf(group_id, report_id, token, output_path="report.pdf"):
    headers = {"Authorization": f"Bearer {token}"}
    base = "https://api.powerbi.com/v1.0/myorg"

    # Step 1: Trigger export
    body = {
        "format": "PDF",
        "powerBIReportConfiguration": {
            "defaultBookmark": {"state": ""}
        }
    }
    resp = requests.post(
        f"{base}/groups/{group_id}/reports/{report_id}/ExportTo",
        headers=headers, json=body
    )
    export_id = resp.json()["id"]
    print(f"Export started: {export_id}")

    # Step 2: Poll until complete
    while True:
        status_resp = requests.get(
            f"{base}/groups/{group_id}/reports/{report_id}/exports/{export_id}",
            headers=headers
        ).json()

        pct = status_resp.get("percentComplete", 0)
        print(f"  Progress: {pct}%")

        if status_resp["status"] == "Succeeded":
            break
        elif status_resp["status"] == "Failed":
            raise Exception(f"Export failed: {status_resp.get('error')}")
        time.sleep(3)

    # Step 3: Download file
    file_resp = requests.get(
        f"{base}/groups/{group_id}/reports/{report_id}/exports/{export_id}/file",
        headers=headers
    )
    with open(output_path, "wb") as f:
        f.write(file_resp.content)
    print(f"Exported to {output_path}")

# Usage
export_report_to_pdf("workspace-guid", "report-guid", token)`,
  },
  {
    id: 'bulk-users',
    title: 'Ajout massif d\'utilisateurs a un workspace',
    language: 'powershell',
    code: `# Bulk add users to a Power BI workspace
param(
    [string]$WorkspaceId,
    [string]$CsvPath  # CSV with columns: Email, Role
)

# Connect
Connect-PowerBIServiceAccount -ServicePrincipal \\
    -Credential $credential -TenantId $tenantId

# Read CSV
$users = Import-Csv -Path $CsvPath

$results = @()
foreach ($user in $users) {
    try {
        $body = @{
            emailAddress         = $user.Email
            groupUserAccessRight = $user.Role  # Admin, Member, Contributor, Viewer
        } | ConvertTo-Json

        Invoke-PowerBIRestMethod -Url "groups/$WorkspaceId/users" \\
            -Method Post -Body $body

        Write-Host "Added $($user.Email) as $($user.Role)" -ForegroundColor Green
        $results += [PSCustomObject]@{
            Email  = $user.Email
            Role   = $user.Role
            Status = "Success"
        }
    }
    catch {
        Write-Host "Failed: $($user.Email) - $_" -ForegroundColor Red
        $results += [PSCustomObject]@{
            Email  = $user.Email
            Role   = $user.Role
            Status = "Failed: $_"
        }
    }
    Start-Sleep -Seconds 1
}

$results | Export-Csv -Path "add_users_results.csv" -NoTypeInformation
Write-Host "Done. Results saved to add_users_results.csv"`,
  },
  {
    id: 'monitor-refresh',
    title: 'Surveiller le statut des refreshes',
    language: 'python',
    code: `import requests, time
from datetime import datetime, timedelta

def monitor_refreshes(group_id, token, check_interval=60, alert_on_failure=True):
    headers = {"Authorization": f"Bearer {token}"}
    base = "https://api.powerbi.com/v1.0/myorg"

    datasets = requests.get(
        f"{base}/groups/{group_id}/datasets", headers=headers
    ).json()["value"]

    print(f"Monitoring {len(datasets)} datasets...")
    print("-" * 60)

    while True:
        issues = []
        for ds in datasets:
            if not ds.get("isRefreshable"):
                continue

            refreshes = requests.get(
                f"{base}/groups/{group_id}/datasets/{ds['id']}/refreshes?$top=1",
                headers=headers
            ).json().get("value", [])

            if not refreshes:
                continue

            last = refreshes[0]
            status = last.get("status", "Unknown")
            end_time = last.get("endTime", "In progress")

            if status == "Failed":
                issues.append({
                    "dataset": ds["name"],
                    "status": status,
                    "error": last.get("serviceExceptionJson", "Unknown error"),
                    "time": end_time
                })

            print(f"  {ds['name']}: {status} ({end_time})")

        if issues and alert_on_failure:
            print("\\n*** ALERTS ***")
            for issue in issues:
                print(f"  FAILED: {issue['dataset']} at {issue['time']}")
                print(f"    Error: {issue['error'][:200]}")

        print(f"\\nNext check in {check_interval}s...")
        time.sleep(check_interval)

# Usage
monitor_refreshes("workspace-guid", token, check_interval=300)`,
  },
  {
    id: 'dax-query',
    title: 'Executer une requete DAX via API',
    language: 'python',
    code: `import requests
import pandas as pd

def execute_dax(dataset_id, dax_query, token):
    """Execute a DAX query and return results as DataFrame."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    body = {
        "queries": [{"query": dax_query}],
        "serializerSettings": {"includeNulls": True}
    }

    resp = requests.post(
        f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/executeQueries",
        headers=headers, json=body
    )
    resp.raise_for_status()

    result = resp.json()["results"][0]
    rows = result["tables"][0]["rows"]

    return pd.DataFrame(rows)

# Usage
dax = """
EVALUATE
SUMMARIZECOLUMNS(
    'Date'[Year],
    'Product'[Category],
    "Total Sales", SUM('Sales'[Amount]),
    "Qty", SUM('Sales'[Quantity])
)
ORDER BY 'Date'[Year] DESC, [Total Sales] DESC
"""

df = execute_dax("dataset-guid", dax, token)
print(df.to_string(index=False))`,
  },
  {
    id: 'scanner-api',
    title: 'Scanner API pour la gouvernance',
    language: 'python',
    code: `import requests, time

def scan_workspaces(workspace_ids, token):
    """Use Scanner API to get full metadata for governance."""
    headers = {"Authorization": f"Bearer {token}"}
    base = "https://api.powerbi.com/v1.0/myorg/admin"

    # Step 1: Trigger scan
    body = {"workspaces": workspace_ids}
    resp = requests.post(
        f"{base}/workspaces/getInfo"
        "?lineage=True&datasourceDetails=True"
        "&datasetSchema=True&datasetExpressions=True",
        headers=headers, json=body
    )
    scan_id = resp.json()["id"]
    print(f"Scan started: {scan_id}")

    # Step 2: Poll for completion
    while True:
        status = requests.get(
            f"{base}/workspaces/scanStatus/{scan_id}",
            headers=headers
        ).json()

        if status["status"] == "Succeeded":
            break
        elif status["status"] == "Failed":
            raise Exception("Scan failed")
        print(f"  Status: {status['status']}...")
        time.sleep(5)

    # Step 3: Get results
    result = requests.get(
        f"{base}/workspaces/scanResult/{scan_id}",
        headers=headers
    ).json()

    # Analyze
    for ws in result.get("workspaces", []):
        print(f"\\nWorkspace: {ws['name']}")
        for ds in ws.get("datasets", []):
            print(f"  Dataset: {ds['name']}")
            print(f"    Tables: {len(ds.get('tables', []))}")
            print(f"    Configured by: {ds.get('configuredBy', 'N/A')}")
            for src in ds.get("datasourceUsages", []):
                print(f"    Source: {src.get('datasourceInstanceId')}")

    return result

# Usage: scan all workspaces
all_ws = requests.get(
    "https://api.powerbi.com/v1.0/myorg/admin/groups?$top=5000",
    headers={"Authorization": f"Bearer {token}"}
).json()["value"]

ws_ids = [ws["id"] for ws in all_ws if ws.get("state") == "Active"]

# Scan in batches of 100
for i in range(0, len(ws_ids), 100):
    batch = ws_ids[i:i+100]
    scan_workspaces(batch, token)
    time.sleep(2)`,
  },
  {
    id: 'capacity-management',
    title: 'Pause/Resume capacite Fabric (economies)',
    language: 'python',
    code: `from azure.identity import DefaultAzureCredential
import requests
from datetime import datetime

def manage_fabric_capacity(subscription_id, resource_group, capacity_name, action):
    """Pause or resume a Fabric capacity for cost optimization."""
    credential = DefaultAzureCredential()
    token = credential.get_token("https://management.azure.com/.default")

    headers = {
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json"
    }

    base = (
        f"https://management.azure.com/subscriptions/{subscription_id}"
        f"/resourceGroups/{resource_group}"
        f"/providers/Microsoft.Fabric/capacities/{capacity_name}"
    )

    if action == "pause":
        resp = requests.post(f"{base}/suspend?api-version=2023-11-01",
                           headers=headers)
    elif action == "resume":
        resp = requests.post(f"{base}/resume?api-version=2023-11-01",
                           headers=headers)
    elif action == "status":
        resp = requests.get(f"{base}?api-version=2023-11-01",
                          headers=headers)
        info = resp.json()
        return {
            "name": info["name"],
            "sku": info["sku"]["name"],
            "state": info["properties"]["state"],
        }
    else:
        raise ValueError(f"Unknown action: {action}")

    print(f"[{datetime.now()}] {action.upper()} {capacity_name}: {resp.status_code}")
    return resp.status_code == 200 or resp.status_code == 202

# Usage: auto-pause at night, resume in morning
# (Trigger via Azure Functions with timer trigger)
manage_fabric_capacity("sub-id", "rg-name", "my-capacity", "pause")

# Check status
status = manage_fabric_capacity("sub-id", "rg-name", "my-capacity", "status")
print(f"Capacity {status['name']} ({status['sku']}): {status['state']}")`,
  },
]

const rateLimits: RateLimit[] = [
  { api: 'Appels generaux (GET/POST)', limit: '10 req/sec', window: 'Par utilisateur', notes: 'Throttling 429 apres depassement' },
  { api: 'Refresh de dataset', limit: '200 par heure', window: 'Par capacite', notes: 'Shared: 8/jour, Premium: 48/jour par dataset' },
  { api: 'Execute Queries (DAX)', limit: '10 req/sec', window: 'Par utilisateur', notes: 'Max 100 000 lignes par requete' },
  { api: 'Export Report (PDF/PPTX)', limit: '50 par heure', window: 'Par utilisateur', notes: 'Max 5 exports simultanes' },
  { api: 'Generate Embed Token', limit: '600 par heure', window: 'Par tenant', notes: 'Token valide 1 heure par defaut' },
  { api: 'Admin APIs (Scanner)', limit: '200 par heure', window: 'Par tenant', notes: 'Batch de 100 workspaces max' },
  { api: 'Fabric REST APIs', limit: '10 req/sec', window: 'Par utilisateur', notes: 'Limites supplementaires par item type' },
]

const sdks: SDK[] = [
  {
    name: 'Python (requests + msal)',
    language: 'Python',
    install: 'pip install msal requests azure-identity',
    description: 'Le plus flexible. Combinaison de MSAL pour l\'auth et requests pour les appels REST. Compatible avec azure-identity pour Managed Identity.',
    color: '#3572A5',
  },
  {
    name: 'PowerShell Module',
    language: 'PowerShell',
    install: 'Install-Module -Name MicrosoftPowerBIMgmt',
    description: 'Module officiel Microsoft. Inclut cmdlets pour workspaces, datasets, reports, et admin. Ideal pour scripts d\'administration.',
    color: '#012456',
  },
  {
    name: '.NET SDK',
    language: 'C#',
    install: 'dotnet add package Microsoft.PowerBI.Api',
    description: 'SDK officiel NuGet. Typage fort, IntelliSense complet. Ideal pour applications .NET et Azure Functions.',
    color: '#178600',
  },
  {
    name: 'JavaScript (Embedding)',
    language: 'JavaScript',
    install: 'npm install powerbi-client',
    description: 'Library pour l\'embedding de rapports Power BI dans des applications web. Gestion des filtres, evenements, et navigation.',
    color: '#f7df1e',
  },
  {
    name: 'Semantic Link (Fabric)',
    language: 'Python',
    install: 'pip install semantic-link',
    description: 'Librairie sempy.fabric pour interagir avec Fabric depuis des notebooks. Lecture de datasets, execution DAX, gestion des lakehouses.',
    color: '#0078d4',
  },
]

/* ================================================================== */
/*  Utility Components                                                 */
/* ================================================================== */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
      style={{
        background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
        color: copied ? '#10b981' : '#94a3b8',
        border: `1px solid ${copied ? '#10b981' : 'transparent'}`,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copie !' : 'Copier'}
    </button>
  )
}

function MethodBadge({ method }: { method: HttpMethod }) {
  const c = methodColors[method]
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-bold tracking-wide"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}40`,
        minWidth: 56,
      }}
    >
      {method}
    </span>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#161b22' }}>
        <span className="text-xs font-medium" style={{ color: '#8b949e' }}>
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed" style={{ color: '#e6edf3' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ================================================================== */
/*  Section Components                                                 */
/* ================================================================== */

function AuthSection() {
  const [activeTab, setActiveTab] = useState('service-principal')
  const [codeLang, setCodeLang] = useState<'python' | 'powershell'>('python')

  const active = authMethods.find((m) => m.id === activeTab)!

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(242,200,17,0.15)' }}>
          <Shield size={24} style={{ color: '#f2c811' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">Authentification</h2>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Tab buttons */}
        <div className="flex border-b" style={{ borderColor: '#e5e7eb' }}>
          {authMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveTab(method.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === method.id ? '#f2c811' : '#94a3b8',
                background: activeTab === method.id ? 'rgba(242,200,17,0.08)' : 'transparent',
                borderBottom: activeTab === method.id ? '2px solid #f2c811' : '2px solid transparent',
              }}
            >
              <method.icon size={16} />
              {method.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-pbi-text">{active.title}</h3>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{
                background: `${active.badgeColor}20`,
                color: active.badgeColor,
              }}
            >
              {active.badge}
            </span>
          </div>

          <p className="text-pbi-muted text-sm mb-6 leading-relaxed">{active.description}</p>

          {/* Language toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setCodeLang('python')}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                background: codeLang === 'python' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                color: codeLang === 'python' ? '#3b82f6' : '#94a3b8',
              }}
            >
              Python
            </button>
            <button
              onClick={() => setCodeLang('powershell')}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                background: codeLang === 'powershell' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                color: codeLang === 'powershell' ? '#3b82f6' : '#94a3b8',
              }}
            >
              PowerShell
            </button>
          </div>

          <CodeBlock
            code={codeLang === 'python' ? active.pythonCode : active.powershellCode}
            language={codeLang === 'python' ? 'Python' : 'PowerShell'}
          />
        </div>
      </div>
    </motion.section>
  )
}

function EndpointCard({ endpoint, isOpen, onToggle }: { endpoint: Endpoint; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-lg border transition-colors"
      style={{
        background: isOpen ? '#f0f0f0' : '#ffffff',
        borderColor: isOpen ? '#e5e7eb' : 'transparent',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono flex-1" style={{ color: '#1e293b' }}>
          {endpoint.path}
        </code>
        <span className="text-xs hidden sm:block" style={{ color: '#94a3b8', maxWidth: 300 }}>
          {endpoint.description}
        </span>
        {endpoint.example && (
          <ChevronDown
            size={16}
            style={{
              color: '#94a3b8',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && endpoint.example && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-sm mb-3 sm:hidden" style={{ color: '#94a3b8' }}>
                {endpoint.description}
              </p>
              <CodeBlock code={endpoint.example} language="HTTP" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EndpointsSection() {
  const [search, setSearch] = useState('')
  const [openEndpoints, setOpenEndpoints] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(endpointCategories.map((c) => c.id))
  )

  const toggleEndpoint = useCallback((key: string) => {
    setOpenEndpoints((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return endpointCategories
    const q = search.toLowerCase()
    return endpointCategories
      .map((cat) => ({
        ...cat,
        endpoints: cat.endpoints.filter(
          (ep) =>
            ep.path.toLowerCase().includes(q) ||
            ep.description.toLowerCase().includes(q) ||
            ep.method.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.endpoints.length > 0)
  }, [search])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(0,120,212,0.15)' }}>
          <Globe size={24} style={{ color: '#0078d4' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">Endpoints REST API</h2>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#94a3b8' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un endpoint... (ex: refresh, datasets, admin)"
          className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            color: '#1e293b',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: '#94a3b8' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {filtered.map((cat) => {
          const isExpanded = expandedCategories.has(cat.id)
          return (
            <motion.div
              key={cat.id}
              layout
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <cat.icon size={20} style={{ color: '#0078d4' }} />
                <span className="text-base font-semibold text-pbi-text flex-1">
                  {cat.title}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,120,212,0.15)', color: '#0078d4' }}
                >
                  {cat.endpoints.length} endpoints
                </span>
                <ChevronRight
                  size={16}
                  style={{
                    color: '#94a3b8',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-2">
                      {cat.endpoints.map((ep, i) => {
                        const key = `${cat.id}-${i}`
                        return (
                          <EndpointCard
                            key={key}
                            endpoint={ep}
                            isOpen={openEndpoints.has(key)}
                            onToggle={() => toggleEndpoint(key)}
                          />
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

function CodeTemplatesSection() {
  const [activeTemplate, setActiveTemplate] = useState(codeTemplates[0].id)

  const template = codeTemplates.find((t) => t.id === activeTemplate)!

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)' }}>
          <Terminal size={24} style={{ color: '#10b981' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">Templates de Code</h2>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Template selector */}
        <div
          className="flex flex-wrap gap-2 p-4 border-b"
          style={{ borderColor: '#e5e7eb' }}
        >
          {codeTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background:
                  activeTemplate === t.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                color: activeTemplate === t.id ? '#10b981' : '#94a3b8',
                border: `1px solid ${activeTemplate === t.id ? '#10b98140' : 'transparent'}`,
              }}
            >
              {t.language === 'python' ? (
                <Code2 size={12} />
              ) : (
                <Terminal size={12} />
              )}
              {t.title}
            </button>
          ))}
        </div>

        {/* Code */}
        <div className="p-4">
          <CodeBlock
            code={template.code}
            language={template.language === 'python' ? 'Python' : 'PowerShell'}
          />
        </div>
      </div>
    </motion.section>
  )
}

function RateLimitsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
          <Timer size={24} style={{ color: '#f59e0b' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">Rate Limits & Bonnes Pratiques</h2>
      </div>

      {/* Rate limits table */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(0,120,212,0.08)' }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1e293b' }}>API</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1e293b' }}>Limite</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1e293b' }}>Portee</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1e293b' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((rl, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: '1px solid #e5e7eb',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <td className="px-4 py-3" style={{ color: '#1e293b' }}>{rl.api}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
                    >
                      {rl.limit}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{rl.window}</td>
                  <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{rl.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best practices */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} style={{ color: '#10b981' }} />
            <h3 className="font-semibold text-pbi-text">Bonnes Pratiques</h3>
          </div>
          <ul className="space-y-2 text-sm" style={{ color: '#94a3b8' }}>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
              Utilisez un Service Principal pour tous les scenarios de production
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
              Implementez une logique de retry avec backoff exponentiel
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
              Groupez les operations (batch) quand possible
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
              Cachez les tokens (duree de vie ~1h) au lieu de re-authentifier
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
              Utilisez $top et $filter pour limiter les donnees retournees
            </li>
          </ul>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            <h3 className="font-semibold text-pbi-text">Gestion du Throttling (429)</h3>
          </div>
          <CodeBlock
            code={`import time
import requests

def api_call_with_retry(url, headers, max_retries=5):
    """Exponential backoff for 429 (Too Many Requests)."""
    for attempt in range(max_retries):
        resp = requests.get(url, headers=headers)

        if resp.status_code == 429:
            # Use Retry-After header if available
            wait = int(resp.headers.get("Retry-After", 2 ** attempt))
            print(f"Throttled. Waiting {wait}s...")
            time.sleep(wait)
            continue

        resp.raise_for_status()
        return resp.json()

    raise Exception("Max retries exceeded")`}
            language="Python"
          />
        </div>
      </div>
    </motion.section>
  )
}

function SDKSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>
          <Package size={24} style={{ color: '#8b5cf6' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">SDK & Libraries</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sdks.map((sdk) => (
          <motion.div
            key={sdk.name}
            whileHover={{ y: -2 }}
            className="glass-card p-5 transition-colors hover:border-pbi-border"
            style={{ borderLeft: `3px solid ${sdk.color}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-pbi-text text-sm">{sdk.name}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{ background: `${sdk.color}20`, color: sdk.color }}
              >
                {sdk.language}
              </span>
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#94a3b8' }}>
              {sdk.description}
            </p>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded text-xs font-mono"
              style={{ background: '#0d1117', color: '#e6edf3' }}
            >
              <Terminal size={12} style={{ color: '#94a3b8' }} />
              <code className="flex-1 truncate">{sdk.install}</code>
              <CopyButton text={sdk.install} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function ApiExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(endpointCategories[0].id)
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)

  const category = endpointCategories.find((c) => c.id === selectedCategory)!
  const endpoint = category.endpoints[selectedEndpoint] || category.endpoints[0]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)' }}>
          <Play size={24} style={{ color: '#3b82f6' }} />
        </div>
        <h2 className="text-2xl font-bold text-pbi-text">API Explorer Interactif</h2>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid md:grid-cols-[240px_1fr]">
          {/* Sidebar: categories */}
          <div
            className="border-r p-4 space-y-1"
            style={{ borderColor: '#e5e7eb', background: 'rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
              Categorie
            </p>
            {endpointCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setSelectedEndpoint(0)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors"
                style={{
                  background: selectedCategory === cat.id ? 'rgba(0,120,212,0.15)' : 'transparent',
                  color: selectedCategory === cat.id ? '#0078d4' : '#94a3b8',
                }}
              >
                <cat.icon size={14} />
                {cat.title}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="p-5">
            {/* Endpoint selector */}
            <div className="flex flex-wrap gap-2 mb-5">
              {category.endpoints.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedEndpoint(i)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background:
                      selectedEndpoint === i
                        ? `${methodColors[ep.method].bg}`
                        : 'rgba(255,255,255,0.03)',
                    color: selectedEndpoint === i ? methodColors[ep.method].text : '#94a3b8',
                    border: `1px solid ${
                      selectedEndpoint === i ? `${methodColors[ep.method].border}40` : 'transparent'
                    }`,
                  }}
                >
                  <MethodBadge method={ep.method} />
                  <span className="font-mono truncate max-w-[200px]">{ep.path.split('/').pop()}</span>
                </button>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MethodBadge method={endpoint.method} />
                  <h3 className="text-base font-semibold text-pbi-text">{endpoint.description}</h3>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm"
                  style={{ background: '#0d1117', color: '#e6edf3' }}
                >
                  <span style={{ color: methodColors[endpoint.method].text }}>{endpoint.method}</span>
                  <span className="flex-1">{endpoint.path}</span>
                  <CopyButton text={`https://api.powerbi.com/v1.0/myorg${endpoint.path}`} />
                </div>
              </div>

              {endpoint.example && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>
                    Exemple requete / reponse
                  </p>
                  <CodeBlock code={endpoint.example} language="HTTP" />
                </div>
              )}

              {!endpoint.example && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <BookOpen size={16} style={{ color: '#3b82f6' }} />
                  <span className="text-sm" style={{ color: '#94a3b8' }}>
                    Consultez la{' '}
                    <a
                      href="https://learn.microsoft.com/rest/api/power-bi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: '#3b82f6' }}
                    >
                      documentation officielle
                      <ExternalLink size={12} className="inline ml-1" />
                    </a>{' '}
                    pour les details complets de cet endpoint.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */

export default function ApiReference() {
  return (
    <div className="min-h-screen px-4 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4"
          style={{
            background: 'linear-gradient(135deg, #f2c811 0%, #0078d4 50%, #f2c811 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient-shift 6s ease infinite',
          }}
        >
          API Power BI & Fabric
        </h1>
        <p className="text-lg" style={{ color: '#94a3b8' }}>
          Automatisez et integrez vos solutions analytiques
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { label: 'Endpoints documentes', value: endpointCategories.reduce((s, c) => s + c.endpoints.length, 0) },
            { label: 'Templates de code', value: codeTemplates.length },
            { label: 'SDKs supportes', value: sdks.length },
            { label: 'Methodes d\'auth', value: authMethods.length },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#f2c811' }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <AuthSection />
      <EndpointsSection />
      <CodeTemplatesSection />
      <RateLimitsSection />
      <SDKSection />
      <ApiExplorer />

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </div>
  )
}
