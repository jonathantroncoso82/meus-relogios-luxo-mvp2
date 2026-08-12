# Terraform / IaC — Esboço

> **Nota:** Vercel e Supabase possuem providers Terraform oficiais. O esboço abaixo cobre a infraestrutura provisionável via IaC.

```hcl
terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

# --- Projeto Vercel ---
resource "vercel_project" "relogios" {
  name      = "relogios-luxo"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "org/relogios-luxo"
  }
}

# --- Variaveis de Ambiente Vercel ---
resource "vercel_project_environment_variable" "database_url" {
  project_id = vercel_project.relogios.id
  key        = "DATABASE_URL"
  value      = var.database_url
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "auth_secret" {
  project_id = vercel_project.relogios.id
  key        = "AUTH_SECRET"
  value      = var.auth_secret
  target     = ["production"]
  sensitive  = true
}

# --- Projeto Supabase ---
resource "supabase_project" "relogios_db" {
  name            = "relogios-luxo-db"
  organization_id = var.supabase_org_id
  region          = "sa-east-1"
  database_password = var.db_password
}

# --- Variaveis sensiveis (nao commitadas) ---
variable "database_url"    { sensitive = true }
variable "auth_secret"     { sensitive = true }
variable "db_password"     { sensitive = true }
variable "supabase_org_id" {}

# --- Outputs ---
output "vercel_url" {
  value = vercel_project.relogios.id
}
output "supabase_db_host" {
  value     = supabase_project.relogios_db.database.host
  sensitive = true
}
```

## Notas
- Migrations Prisma executadas via `prisma migrate deploy` no pipeline CI/CD, não via Terraform.
- RLS policies aplicadas via migration SQL versionada no Prisma.
- State armazenado em Terraform Cloud ou S3 com lock DynamoDB.
