# Authentication & RBAC Architecture

> Governing document for auth flow, role hierarchy, and permission enforcement.

---

## 1. Role Definitions

### Global Roles

| Role | Code | Description | Auto-assigned |
|------|------|-------------|---------------|
| **Admin** | `ADMIN` | Full system access. User management, system settings. | First user (superadmin) |
| **PM** | `PM` | Project management. Can create projects, manage sprints, assign tasks. | Manual assignment |
| **Developer** | `DEVELOPER` | Task execution. Can update assigned tasks, comment, upload. | Default on registration |
| **Viewer** | `VIEWER` | Read-only access across visible projects. | Manual assignment |

### Project Roles (per-project membership)

| Role | Code | Description | Assigned by |
|------|------|-------------|-------------|
| **Owner** | `OWNER` | Full project control. Cannot be removed. | Auto on project creation |
| **Admin** | `ADMIN` | Project settings, member management, sprint control. | Project Owner |
| **Member** | `MEMBER` | Task CRUD, commenting, sprint participation. | Project Admin+ |
| **Viewer** | `VIEWER` | Read-only project access. | Project Admin+ |

---

## 2. Permission Matrix

### Global Permissions

| Action | Admin | PM | Developer | Viewer |
|--------|-------|----|-----------|--------|
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View all users | ✅ | ✅ | ❌ | ❌ |
| Create project | ✅ | ✅ | ❌ | ❌ |
| View system analytics | ✅ | ❌ | ❌ | ❌ |
| AI usage stats | ✅ | ❌ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ |

### Project-Level Permissions

| Action | Owner | Admin | Member | Viewer |
|--------|-------|-------|--------|--------|
| Delete/archive project | ✅ | ❌ | ❌ | ❌ |
| Update project settings | ✅ | ✅ | ❌ | ❌ |
| Manage members | ✅ | ✅ | ❌ | ❌ |
| Create sprint | ✅ | ✅ | ❌ | ❌ |
| Start/complete sprint | ✅ | ✅ | ❌ | ❌ |
| Create task | ✅ | ✅ | ✅ | ❌ |
| Update any task | ✅ | ✅ | ❌ | ❌ |
| Update own/assigned task | ✅ | ✅ | ✅ | ❌ |
| Delete task | ✅ | ✅ | ❌ | ❌ |
| Add comment | ✅ | ✅ | ✅ | ❌ |
| Upload attachment | ✅ | ✅ | ✅ | ❌ |
| View project data | ✅ | ✅ | ✅ | ✅ |
| View project analytics | ✅ | ✅ | ✅ | ✅ |
| Create scorecard | ✅ | ✅ | ❌ | ❌ |
| AI suggestions | ✅ | ✅ | ✅ | ❌ |

---

## 3. Access Enforcement Strategy

### Layer 1: Router-Level (coarse-grained)

```python
# Global role check — applied via FastAPI dependency
@router.get("/", dependencies=[Depends(require_role(Role.ADMIN, Role.PM))])
async def list_users(): ...
```

### Layer 2: Service-Level (fine-grained)

```python
# Project-level role check — inside service method
async def update_task(self, task_id, data, current_user):
    task = await self.repo.get_or_raise(task_id)
    project_role = await self.project_repo.get_member_role(
        task.project_id, current_user.id
    )
    if project_role not in (ProjectRole.OWNER, ProjectRole.ADMIN):
        if task.assignee_id != current_user.id:
            raise InsufficientPermissionError()
```

### Layer 3: Object-Level (ownership)

```python
# Object ownership check — for self-service operations
if comment.author_id != current_user.id:
    raise InsufficientPermissionError("Cannot edit others' comments")
```

### Enforcement Order

1. **JWT validation** (middleware) → 401 if invalid/expired
2. **Global role check** (router dependency) → 403 if insufficient
3. **Project membership check** (service layer) → 403 if not a member
4. **Project role check** (service layer) → 403 if insufficient project role
5. **Object ownership check** (service layer) → 403 if not owner/assignee

---

## 4. Token Lifecycle

### Access Token (JWT)

| Property | Value |
|----------|-------|
| Algorithm | HS256 (symmetric) — migrate to RS256 for multi-service |
| TTL | 30 minutes |
| Storage | Client memory (JavaScript variable) — NOT localStorage |
| Payload | `{ sub: user_id, role: global_role, exp, iat, jti }` |
| Revocation | Not revocable (short-lived by design) |

### Refresh Token

| Property | Value |
|----------|-------|
| Format | Opaque random string (64 bytes, base64url) |
| TTL | 7 days |
| Storage | HTTP-only, Secure, SameSite=Lax cookie |
| Server-side | Stored in `refresh_tokens` table (hashed) |
| Revocation | Delete from DB (immediate) |
| Rotation | New refresh token issued on every `/refresh` call |

### Token Flow

```
1. Login → POST /api/v1/auth/login
   Response: { access_token, token_type: "bearer", expires_in: 1800 }
   Cookie: refresh_token (HTTP-only)

2. API Request → Authorization: Bearer {access_token}
   If 401 → goto step 3

3. Refresh → POST /api/v1/auth/refresh
   Cookie: refresh_token (sent automatically)
   Response: { access_token, token_type: "bearer", expires_in: 1800 }
   Cookie: new refresh_token (rotation)
   If 401 → redirect to login

4. Logout → POST /api/v1/auth/logout
   Server: delete refresh_token from DB
   Cookie: clear refresh_token
```

---

## 5. Refresh Strategy

### Automatic Refresh (Frontend)

```
Client-side interceptor (Axios):
1. On 401 response:
   a. Queue the failed request
   b. Call POST /api/v1/auth/refresh
   c. On success: retry queued request with new access token
   d. On failure: redirect to /login, clear auth state
2. Prevent concurrent refresh calls (use a lock/promise)
```

### Refresh Token Rotation

Every successful `/refresh` call:
1. Invalidates the old refresh token
2. Issues a new refresh token
3. If an already-used refresh token is presented:
   - **Revoke ALL refresh tokens for that user** (potential theft detected)
   - Force re-authentication

### Session Management

- Users can have up to **5 active refresh tokens** (multi-device support)
- Oldest token is revoked when limit exceeded
- Admin can revoke all sessions for a user
- Password change revokes all refresh tokens

---

## 6. Security Hardening

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcrypt with cost factor 12 |
| Password policy | Min 8 chars, no complexity requirement (NIST 800-63B) |
| Rate limiting on auth | 5 login attempts / minute per IP |
| Account lockout | Temporary lockout after 10 failed attempts (15 min) |
| CORS | Explicit origin whitelist, no wildcards |
| CSRF | SameSite=Lax cookie + custom header for mutations |
| JWT secret rotation | Support dual secrets during rotation period |
| Audit logging | All auth events logged (login, logout, failed attempts, password changes) |

---

## 7. Future Considerations

- **OAuth2/OIDC** — Google, GitHub SSO (post-MVP)
- **2FA/MFA** — TOTP-based (post-MVP)
- **API keys** — For CI/CD and external integrations
- **RS256 JWT** — When extracting auth as a separate service
- **Fine-grained permissions** — ABAC if RBAC becomes insufficient
