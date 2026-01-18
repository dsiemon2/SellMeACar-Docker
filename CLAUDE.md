# Project Conventions for Claude Code

## UI Component Standards

### Action Buttons
ALL action buttons must have Bootstrap tooltips:
```html
<button class="btn btn-sm btn-outline-primary"
        data-bs-toggle="tooltip"
        title="Describe what this button does">
  <i class="bi bi-icon-name"></i>
</button>
```

### Data Tables/Grids
ALL tables displaying data must include:

1. **Row Selection**
   - Checkbox column as first column
   - "Select All" checkbox in header
   - Individual row checkboxes
   - Selected row highlighting (`.selected` class)
   - Bulk actions toolbar that appears when rows selected

2. **Pagination**
   - Page size selector (10/25/50/100 per page)
   - Page number navigation
   - "Showing X-Y of Z items" info text
   - Previous/Next buttons

3. **Required CSS**
```css
.bulk-actions { display: none; background: #e3f2fd; padding: 0.75rem 1rem; border-radius: 8px; }
.bulk-actions.show { display: flex; }
.row-checkbox { cursor: pointer; }
tr.selected { background-color: #e3f2fd !important; }
```

4. **Required JS** (initialize tooltips on all pages)
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
});
```

### Table Structure Template
```html
<!-- Bulk Actions Toolbar -->
<div class="bulk-actions mb-3" id="bulkActions">
  <span class="me-3"><strong id="selectedCount">0</strong> selected</span>
  <button class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" title="Delete selected">
    <i class="bi bi-trash"></i> Delete Selected
  </button>
</div>

<div class="card">
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th style="width: 40px;">
            <input type="checkbox" class="form-check-input" id="selectAll" data-bs-toggle="tooltip" title="Select all">
          </th>
          <!-- other columns -->
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- rows with checkboxes -->
      </tbody>
    </table>
  </div>

  <!-- Pagination Footer -->
  <div class="card-footer bg-white d-flex justify-content-between align-items-center">
    <div class="text-muted small">Showing <span id="showingStart">1</span>-<span id="showingEnd">10</span> of <span id="totalRows">0</span></div>
    <nav>
      <ul class="pagination pagination-sm mb-0" id="pagination">
        <!-- pagination controls -->
      </ul>
    </nav>
    <select class="form-select form-select-sm" id="pageSize" style="width: auto;">
      <option value="10">10 / page</option>
      <option value="25">25 / page</option>
      <option value="50">50 / page</option>
    </select>
  </div>
</div>
```

## Tech Stack
- Backend: Node.js + Express + TypeScript
- Database: Prisma + SQLite
- Frontend: EJS templates + Bootstrap 5 + Bootstrap Icons
- Real-time: WebSockets (OpenAI Realtime API)

## File Structure
- `src/` - Backend TypeScript source
- `views/` - EJS templates
- `views/admin/` - Admin panel pages
- `prisma/` - Database schema and migrations

## Admin Panel Routes
All admin routes require `?token=<ADMIN_TOKEN>` query parameter.

---

## Agent Capabilities

When working on this project, apply these specialized behaviors:

### Backend Architect
- Design Express routes for vehicle data and training scenarios
- Implement Ford-specific product knowledge systems
- Structure dealership training workflows
- Handle practice session management

### AI Engineer
- Design realistic car buyer personas:
  - First-time buyer (nervous, needs guidance)
  - Trade-in customer (wants best value)
  - Family buyer (safety focused)
  - Truck buyer (capability focused)
  - Budget conscious (price negotiator)
- Evaluate: product knowledge, needs assessment, feature presentation, closing
- Voice interaction via OpenAI Realtime API

### Database Admin
- Prisma schema for Ford vehicles, scenarios, sessions
- Store vehicle specifications and features
- Track user performance by scenario type
- Handle training session recordings

### Security Auditor
- Secure training session data
- Validate admin access tokens
- Protect dealership and user data
- Review Ford product data handling

### Content Creator
- Write Ford vehicle specifications for training
- Create realistic car buyer scenarios
- Design common objection scripts:
  - "I need to think about it"
  - "The price is too high"
  - "I can get a better deal elsewhere"
- Structure financing and trade-in scenarios

### Code Reviewer
- Enforce TypeScript patterns
- Review vehicle data accuracy
- Validate training evaluation logic
- Check voice interaction handling
